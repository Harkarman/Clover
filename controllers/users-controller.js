const User = require("../models/user");

module.exports.profile = function (req, res) {
  return res.render("profile", {
    title: "User Profile",
  });
};

//Sign up
module.exports.signUp = function (req, res) {
  return res.render("user-sign-up", {
    title: "Clover | Sign Up",
  });
};

//Sign In
module.exports.signIn = function (req, res) {
  return res.render("user-sign-in", {
    title: "Clover | Sign In",
  });
};
