const router = require('express').Router();

const {
    totalSold,
    totalPending,
    totalApproved,
    totalRejected,
    getUncompleted,
    deleteUncompletedResidence,
    updateResidenceStatus
} = require('../../residence/controllers/residence.controller.js');

const authMiddleware = require('../../authentication/middlewares/auth.middleware.js');
const isAdmin = require('../middlewares/isAdmin.js');

router.use(authMiddleware); 
router.use(isAdmin);

// residence controller
router.get("/total/sold", totalSold);
router.get("/total/pending", totalPending);
router.get("/total/approved", totalApproved);
router.get("/total/rejected", totalRejected);
router.get("/uncompleted?", getUncompleted);
router.delete("/delete/all-uncompleted", deleteUncompletedResidence);
router.patch("/update/status/:residenceId", updateResidenceStatus);

module.exports = router;