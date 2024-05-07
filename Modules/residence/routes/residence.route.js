const router = require("express").Router();
const {
    createResidence,
    residenceImages,
    completeResidence,
    stepTwoComplete,
    stepThreeComplete,
    setLocation,
    updateResidence,
    getOneResidence,
    getAllResidences,
    deleteOneResidence,
    filtration,
    getNearestResidences
} = require("../controllers/residence.controller.js");
const authMiddleware = require("../../authentication/middlewares/auth.middleware.js");
const {uploadMultiple} = require("../../../Utils/multer.js");

router.use(authMiddleware);

router.post("/create", createResidence);
router.post("/complete/1st/:residenceId" , completeResidence);
router.post("/complete/2nd/:residenceId" , stepTwoComplete);
router.post("/complete/3rd/:residenceId" , stepThreeComplete);

router.post("/location/:residenceId" , setLocation);
router.post("/upload/:residenceId", uploadMultiple , residenceImages);

router.get("/get/:residenceId", getOneResidence);
router.get("/all?", getAllResidences);
router.get("/nearest", getNearestResidences);

router.patch("/update/:residenceId", updateResidence);
router.delete("/delete/:residenceId", deleteOneResidence);

router.get("/filter", filtration);

module.exports = router;