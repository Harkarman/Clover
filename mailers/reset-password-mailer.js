const nodemailer = require("../config/nodemailer");
exports.resetPasswordTokenMail = (token) => {
  let htmlString = nodemailer.renderTemplate(
    { token: token },
    "/forgot-password-email.ejs"
  );
  nodemailer.transporter.sendMail(
    {
      from: "tempnodemailer@gmail.com",
      to: token.user.email,
      subject: "Clover | Reset your password",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending email", err);
        return;
      }
      console.log("Mail delivered");
      return;
    }
  );
};
