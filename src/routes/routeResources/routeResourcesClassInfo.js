const express = require("express");
const router = express.Router();

const {
	tokenMethods: { verifyAccessToken },
} = require("../../middleware/index");

const classInfoController = require("../../controllers/ctrlerClassInfo");

router.get("/add-student-form/:googleId/:classInfoId", classInfoController.renderAddStudentForm);
router.get("/add-student-success", classInfoController.renderAddStudentSuccess);
router.post("/check-form-password", classInfoController.checkFormPassword);
router.post(
	"/change-online-form-password",
	verifyAccessToken,
	classInfoController.changeOnlineFormPassword
);
router.post("/check-unique-info", classInfoController.checkUniqueInfo);
router.post("/add-student", classInfoController.addStudent);

router.get("/get", verifyAccessToken, classInfoController.get);
router.get("/get-all", verifyAccessToken, classInfoController.getAll);
router.post("/add", verifyAccessToken, classInfoController.add);
router.patch("/update", verifyAccessToken, classInfoController.update);
router.delete("/delete", verifyAccessToken, classInfoController.delete);

module.exports = router;
