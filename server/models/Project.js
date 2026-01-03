const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectData: {
    name: String,
    org: String,
    startDate: String,
    endDate: String,
    standard: String,
    location: String,
    notes: String
  },
  bomData: Array,
  salesData: Array,
  specData: Array,
  materialClassData: Array,
  calculatedResults: Array,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
