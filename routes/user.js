const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsyc = require("../utils/wrapAsyc");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");


// Signup Get and Post
router
    .route("/signup")
    .get(userController.renderSignupForm )
    .post(wrapAsyc(userController.signup));


router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl, 
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true
        }), 
        userController.login 
    );

router.get("/logout", userController.logout);


/*
router.get("/signup", userController.renderSignupForm );

router.post("/signup", wrapAsyc(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post("/login",
    saveRedirectUrl, 
    passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
    }), 
    userController.login 
); 
*/


module.exports = router;