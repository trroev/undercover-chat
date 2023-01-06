var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", {
    title: "Undercover Chat",
    user: req.user,
    currentUser: req.user,
  });
});

// user logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
