const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = {
	createAccessToken(payload) {
		const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "3m",
		});

		return accessToken;
	},

	createRefreshToken(payload) {
		const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: "3h",
		});

		return refreshToken;
	},

	verifyAccessToken(req, res, next) {
		const headerContent = req.headers.authorization || req.query.accessToken;
		const token = headerContent && headerContent.split(" ").pop();

		if (!token) return res.status(401).send("Missing accessToken.");

		try {
			req.jwtPayload = {};

			const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

			req.jwtPayload = payload;

			next();
		} catch (errors) {
			return res.status(403).send("Error while verify accessToken.");
		}
	},

	verifyTokenBoolean(token, secretKey = process.env.ACCESS_TOKEN_SECRET) {
		if (!token) return false;

		try {
			jwt.verify(token, secretKey);

			return true;
		} catch (err) {
			return false;
		}
	},
};
