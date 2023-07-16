const express = require("express");
const router = express.Router();
const 
{ 
    registerUser, 
    validRegister, 
    getVerificationCode,
    loginUser,
    dashboard,
    getUser,
    logoutUser,
    removeExpiredToken,
    resetPassword,
    searchUserByEmail,
} 
= require("../controller/user");
const { authenticate, validForm } = require("../auth/auth");

router.route("/register").post(registerUser);
router.route("/register/validation").post(validRegister);
router.route("/verification/code").get(getVerificationCode);
router.route("/login").post(validForm, loginUser);
router.route("/dashboard").get(authenticate, dashboard);
router.route("/user/:id").get(getUser);
router.route("/logout/:id").patch(logoutUser);
router.route("/user/expire/:id").patch(removeExpiredToken);
router.route("/user/resetPassword/:id").patch(resetPassword);
router.route("/user/verify/:email").get(searchUserByEmail);

module.exports = router;