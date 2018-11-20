const { send } = require("micro");
const compose = require("micro-compose");
const microAuthGoogle = require("microauth-google");
const microAuthGithub = require("microauth-github");

const githubOptions = {
	clientId:     process.env.GH_CLIENT_ID,
	clientSecret: process.env.GH_CLIENT_SECRET,
	callbackUrl:  "http://localhost:3000/auth/github/callback",
	path:         "/auth/github",
	scope:        "user"
};

const googleOptions = {
	clientId:     "client_id",
	clientSecret: "client_secret",
	callbackUrl:  "http://auth.yodata.me/auth/google/callback",
	path:         "/auth/google",
	scope:        "identity.basic,identity.team,identity.avatar"
};

const googleAuth = microAuthGoogle(googleOptions);
const githubAuth = microAuthGithub(githubOptions);

const handler = async (req, res, auth) => {

	if (!auth) {
		return send(res, 404, "Not Found");
	}

	if (auth.err) {
		console.error(auth.err);
		return send(res, 403, "Forbidden");
	}

	if (auth.result.provider === "github") {
		return `${auth.result.provider} provider. Hello ${auth.result.info.login}`;
	} else if (auth.result.provider === "google") {
		return `${auth.result.provider} provider. Hello ${auth.result.info.user.name}`;
	} else {
		return "Unknown provider";
	}

};

module.exports = compose(
	githubAuth
)(handler);
