const jwt = require("jsonwebtoken");

const tokenMethods = require("../middleware/tokenMethods");
const { tokenPayloadTransformer } = require("../middleware/transformer");

require("dotenv").config();

class Token {
	async updateRefreshToken(req, res) {
		const { refreshToken } = req.query;

		if (!refreshToken) {
			return res.status(403).send("Missing refreshToken.");
		}

		// Verify token
		try {
			const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

			// Create and add new refresh token to db
			const newRefreshTokenPayload = tokenPayloadTransformer(payload);
			const newRefreshToken = tokenMethods.createRefreshToken(newRefreshTokenPayload);

			res.json(newRefreshToken);
		} catch (errors) {
			res.status(403).send("Can't update refreshToken: " + errors);
		}
	}

	getNewAccessToken(req, res) {
		const { refreshToken } = req.query;

		if (!refreshToken) return res.status(401).send("Missing refreshToken!");

		try {
			const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

			const newAccessTokenPayload = tokenPayloadTransformer(payload);
			const newAccessToken = tokenMethods.createAccessToken(newAccessTokenPayload);

			return res.json(newAccessToken);
		} catch (errors) {
			res.status(403).send("Error while get new access token: " + errors);
		}
	}

	verifyToken(req, res) {
		try {
			const isAccessToken = req.body.tokenType === "access";
			const token = req.headers.authorization && req.headers.authorization.split(" ").at(-1);

			if (isAccessToken) {
				// If token type is access token
				const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

				return res.json(tokenMethods.verifyTokenBoolean(token, ACCESS_TOKEN_SECRET));
			} else {
				// If token type is refresh token
				const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

				res.json(tokenMethods.verifyTokenBoolean(token, REFRESH_TOKEN_SECRET));
			}
		} catch (errors) {
			res.status(403).send("Error while verifyToken." + errors);
		}
	}
}

module.exports = new Token();
