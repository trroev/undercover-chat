const passport = require("passport");
const User = require("../models/user");

// render the users/signup view with a new, empty User object
exports.newUser = (req, res) => {
  res.render("users/signup", {
    title: "Sign Up",
    currentUser: req.user,
    user: new User(),
  });
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
  res.render("users/login", {
    title: "Log In",
    currentUser: req.user,
    user: req.user,
  });
};

// authenticate the user and redirect to the user page
exports.login = (req, res, next) => {
  // authenticate the user
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/users/login", {
        title: "Log In",
        user: req.user,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      if (user.isMember) {
        return res.render("users/profile", {
          title: `Profile: ${user.username}`,
          user: user,
          message: {},
          currentUser: req.user,
          memberSince: new Date().toLocaleDateString(),
        });
      } else {
        return res.redirect("/users/profile");
      }
    });
  })(req, res, next);
};

// display the user profile
exports.userProfile = (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    let memberSince;
    if (user.isMember) {
      memberSince = user.memberSince;
    }
    res.render("users/profile", {
      title: `Profile: ${user.username}`,
      user: user,
      message: {},
      currentUser: req.user,
      memberSince: memberSince,
    });
  });
};

exports.secretPassword = (req, res, next) => {
  if (
    req.body.secretPassword === "newspaper" ||
    req.body.secretPassword === "a newspaper"
  ) {
    // Update the user's isMember field
    User.findByIdAndUpdate(
      req.user._id,
      { isMember: true },
      (err, user) => {
        if (err) {
          return next(err);
        }
        // Redirect the user to their profile
        res.render("users/profile", {
          title: `Profile: ${user.username}`,
          user: user,
          message: {},
          currentUser: req.user,
          memberSince: new Date().toDateString(),
        });
      }
    );
  } else {
    // Find the user in the database using their id
    User.findById(req.user._id, (err, user) => {
      if (err) {
        return next(err);
      }
      // Render the profile page with the secretPassword variable set to "incorrect"
      res.render("users/profile", {
        title: `Profile: ${user.username}`,
        user: user,
        message: {},
        currentUser: req.user,
        secretPassword: "incorrect",
      });
    });
  }
};

// log the user out and redirect to the home page
exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
