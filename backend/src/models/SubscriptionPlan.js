const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['monthly', 'yearly'], required: true },
    price: { type: Number, required: true },
    benefits: [{ type: String, required: true }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
