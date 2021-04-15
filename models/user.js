const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/users/avatar");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friends" }],
  },
  { timestamps: true }
);

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "..", AVATAR_PATH));
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now());
  },
});

//static functions
userSchema.statics.uploadedAvatar = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
}).single("avatar");
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model("User", userSchema);

module.exports = User;
