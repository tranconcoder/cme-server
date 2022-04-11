const express = require("express");
const router = express.Router();
const studentInfoDb = require("../resources/config/models/studentInfo");

// Add new student
router.get("/add", (req, res, next) => {});

router.post("/add", (req, res, next) => {
	console.log(req.body);

	if (Object.keys(req.body).length) {
		studentInfoDb
			.create(req.body)
			.then((data) => {
				res.redirect("/student/add/success");
			})
			.catch(() => {
				res.json({ status: "Error to save data!" });
			});
	}
});

router.get("/add/success", (req, res, next) => {
	res.render("addStudent/addStudentSuccess");
});

module.exports = router;
