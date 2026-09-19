const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { requireAdmin, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, testController.getAllTests);
router.get('/:id', optionalAuth, testController.getTestById);
router.get('/:id/session', optionalAuth, testController.getTestSession);

// Admin Test Management
router.post('/', requireAdmin, testController.createTest);
router.put('/:id', requireAdmin, testController.updateTest);
router.delete('/:id', requireAdmin, testController.deleteTest);
router.post('/:id/duplicate', requireAdmin, testController.duplicateTest);

module.exports = router;
