const routeStudent = require("./routeAddStudent");
const routeManager = require("./routeManager");
const routeHomePage = require("./routeHomePage");
const routeAuth = require("./routeAuth");
const routeDownload = require("./routeDownload");
const routeToken = require("./routeToken");
const routeResources = require("./routeResources/routeResources");

function RouteIndex(app) {
	app.use("/auth", routeAuth);
	app.use("/download", routeDownload);
	app.use("/token", routeToken);
	app.use("/student", routeStudent);
	app.use("/resources", routeResources);
	app.use("/manager", routeManager);
	app.use("/", routeHomePage);
}

module.exports = RouteIndex;
