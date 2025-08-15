const AssessmentProgress = require('../models/AssessmentProgress');

// Get current user's assessment progress
exports.getMyProgress = async (req, res) => {
  try {
    const doc = await AssessmentProgress.findOne({ user: req.user.id });
    if (!doc) return res.status(200).json({ currentStep: 1, data: {}, answers: {} });
    res.status(200).json({ currentStep: doc.currentStep, data: doc.data || {}, answers: doc.answers || {} });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Upsert current user's assessment progress
exports.saveMyProgress = async (req, res) => {
  try {
    const { currentStep, data, answers } = req.body || {};
    if (!currentStep || typeof currentStep !== 'number') {
      return res.status(400).json({ message: 'currentStep must be a number' });
    }

    const update = {
      currentStep,
      data: data || {},
      answers: answers || {},
      updatedAt: new Date()
    };

    const doc = await AssessmentProgress.findOneAndUpdate(
      { user: req.user.id },
      { user: req.user.id, ...update },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Progress saved', currentStep: doc.currentStep });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Clear current user's assessment progress
exports.clearMyProgress = async (req, res) => {
  try {
    await AssessmentProgress.deleteOne({ user: req.user.id });
    res.status(200).json({ message: 'Progress cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


