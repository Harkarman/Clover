const queue = require("../config/kue");
const resetPasswordMailer = require("../mailers/reset-password-mailer");

queue.process("sendResetPasswordMail", function (job, done) {
  resetPasswordMailer.resetPasswordTokenMail(job.data);
  done();
});
