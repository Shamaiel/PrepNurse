const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/candidate', requireAuth, analyticsController.getCandidateAnalytics);
router.get('/admin', requireAdmin, analyticsController.getAdminAnalytics);

module.exports = router;
