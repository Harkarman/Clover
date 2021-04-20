const express = require("express");
const router = express.Router();
const resetPasswordController = require("../controllers/reset-password-controller");

router.get("/enter-email", resetPasswordController.resetPasswordPage);
router.post("/generate-token", resetPasswordController.generateToken);
router.get("/reset", resetPasswordController.redirectToChangePassword);
router.post("/change-password", resetPasswordController.changePassword);

module.exports = router;
