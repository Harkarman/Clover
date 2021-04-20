const nodemailer = require("../config/nodemailer");
exports.resetPasswordTokenMail = (token) => {
  nodemailer.transporter.sendMail(
    {
      from: "tempnodemailer@gmail.com",
      to: token.user.email,
      subject: "Clover | Reset your password",
      html: `<h3>Here is your password reset link. Do not share this with anyone</h3>
            <p>http://localhost:8000/reset-password/reset/?access_token=${token.access_token}</p>`,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending email", err);
        return;
      }
      console.log("Mail delivered", info);
      return;
    }
  );
};
