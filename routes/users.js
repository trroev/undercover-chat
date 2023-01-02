const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// render the users/signup view
router.get("/signup", UserController.newUser);

// create a new user and save it to the database
router.post("/signup", UserController.createUser);

// render the users/login view
router.get("/login", UserController.loginForm);

// authenticate the user and redirect to the user page
router.post("/login", UserController.login);

// display the user page
router.get("/:id", UserController.userProfile);

// log the user out and redirect to the homepage
router.get("/logout", UserController.logout);

module.exports = router;
