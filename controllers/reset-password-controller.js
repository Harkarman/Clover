const User = require("../models/user");
const Token = require("../models/password-token");
const crypto = require("crypto");
const queue = require("../config/kue");
const resetPasswordMailer = require("../mailers/reset-password-mailer");
const resetPasswordWorker = require("../workers/reset-password-worker");

module.exports.resetPasswordPage = async (req, res) => {
  return res.render("forgot-password-form", { title: "Clover" });
};

module.exports.generateToken = async (req, res) => {
  if (req.user) {
    return res.redirect("back");
  }
  let tokenString = crypto.randomBytes(40).toString("hex");
  let user = await User.findOne({ email: req.body.email });
  let token = await Token.create({
    is_valid: true,
    access_token: tokenString,
    user: user,
  });
  let job = queue.create("sendResetPasswordMail", token).save(function (err) {
    if (err) {
      console.log("Error in adding job to queue", err);
      return;
    }
    console.log("Job enqueued", job.id);
    req.flash("success", "An email has been sent to your email address.");
    return res.redirect("back");
  });
};

module.exports.redirectToChangePassword = async function (req, res) {
  if (req.user) {
    return res.redirect("back");
  }
  let linkToken = req.query.access_token;
  let token = await Token.findOne({ access_token: linkToken });
  if (!token.is_valid) {
    return res.redirect("back");
  }
  return res.render("change-password", {
    title: "Clover | Change password",
    access_token: linkToken,
  });
};

module.exports.changePassword = function (req, res) {
  let linkToken = req.body.access_token;
  let newPassword = req.body.new_password;
  let confirmNewPassword = req.body.confirm_new_password;
  if (newPassword != confirmNewPassword) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }
  if (newPassword == "") {
    req.flash("error", "Please enter a new password");
    return res.redirect("back");
  }
  Token.findOneAndUpdate(
    { access_token: linkToken },
    { $set: { is_valid: false } },
    function (err, token) {
      console.log(token);
      if (err) {
        return;
      }
      if (!token.is_valid) {
        return res.redirect("back");
      }
      User.findByIdAndUpdate(
        token.user,
        { $set: { password: newPassword } },
        function (err, user) {
          if (err) {
            console.log("Cannot find user that matches token.");
            return;
          }
          return res.redirect("/users/sign-in");
        }
      );
    }
  );
};
