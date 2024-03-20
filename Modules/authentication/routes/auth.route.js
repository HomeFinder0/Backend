const router = require("express").Router();
const {
  signUp,
  verifyEmail,
  resendCode,
  completeSignup,
  logIn,
  resetPassword,
  forgotPassword,
  logout,
  verifyPasswordOtp,
  logoutAll,
} = require("../controllers/auth.controller.js");

const authMiddleware = require("../middlewares/auth.middleware.js");
const isVerified = require("../../user/middlewares/user.isVerified.js");

router.post("/signup", signUp);
router.post("/login", logIn);

router.post("/forgot-pass", forgotPassword);
router.patch("/reset-pass/:email", resetPassword);
router.post("/resend-pass-otp/:email", forgotPassword);
router.post("/verify-pass-otp/:email", verifyPasswordOtp);

router.use(authMiddleware);

router.post("/verification", verifyEmail);
router.get("/resend-code", resendCode);

router.get("/logout", logout);
router.get("/logout-all", logoutAll);

router.post("/complete-signup", isVerified, completeSignup);

module.exports = router;
