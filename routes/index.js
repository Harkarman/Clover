const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home-controller");

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/friends", require("./friends"));

router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));

module.exports = router;
