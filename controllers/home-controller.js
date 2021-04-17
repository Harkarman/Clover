const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    //* Populate likes for each post.
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "user" },
        // populate: { path: "likes" }, //! Comments was not getting populated, this fixes it but might break something else.
      })
      .populate("likes");
    let users = await User.find({});
    return res.render("home", {
      title: "Clover | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("error", err);
    return;
  }
};
