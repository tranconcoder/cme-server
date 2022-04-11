const passport = require("passport");
const cookieSession = require("cookie-session");
const middleWares = require("./middleware/index");

module.exports = function (app) {
	// Passport -> Google
	require("./googleLogin");

	app.use(
		cookieSession({
			name: "cme-app",
			keys: ["key1", "key2"],
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	app.get(
		"/auth/google/login",
		middleWares.isNotLogged,
		passport.authenticate("google", {
			scope: ["profile", "email"],
		})
	);
	app.get(
		"/auth/google/re-login",
		(req, res, next) => {
			req.logout();

			next();
		},
		passport.authenticate("google", {
			scope: ["profile", "email"],
		})
	);
	app.get(
		"/auth/google/callback",
		passport.authenticate("google", {
			successRedirect: "/auth/login-success",
			failureRedirect: "/auth/login-fail",
		})
	);
};
