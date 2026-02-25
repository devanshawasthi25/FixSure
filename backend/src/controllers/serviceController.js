const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const { JOB_STATUS } = require('../utils/constants');

const addNotification = (service, message) => {
  service.notifications.push({ message, timestamp: new Date() });
};

exports.bookService = async (req, res) => {
  const customer = await User.findById(req.user.id);
  if (!customer?.isActiveSubscription) {
    return res.status(400).json({ message: 'Active subscription required before booking.' });
  }

  const payload = {
    ...req.body,
    customer: req.user.id,
    photoUrl: req.file ? `/uploads/${req.file.filename}` : req.body.photoUrl
  };

  const service = await ServiceRequest.create(payload);
  addNotification(service, 'Service request placed successfully');
  await service.save();

  return res.status(201).json(service);
};

exports.customerDashboard = async (req, res) => {
  const customer = await User.findById(req.user.id).select('-password');
  const jobs = await ServiceRequest.find({ customer: req.user.id }).sort({ createdAt: -1 }).populate('technician', 'name phone');
  const upcoming = jobs.find((job) => job.status !== JOB_STATUS.COMPLETED && job.status !== JOB_STATUS.REJECTED);

  return res.json({
    user: customer,
    activeSubscriptionPlan: customer.isActiveSubscription ? 'FixSure Care Plan' : 'No active plan',
    upcomingService: upcoming || null,
    serviceHistory: jobs
  });
};

exports.rateService = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const service = await ServiceRequest.findOne({ _id: id, customer: req.user.id });
  if (!service) return res.status(404).json({ message: 'Service request not found' });
  service.rating = rating;
  addNotification(service, `Customer rated service ${rating}/5`);
  await service.save();
  return res.json(service);
};

exports.listJobsForTechnician = async (req, res) => {
  const jobs = await ServiceRequest.find({ technician: req.user.id }).populate('customer', 'name phone');
  return res.json(jobs);
};

exports.technicianAction = async (req, res) => {
  const { id } = req.params;
  const { status, materialCost } = req.body;
  const service = await ServiceRequest.findById(id);
  if (!service) return res.status(404).json({ message: 'Service request not found' });
  if (service.technician?.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not assigned to this job' });
  }

  service.status = status || service.status;
  service.materialCost = materialCost ?? service.materialCost;
  if (req.file) service.completionPhotoUrl = `/uploads/${req.file.filename}`;

  if (service.status === JOB_STATUS.COMPLETED) {
    service.warrantyExpiryDate = new Date(Date.now() + service.warrantyDays * 24 * 60 * 60 * 1000);
    addNotification(service, 'Job completed with warranty enabled');
  } else {
    addNotification(service, `Technician updated status to ${service.status}`);
  }

  await service.save();
  return res.json(service);
};

exports.listAllJobs = async (_req, res) => {
  const jobs = await ServiceRequest.find().populate('customer technician', 'name phone role');
  res.json(jobs);
};

exports.assignTechnician = async (req, res) => {
  const { id } = req.params;
  const { technicianId } = req.body;
  const service = await ServiceRequest.findById(id);
  if (!service) return res.status(404).json({ message: 'Service request not found' });

  service.technician = technicianId;
  service.status = JOB_STATUS.ASSIGNED;
  addNotification(service, 'Technician assigned by admin');
  await service.save();
  return res.json(service);
};

exports.manualOverride = async (req, res) => {
  const { id } = req.params;
  const { status, warrantyDays } = req.body;
  const service = await ServiceRequest.findById(id);
  if (!service) return res.status(404).json({ message: 'Service request not found' });

  if (status) service.status = status;
  if (warrantyDays !== undefined) service.warrantyDays = warrantyDays;
  addNotification(service, 'Admin manually overrode job details');

  if (service.status === JOB_STATUS.COMPLETED) {
    service.warrantyExpiryDate = new Date(Date.now() + service.warrantyDays * 24 * 60 * 60 * 1000);
  }

  await service.save();
  return res.json(service);
};
