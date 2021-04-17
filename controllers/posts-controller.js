const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    //! Populate only usernames and not passwords.
    post = await post.populate("user", "name").execPopulate();
    if (req.xhr) {
      return res
        .status(200)
        .json({ data: { post: post }, message: "Post created" });
    }
    req.flash("success", "Post created!");
    return res.redirect("back");
  } catch (err) {
    req.flash("Error", err);
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    //* .id converts user id into string
    if (post.user == req.user.id) {
      //* Delete likes on posts and comments.
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      await Like.deleteMany({ _id: { $in: post.comments } });
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      if (req.xhr) {
        return res.status(200).json({
          data: { post_id: req.params.id },
          message: "Post and comments deleted.",
        });
      }
      req.flash("success", "Post and comments deleted.");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this post.");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("Error", err);
    return res.redirect("back");
  }
};
