const mongoose = require('mongoose');
const { JOB_STATUS, SERVICE_CATEGORIES } = require('../utils/constants');

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, enum: SERVICE_CATEGORIES, required: true },
    preferredDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    issueDescription: { type: String, required: true },
    photoUrl: { type: String },
    emergency: { type: Boolean, default: false },
    status: { type: String, default: JOB_STATUS.REQUESTED, enum: Object.values(JOB_STATUS) },
    materialCost: { type: Number, default: 0 },
    completionPhotoUrl: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    warrantyDays: { type: Number, default: 7 },
    warrantyExpiryDate: { type: Date },
    notifications: [{ message: String, timestamp: Date }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
