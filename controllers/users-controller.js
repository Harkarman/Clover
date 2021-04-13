const User = require("../models/user");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    return res.render("user-profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

//Update user profile
module.exports.update = function (req, res) {
  if (req.user.id == req.params.id) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
      req.flash("success", "Profile updated successfully!");
      return res.redirect("back");
    });
  } else {
    return res.status(401).send("Unauthorized");
  }
};

//Sign up
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user-sign-up", {
    title: "Clover | Sign Up",
  });
};
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      req.flash("Error in finding user", err);
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          req.flash("Error in creating user", err);
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      req.flash("success", "You have been signed up, login to continue...");
      return res.redirect("back");
    }
  });
};

//Sign In
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user-sign-in", {
    title: "Clover | Sign In",
  });
};
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
};
module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "Logged out successfully");
  return res.redirect("/");
};
