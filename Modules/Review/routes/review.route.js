const router = require("express").Router();
const {
    addReview,
    getResidenceReviews,
    likeReview,
    unLikeReview
} = require("../../Review/controllers/reviews.controller.js");

const authMiddleware = require("../../authentication/middlewares/auth.middleware.js");
router.use(authMiddleware);

router.post("/:residenceId", addReview);
router.get("/get/:residenceId", getResidenceReviews);
router.get("/like/:reviewId", likeReview);
router.get("/unlike/:reviewId", unLikeReview);

module.exports = router;