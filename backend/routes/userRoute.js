const express = require("express");
const { register, login, logout, checkLogin, updateCredits, updatePlan } = require("../controllers/userController.js");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/checkLogin").get(checkLogin);
router.route("/updateCredits").post(updateCredits);
router.route("/updatePlan").post(updatePlan);

module.exports = router;