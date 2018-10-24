/* eslint-disable camelcase */
'use strict'

const querystring = require('querystring')
const url = require('url')
const fs = require('fs')
const http = require('http')
const path = require('path')
const rp = require('request-promise')

const GH_CLIENT_ID = '4c386bc439e679a65db0'
const GH_CLIENT_SECRET = 'a4796c6717ed46df286bfe5502df48921bfd6940'
const GH_CALLBACK_URL = 'http://localhost:3000/auth/github/callback'

const _ = require('lodash')
const clc = require('cli-color')
const jwt = require('jsonwebtoken')
const opn = require('opn')

const configstore = require('../lib/configstore')
const FirebaseError = require('../lib/error')

const logger = console
const scopes = require('../lib/scopes')

const open = function (url) {
	opn(url).catch(error => {
		logger.debug('Unable to open URL: ' + error.stack)
	})
}

const INVALID_CREDENTIAL_ERROR = new FirebaseError(
	'Authentication Error: Your credentials are no longer valid. Please run ' +
		clc.bold('firebase login --reauth') +
		'\n\n' +
		'For CI servers and headless environments, generate a new token with ' +
		clc.bold('firebase login:ci'),
	{exit: 1}
)

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000
const SCOPES = [
	scopes.EMAIL,
	scopes.OPENID,
	scopes.CLOUD_PROJECTS_READONLY,
	scopes.FIREBASE_PLATFORM,
	scopes.CLOUD_PLATFORM
]

const _nonce = _.random(1, 2 << 29).toString()

// In-memory cache, so we have it for successive calls
let lastAccessToken = {}

const getTokenFromAuthorizationCode = function (code, callbackUrl) {
	return rp(`https://github.com/login/oauth/access_token?${querystring.stringify({
		client_id: GH_CLIENT_ID,
		client_secret: GH_CLIENT_SECRET,
		code,
		redirect_uri: callbackUrl,
		state: _nonce
	})}`).then(res => {
		console.log('getTokenRes=', res)
		return res
	})
}

const respondWithFile = function (req, res, statusCode, filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(path.join(__dirname, filename), (err, response) => {
			if (err) {
				return reject(err)
			}
			res.writeHead(statusCode, {
				'Content-Length': response.length,
				'Content-Type': 'text/html'
			})
			res.end(response)
			req.socket.destroy()
			return resolve()
		})
	})
}

const _haveValidAccessToken = function (refreshToken, authScopes) {
	if (_.isEmpty(lastAccessToken)) {
		const tokens = configstore.get('tokens')
		if (refreshToken === _.get(tokens, 'refresh_token')) {
			lastAccessToken = tokens
		}
	}

	return (
		_.has(lastAccessToken, 'access_token') &&
		lastAccessToken.refresh_token === refreshToken &&
		// Verify that the exact same scopes are being used for this request
		_.isEqual(authScopes.sort(), (lastAccessToken.scopes || []).sort()) &&
		_.has(lastAccessToken, 'expires_at') &&
		lastAccessToken.expires_at > Date.now() + FIFTEEN_MINUTES_IN_MS
	)
}

const _refreshAccessToken = function (refreshToken, authScopes) {
	logger.debug(
		'> refreshing access token with scopes:',
		JSON.stringify(authScopes)
	)
	return api
		.request(
			'POST',
			'/oauth2/v3/token',
			{
				origin: api.googleOrigin,
				form: {
					refresh_token: refreshToken,
					client_id: api.clientId,
					client_secret: api.clientSecret,
					grant_type: 'refresh_token',
					scope: (authScopes || []).join(' ')
				}
			},
			{skipRequestBody: true}
		)
		.then(
			res => {
				if (!_.isString(res.body.access_token)) {
					throw INVALID_CREDENTIAL_ERROR
				}
				lastAccessToken = _.assign(
					{
						expires_at: Date.now() + res.body.expires_in * 1000,
						refresh_token: refreshToken,
						scopes: authScopes
					},
					res.body
				)

				const currentRefreshToken = _.get(
					configstore.get('tokens'),
					'refresh_token'
				)
				if (refreshToken === currentRefreshToken) {
					configstore.set('tokens', lastAccessToken)
				}

				return lastAccessToken
			},
			err => {
				if (_.get(err, 'context.body.error') === 'invalid_scope') {
					throw new FirebaseError(
						'This command requires new authorization scopes not granted to your current session. Please run ' +
							clc.bold('firebase login --reauth') +
							'\n\n' +
							'For CI servers and headless environments, generate a new token with ' +
							clc.bold('firebase login:ci'),
						{exit: 1}
					)
				}

				throw INVALID_CREDENTIAL_ERROR
			}
		)
}

const getAccessToken = function (refreshToken, authScopes) {
	if (_haveValidAccessToken(refreshToken, authScopes)) {
		return Promise.resolve(lastAccessToken)
	}
	return _refreshAccessToken(refreshToken, authScopes)
}

const loginWithLocalHost = function (port = 3000) {
	return new Promise((resolve, reject) => {
		const callbackUrl = GH_CALLBACK_URL
		const qs = querystring.stringify({
			client_id: GH_CLIENT_ID,
			state: _nonce,
			redirect_uri: callbackUrl,
			scope: 'user',
			response_type: 'code'
		})
		const authUrl = `https://github.com/login/oauth/authorize?${qs}`

		const server = http.createServer((req, res) => {
			let tokens
			const query = _.get(url.parse(req.url, true), 'query', {})

			if (query.state === _nonce && _.isString(query.code)) {
				return getTokenFromAuthorizationCode(query.code, callbackUrl)
					.then(result => {
						console.log({result})
						tokens = result
						return respondWithFile(
							req,
							res,
							200,
							'../templates/loginSuccess.html'
						)
					})
					.then(() => {
						server.close()
						return resolve({
							user: jwt.decode(tokens.id_token),
							tokens
						})
					})
					.catch(() => {
						return respondWithFile(
							req,
							res,
							400,
							'../templates/loginFailure.html'
						)
					})
			}
			respondWithFile(req, res, 400, '../templates/loginFailure.html')
		})

		server.listen(port, () => {
			logger.info()
			logger.info('Visit this URL on any device to log in:')
			logger.info(clc.bold.underline(authUrl))
			logger.info()
			logger.info('Waiting for authentication...')

			open(authUrl)
		})

		server.on('error', error => {
			console.error(error)
			reject(error)
		})
	})
}

module.exports = loginWithLocalHost

