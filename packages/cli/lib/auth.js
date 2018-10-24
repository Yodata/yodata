'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')
const url = require('url')
const _ = require('lodash')
const clc = require('cli-color')
const jwt = require('jsonwebtoken')
const opn = require('opn')
const portfinder = require('portfinder')

const api = require('./api')
const configstore = require('./configstore')
const FirebaseError = require('./error')
const logger = require('./logger')
const prompt = require('./prompt')
const scopes = require('./scopes')

portfinder.basePort = 9005

const open = function(url) {
	opn(url).catch(err => {
		logger.debug('Unable to open URL: ' + err.stack)
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
const _getPort = portfinder.getPortPromise

// In-memory cache, so we have it for successive calls
let lastAccessToken = {}

const _getCallbackUrl = function(port) {
	if (_.isUndefined(port)) {
		return 'urn:ietf:wg:oauth:2.0:oob'
	}
	return 'http://localhost:' + port
}

const _getLoginUrl = function(callbackUrl) {
	return (
		api.authOrigin +
		'/o/oauth2/auth?' +
		_.map(
			{
				client_id: api.clientId,
				scope: SCOPES.join(' '),
				response_type: 'code',
				state: _nonce,
				redirect_uri: callbackUrl
			},
			(v, k) => {
				return k + '=' + encodeURIComponent(v)
			}
		).join('&')
	)
}

const _getTokensFromAuthorizationCode = function(code, callbackUrl) {
	return api
		.request('POST', '/o/oauth2/token', {
			origin: api.authOrigin,
			form: {
				code,
				client_id: api.clientId,
				client_secret: api.clientSecret,
				redirect_uri: callbackUrl,
				grant_type: 'authorization_code'
			}
		})
		.then(
			res => {
				if (
					!_.has(res, 'body.access_token') &&
					!_.has(res, 'body.refresh_token')
				) {
					logger.debug('Token Fetch Error:', res.statusCode, res.body)
					throw INVALID_CREDENTIAL_ERROR
				}
				lastAccessToken = _.assign(
					{
						expires_at: Date.now() + res.body.expires_in * 1000
					},
					res.body
				)
				return lastAccessToken
			},
			err => {
				logger.debug('Token Fetch Error:', err.stack)
				throw INVALID_CREDENTIAL_ERROR
			}
		)
}

const _respondWithFile = function(req, res, statusCode, filename) {
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

const _loginWithoutLocalhost = function() {
	const callbackUrl = _getCallbackUrl()
	const authUrl = _getLoginUrl(callbackUrl)

	logger.info()
	logger.info('Visit this URL on any device to log in:')
	logger.info(clc.bold.underline(authUrl))
	logger.info()

	open(authUrl)

	return prompt({}, [
		{
			type: 'input',
			name: 'code',
			message: 'Paste authorization code here:'
		}
	])
		.then(answers => {
			return _getTokensFromAuthorizationCode(answers.code, callbackUrl)
		})
		.then(tokens => {
			return {
				user: jwt.decode(tokens.id_token),
				tokens,
				scopes: SCOPES
			}
		})
}

const _loginWithLocalhost = function(port) {
	return new Promise((resolve, reject) => {
		const callbackUrl = _getCallbackUrl(port)
		const authUrl = _getLoginUrl(callbackUrl)

		var server = http.createServer((req, res) => {
			let tokens
			const query = _.get(url.parse(req.url, true), 'query', {})

			if (query.state === _nonce && _.isString(query.code)) {
				return _getTokensFromAuthorizationCode(query.code, callbackUrl)
					.then(result => {
						tokens = result
						return _respondWithFile(
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
						return _respondWithFile(
							req,
							res,
							400,
							'../templates/loginFailure.html'
						)
					})
			}
			_respondWithFile(req, res, 400, '../templates/loginFailure.html')
		})

		server.listen(port, () => {
			logger.info()
			logger.info('Visit this URL on any device to log in:')
			logger.info(clc.bold.underline(authUrl))
			logger.info()
			logger.info('Waiting for authentication...')

			open(authUrl)
		})

		server.on('error', () => {
			_loginWithoutLocalhost().then(resolve, reject)
		})
	})
}

const login = function(localhost) {
	if (localhost) {
		return _getPort().then(_loginWithLocalhost, _loginWithoutLocalhost)
	}
	return _loginWithoutLocalhost()
}

const _haveValidAccessToken = function(refreshToken, authScopes) {
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

const _logoutCurrentSession = function(refreshToken) {
	const tokens = configstore.get('tokens')
	const currentToken = _.get(tokens, 'refresh_token')
	if (refreshToken === currentToken) {
		configstore.del('user')
		configstore.del('tokens')
		configstore.del('usage')
		configstore.del('analytics-uuid')
	}
}

const _refreshAccessToken = function(refreshToken, authScopes) {
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

const getAccessToken = function(refreshToken, authScopes) {
	if (_haveValidAccessToken(refreshToken, authScopes)) {
		return Promise.resolve(lastAccessToken)
	}
	return _refreshAccessToken(refreshToken, authScopes)
}

const logout = function(refreshToken) {
	if (lastAccessToken.refresh_token === refreshToken) {
		lastAccessToken = {}
	}
	_logoutCurrentSession(refreshToken)
	return api.request(
		'GET',
		'/o/oauth2/revoke',
		{
			origin: api.authOrigin,
			data: {
				token: refreshToken
			}
		},
		() => {
			throw new FirebaseError('Authentication Error.', {
				exit: 1
			})
		}
	)
}

const auth = {
	login,
	getAccessToken,
	logout
}

module.exports = auth
