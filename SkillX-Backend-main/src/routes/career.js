// routes/career.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { submitQuiz, getMyRecommendation } = require('../controllers/careerController');
const CareerRole = require('../models/CareerRole');

router.post('/submit-quiz', authMiddleware, submitQuiz);
router.get('/mine', authMiddleware, getMyRecommendation);

// List all careers
router.get('/', async (req, res) => {
  try {
    const careers = await CareerRole.find({});
    res.status(200).json(careers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
