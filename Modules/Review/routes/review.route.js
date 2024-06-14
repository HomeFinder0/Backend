const router = require("express").Router();
const {
    addReview,
    getOneReview,
    getResidenceReviews,
    likeReview,
    unLikeReview,
    removeLikeReview,
    removeUnlikeReview
} = require("../../Review/controllers/reviews.controller.js");

const authMiddleware = require("../../authentication/middlewares/auth.middleware.js");
router.use(authMiddleware);

router.post("/:residenceId", addReview);
router.get("/get/:residenceId", getResidenceReviews);

router.get("/get-one/:reviewId", getOneReview);
router.get("/like/:reviewId", likeReview);
router.get("/remove-like/:reviewId", removeLikeReview);
router.get("/remove-unlike/:reviewId", removeUnlikeReview);
router.get("/unlike/:reviewId", unLikeReview);

module.exports = router;