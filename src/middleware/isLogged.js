module.exports = (req, res, next) => {
	if (req.user?.googleId) {
		next();
	} else {
		res.redirect("/auth/google/login");
	}
};
