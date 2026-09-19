const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);
router.get('/candidates', requireAdmin, authController.getCandidates);

module.exports = router;
