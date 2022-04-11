const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const handlebars = require("express-handlebars");

require("dotenv").config();

const PORT = process.env.PORT || process.env.LOCAL_PORT;
const HOST = JSON.parse(process.env.HOST_LIST)[process.env.HOST_INDEX];

app.engine(
	".hbs",
	handlebars.engine({
		extname: ".hbs",
		helpers: {
			toJson: (variableToJson) => JSON.stringify(variableToJson),
		},
	})
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources/views"));

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Login route (passport)
require("./passport")(app);

// Socket server
const {
	socket: { createSocketServer },
} = require("./middleware");

const [server, io] = createSocketServer(app);

module.exports = { io };

require("./socket/index");

// All route
const routeIndex = require("./routes/routeIndex");
routeIndex(app);

// Run server after connect mongoDb
new Promise((resolve) => resolve(require("./resources/config/db/mongoose")))
	.then((db) => db.connect())
	.then(() => {
		server.listen(PORT, () => console.log(`Server is started! - ${HOST}`));
	});
