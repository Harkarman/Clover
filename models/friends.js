const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    accept_request: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Friends = mongoose.model("Friends", friendsSchema);
module.exports = Friends;
