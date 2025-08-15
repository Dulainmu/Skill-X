const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String },
  dateAwarded: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Achievement', AchievementSchema); 