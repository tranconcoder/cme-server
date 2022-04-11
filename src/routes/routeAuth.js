const express = require("express");
const router = express.Router();

const ctrlerAuth = require("../controllers/ctrlerAuth");

router.get("/logout", ctrlerAuth.logout);
router.get("/get-profile", ctrlerAuth.getProfile);
router.get("/login-success", ctrlerAuth.loginSuccess);
router.get("/login-fail", ctrlerAuth.loginFail);
router.get("/logout-success", ctrlerAuth.logoutSuccess);

module.exports = router;
