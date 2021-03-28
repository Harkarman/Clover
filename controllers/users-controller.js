const User = require("../models/user");

module.exports.profile = function (req, res) {
  return res.render("user-profile", {
    title: "User Profile",
  });
};

//Sign up
module.exports.signUp = function (req, res) {
  return res.render("user-sign-up", {
    title: "Clover | Sign Up",
  });
};
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user during sign up");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating user during sign up");
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

//Sign In
module.exports.signIn = function (req, res) {
  return res.render("user-sign-in", {
    title: "Clover | Sign In",
  });
};
module.exports.createSession = function (req, res) {
  //TODO later
};
