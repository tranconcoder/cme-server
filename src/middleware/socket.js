const jwt = require("jsonwebtoken");
const { createServer } = require("http");

const createSocketServer = (app) => {
	const server = createServer(app);
	const io = require("socket.io")(server, {
		reconnectionDelayMax: 20000,
		cors: {
			origin: ["https://meet.google.com", "https://cons-meeting-education.herokuapp.com"],
		},
		path: "/socket",
	});

	return [server, io];
};

const socketAuthToken = (socket, next) => {
	const { accessToken } = socket.handshake.auth;

	if (accessToken) {
		try {
			const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

			Object.assign(socket, payload);

			return next();
		} catch (errors) {
			return next(new Error(errors));
		}
	}

	return next(new Error("Missing accessToken."));
};

module.exports = { createSocketServer, socketAuthToken };
