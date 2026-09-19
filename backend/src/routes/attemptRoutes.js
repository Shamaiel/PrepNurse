const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const { requireAuth, requireAdmin, optionalAuth } = require('../middleware/authMiddleware');

router.post('/start', optionalAuth, attemptController.startAttempt);
router.put('/:id/sync', optionalAuth, attemptController.syncAttempt);
router.post('/:id/submit', optionalAuth, attemptController.submitAttempt);
router.get('/my', requireAuth, attemptController.getUserAttempts);
router.get('/all', requireAdmin, attemptController.getAllAttempts);
router.get('/:id', optionalAuth, attemptController.getAttemptById);

module.exports = router;
