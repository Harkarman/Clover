const User = require("../models/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    return res.render("user-profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

//Update user profile
module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (error) {
        if (error) {
          console.log("Multer error", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          if (user.avatar) {
            //Edge case when replacing an existing avatar.
            if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
            }
          }
          //Save path of uploaded file to avatar field in user.
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        req.flash("success", "Profile updated successfully!");
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized");
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
