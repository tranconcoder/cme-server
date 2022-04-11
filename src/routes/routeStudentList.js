const express = require("express");
const router = express.Router();
const tokenMethod = require("../middleware/tokenMethods");

const ctrlerStudentList = require("../controllers/ctrlerStudentList");

router.get("/get-all", tokenMethod.verifyToken, ctrlerStudentList.getAllClassInfo);
router.put("/set-all", tokenMethod.verifyToken, ctrlerStudentList.setAllClassInfo);
router.put("/create", ctrlerStudentList.create);

module.exports = router;
