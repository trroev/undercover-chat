const passport = require("passport");
const User = require("../models/user");

// render the users/signup view with a new, empty User object
exports.newUser = (req, res) => {
  res.render("users/signup", { title: "Sign Up", user: new User() });
};

// create a new user and save it to the database
exports.createUser = (req, res, next) => {
  // create a new user object with the provided username and password
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  // save the user to the database
  User.register(user, req.body.password, (err) => {
    // handle any errors
    if (err) {
      return next(err);
    }
    // authenticate the user and redirect to the user page
    passport.authenticate("local")(req, res, function () {
      res.redirect(`/users/${user.id}`);
    });
  });
};

// render the users/login view
exports.loginForm = (req, res) => {
  res.render("users/login", { title: "Log In" });
};

// authenticate the user and redirect to the user page
exports.login = (req, res, next) => {
  // check if the provided password was entered correctly
  if (req.body.password === req.body.password) {
    // authenticate the user and redirect to the home page
    passport.authenticate("local", {
      successRedirect: "/users/profile",
      failureRedirect: "/users/login",
    })(req, res, next);
  } else {
    // password was not entered correctly, redirect back to the login form
    res.redirect("/users/login");
  }
};

// display the user profile
exports.userProfile = (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render("users/profile", {
      title: `Profile: ${user.username}`,
      user: user,
    });
  });
};

// log the user out and redirect to the home page
exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
