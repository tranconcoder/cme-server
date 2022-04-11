const express = require("express");
const router = express.Router();

const ctrlerDownoad = require("../controllers/ctrlerDownload.js");

router.get("/excel-form", ctrlerDownoad.excelForm);

module.exports = router;
