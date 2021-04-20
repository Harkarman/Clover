const mongoose = require("mongoose");
const passwordTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    access_token: { type: String },
    is_valid: { type: Boolean },
  },
  { timestamps: true }
);

const tokenData = mongoose.model("Token", passwordTokenSchema);
module.exports = tokenData;
