const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { requireAdmin } = require('../middleware/authMiddleware');

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);

// Admin Question Management
router.post('/', requireAdmin, questionController.createQuestion);
router.put('/:id', requireAdmin, questionController.updateQuestion);
router.delete('/:id', requireAdmin, questionController.deleteQuestion);

// Bulk Import Endpoints
router.post('/validate', requireAdmin, questionController.validateBatch);
router.post('/import', requireAdmin, questionController.importBatch);

module.exports = router;
