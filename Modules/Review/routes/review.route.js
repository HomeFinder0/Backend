const router = require("express").Router();
const {
    addReview,
    getResidenceReviews,
    like,
    unLike
} = require("../../Review/controllers/reviews.controller.js");

const authMiddleware = require("../../authentication/middlewares/auth.middleware.js");
router.use(authMiddleware);

router.post("/:residenceId", addReview);
router.get("/get/:residenceId", getResidenceReviews);
router.get("/like/:reviewId", like);
router.get("/unlike/:reviewId", unLike);

module.exports = router;