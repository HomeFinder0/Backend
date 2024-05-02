const authMiddleware = require("../../authentication/middlewares/auth.middleware.js");
const isVerified = require("../middlewares/user.isVerified.js");
const {uploadSingle} = require("../../../Utils/multer.js");
const router = require("express").Router();
const {
  deleteProfilePicture,
  getUser,
  updateUser,
  setLocation,
  uploadAvatar,
  deleteUser,
  changePassword,
  addReview,
  addFavorite,
  deleteOneFavorite,
  deleteAllFavorites,
  getWishlist
} = require("../controllers/user.controller.js");

router.use(authMiddleware);
router.use(isVerified);

router.get("/get-user/:id?", getUser);
router.patch("/update-user", updateUser);
router.patch("/change-password", changePassword);

router.post("/location", setLocation);

router.post("/upload-image", uploadSingle, uploadAvatar);
router.delete("/delete-profile-picture", deleteProfilePicture);

router.delete("/delete-user", deleteUser);

router.post("/review/:residenceId", addReview);

router.get("/favorites", getWishlist);
router.get("/favorites/add/:residenceId", addFavorite);
router.delete("/favorites/delete/:residenceId", deleteOneFavorite);
router.delete("/favorites/delete", deleteAllFavorites);

module.exports = router;
