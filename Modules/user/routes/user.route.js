const authMiddleware = require("../../authentication/middlewares/auth.middleware.js");
const isVerified = require("../middlewares/user.isVerified.js");
const uploadImage = require("../../../Utils/multer.js");
const router = require("express").Router();
const {
  deleteProfilePicture,
  getUser,
  updateUser,
  setLocation,
  uploadAvatar,
  deleteUser,
  changePassword,
} = require("../controllers/user.controller.js");

router.use(authMiddleware);
router.use(isVerified);

router.get("/get-user", getUser);
router.patch("/update-user", updateUser);
router.patch("/change-password", changePassword);

router.post("/location", setLocation);

router.post("/upload-image", uploadImage, uploadAvatar);
router.delete("/delete-profile-picture", deleteProfilePicture);

router.delete("/delete-user", deleteUser);

module.exports = router;
