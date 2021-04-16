const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home-controller");

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/friends", require("./friends"));

module.exports = router;
