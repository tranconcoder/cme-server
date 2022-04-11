const { io } = require("../index");
const {
	socket: { socketAuthToken },
} = require("../middleware");

const classInfoSocket = io.of("/class-info");

classInfoSocket.on("connection", socket => {
	socket.join(socket.googleId);
});

classInfoSocket.use(socketAuthToken);

const emitCreateClassInfo = (googleId, newClassInfo) => {
	classInfoSocket.to(googleId).emit("create-class", newClassInfo);
};

const emitChangeClassInfo = (googleId, updatedClassInfo) => {
	console.log(updatedClassInfo);

	classInfoSocket.to(googleId).emit("change-class", updatedClassInfo);
};

const emitDeleteClassInfo = (googleId, classInfoNameToUpdate) => {
	classInfoSocket.to(googleId).emit("delete-class", classInfoNameToUpdate);
};

module.exports = {
	emitCreateClassInfo,
	emitChangeClassInfo,
	emitDeleteClassInfo,
};
