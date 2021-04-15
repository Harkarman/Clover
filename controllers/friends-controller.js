const User = require("../models/user");
const Friends = require("../models/friends");

//TODO: Convert to async await
module.exports.toggleFriend = (req, res) => {
  let from_id = req.user._id;
  let to_id = req.params._id;
  Friends.findOne(
    {
      $or: [
        { from_user: from_id, to_user: to_id },
        { from_user: to_id, to_user: from_id },
      ],
    },
    function (err, already_friend) {
      if (err) {
        console.log("Error establishing friendship between users");
      }
      if (already_friend) {
        //* Updating the users database
        User.findByIdAndUpdate(
          from_id,
          { $pull: { friends: already_friend._id } },
          function (err, data) {
            if (err) {
              console.log("Error in removing user as friend", err);
              return;
            }
          }
        );
        User.findByIdAndUpdate(
          to_id,
          { $pull: { friends: already_friend._id } },
          function (err, data) {
            if (err) {
              console.log("Error in removing user as friend", err);
              return;
            }
          }
        );
        //* Updating friends database
        Friends.deleteOne(
          {
            $or: [
              { from_user: from_id, to_user: to_id },
              { from_user: to_id, to_user: from_id },
            ],
          },
          function (err) {
            if (err) {
              console.log("Unable to remove friend", err);
              return;
            }
            console.log("Friend removed!");
          }
        );
      } else {
        //* Updating friends database
        Friends.create(
          { from_user: from_id, to_user: to_id },
          function (err, new_friend) {
            if (err) {
              console.log("Error adding friend", err);
            }
            new_friend.save();
            //* Updating users database
            User.findByIdAndUpdate(
              from_id,
              { $push: { friends: new_friend._id } },
              function (err, data) {
                if (err) {
                  console.log("Error adding friend to user database", err);
                  return;
                }
                //? console.log(data);
              }
            );
            User.findByIdAndUpdate(
              to_id,
              { $push: { friends: new_friend._id } },
              function (err, data) {
                if (err) {
                  console.log("Error adding friend to user database", err);
                  return;
                }
                //? console.log(data);
              }
            );
            console.log("Friend added!");
          }
        );
      }
      return res.redirect("back");
    }
  );
};
