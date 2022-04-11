const express = require("express");
const router = express.Router();
const path = require("path");

// Create new userId
router.get("/", (req, res, next) => {
	res.send(" <p>Not found!</p> ");
	// res.render("homePage/homePage");
});

router.get("/download", (req, res, next) => {
	const file = path.join(__dirname, "../public/files/CONS_Meeting_Education-130122-2.zip");

	// res.download(file, (err) => {
	// 	if (err) console.log(err);
	// });
});

module.exports = router;
