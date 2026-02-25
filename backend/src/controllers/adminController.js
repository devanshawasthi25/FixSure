const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Complaint = require('../models/Complaint');
const { ROLES, JOB_STATUS } = require('../utils/constants');

exports.metrics = async (_req, res) => {
  const [totalUsers, activeSubscriptions, pendingJobs] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActiveSubscription: true }),
    ServiceRequest.countDocuments({ status: { $ne: JOB_STATUS.COMPLETED } })
  ]);

  res.json({ totalUsers, activeSubscriptions, pendingJobs });
};

exports.listTechnicians = async (_req, res) => {
  const technicians = await User.find({ role: ROLES.TECHNICIAN }).select('-password');
  res.json(technicians);
};

exports.createOrUpdatePlan = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const plan = id
    ? await SubscriptionPlan.findByIdAndUpdate(id, payload, { new: true })
    : await SubscriptionPlan.create(payload);

  res.json(plan);
};

exports.listPlans = async (_req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true });
  res.json(plans);
};

exports.listComplaints = async (_req, res) => {
  const complaints = await Complaint.find().populate('customer serviceRequest');
  res.json(complaints);
};

exports.raiseComplaint = async (req, res) => {
  const complaint = await Complaint.create({ ...req.body, customer: req.user.id });
  res.status(201).json(complaint);
};

exports.activateSubscription = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndUpdate(userId, { isActiveSubscription: true }, { new: true });
  res.json(user);
};
