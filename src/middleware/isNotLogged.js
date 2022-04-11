module.exports = (req, res, next) => {
	console.log(req.user);
	if (!req.user?.googleId) {
		next();
	} else {
		res.redirect("/auth/success");
	}
};
