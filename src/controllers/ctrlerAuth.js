const jwt = require("jsonwebtoken");

const userDb = require("../resources/config/models/user");
const { tokenPayloadTransformer } = require("../middleware/transformer");
const tokenDb = require("../resources/config/models/token");

class Auth {
	async loginSuccess(req, res) {
		const { user: userSession } = req;

		if (!userSession) return res.status(404).send("Not found userSession!");

		const user = await userDb
			.findOne({
				googleId: userSession.googleId,
			})
			.catch((errors) => errors && console.log(errors));
		if (!user) return res.status(404).send("Not found user data!");

		const refreshToken = await tokenDb
			.findOne({
				uuid: userSession.uuid,
				ownerGoogleId: userSession.googleId,
			})
			.then((data) => data.refreshToken)
			.catch((errors) => errors && console.log(errors));
		if (!refreshToken) return res.status(404).send("Not found refreshToken");

		const userInfoToRender = {
			...tokenPayloadTransformer(user),
			refreshToken,
		};

		res.render("loginSuccess/loginSuccess", userInfoToRender);
	}

	async logout(req, res) {
		const { user: userSession } = req;

		// If haven't userSession -> logged out
		if (!userSession) return res.redirect("/auth/logout-success");

		// Logout session
		req.logout();

		// Remove refreshToken in TokenDb
		tokenDb.findOneAndRemove(
			{
				uuid: userSession.uuid,
				googleId: userSession.googleId,
			},
			(errors) =>
				errors
					? res.status(417).send("Can't remove old refreshToken in TokenDb." + errors)
					: res.redirect("/auth/logout-success")
		);
	}

	loginFail(req, res) {
		res.redirect("back");
	}

	logoutSuccess(req, res) {
		res.render("logoutSuccess/logoutSuccess");
	}

	getProfile(req, res) {
		const { accessToken } = req.query;

		if (!accessToken) return res.status(401).send("Missing accessToken.");

		try {
			const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

			userDb.findOne({ googleId: payload.googleId }).then((user) => {
				res.json(user);
			});
		} catch (errors) {
			res.status(400).send(errors);
		}
	}
}

module.exports = new Auth();
