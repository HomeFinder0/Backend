const router = require("express").Router();
const {
    createResidence,
    residenceImages,
    completeResidence,
    finalStep,
    setLocation,
    updateResidence,
    getOneResidence,
    getAllResidences,
    deleteOneResidence
} = require("../controllers/residence.controller.js");
const authMiddleware = require("../../authentication/middlewares/auth.middleware.js");
const {uploadMultiple} = require("../../../Utils/multer.js");

router.use(authMiddleware);

router.post("/create", createResidence);
router.post("/upload/:residenceId", uploadMultiple , residenceImages);
router.post("/complete/:residenceId" , completeResidence);
router.post("/final/complete/:residenceId" , finalStep);
router.post("/location/:residenceId" , setLocation);

router.get("/get/:residenceId", getOneResidence);
router.get("/all?", getAllResidences);

router.patch("/update/:residenceId", updateResidence);
router.delete("/delete/:residenceId", deleteOneResidence);

module.exports = router;