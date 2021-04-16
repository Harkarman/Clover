const express = require("express");
const router = express.Router();
const passport = require("passport");

const friendsController = require("../controllers/friends-controller");

router.get(
  "/toggle-friend/:id",
  passport.checkAuthentication,
  friendsController.toggleFriend
);
router.get(
  "/accept-friend-request/:id",
  passport.checkAuthentication,
  friendsController.acceptRequest
);
router.get("/all-users", friendsController.allUsers);

module.exports = router;
