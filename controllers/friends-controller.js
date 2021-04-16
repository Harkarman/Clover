const User = require("../models/user");
const Friends = require("../models/friends");

module.exports.toggleFriend = async function (req, res) {
  try {
    let isFriend = await Friends.findOne(
      {
        $or: [{ $and: [{ sender: req.user._id, receiver: req.params.id }] }],
      },
      {
        $or: [{ $and: [{ receiver: req.user._id, sender: req.params.id }] }],
      }
    );
    let senderId = await User.findById(req.user._id);
    let receiverId = await User.findById(req.params.id);
    if (isFriend) {
      await senderId.updateOne({ $pull: { friends: isFriend._id } });
      await receiverId.updateOne({ $pull: { friends: isFriend._id } });
      senderId.save();
      receiverId.save();
      isFriend.remove();
      req.flash("success", "Friend removed.");
      return res.redirect("back");
    } else {
      let newFriend = await Friends.create({
        sender: req.user.id,
        receiver: req.params.id,
      });
      receiverId.friends.push(newFriend);
      senderId.friends.push(newFriend);
      senderId.save();
      receiverId.save();
      req.flash("success", "Friend request sent!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Some error occurred.");
    console.log(err);
    return res.redirect("/");
  }
};

module.exports.friendsPage = async function (req, res) {
  try {
    let friends = await Friends.find({
      $or: [{ receiver: req.user.id }, { sender: req.user.id }],
      accept_request: true,
    })
      .populate({ path: "receiver", model: "User" })
      .populate({ path: "sender", model: "User" });
    return res.render("friends", {
      title: "All Friends",
      friends: friends,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
};

module.exports.friendRequests = async function (req, res) {
  let friends = await Friends.find({
    $and: [{ receiver: req.user._id }, { accept_request: false }],
  }).populate({ path: "sender", model: "User" });
  return res.render("friend-requests.ejs", {
    title: "Friend Requests",
    friendRequests: friends,
  });
};

module.exports.acceptRequest = async function (req, res) {
  let friend = await Friends.findById(req.params.id);
  await friend.update({ accept_request: true });
  return res.redirect("back");
};

module.exports.allUsers = function (req, res) {
  User.find({}, function (err, users) {
    if (err) {
      return res.redirect("/");
    }
    return res.render("all-users", { title: "All Users", users: users });
  });
};
