const express = require('express');
const auth = require('../middleware/auth');
const {
  metrics,
  listTechnicians,
  createOrUpdatePlan,
  listPlans,
  listComplaints,
  raiseComplaint,
  activateSubscription
} = require('../controllers/adminController');

const router = express.Router();

router.get('/metrics', auth(['admin']), metrics);
router.get('/technicians', auth(['admin']), listTechnicians);
router.get('/plans', listPlans);
router.post('/plans', auth(['admin']), createOrUpdatePlan);
router.put('/plans/:id', auth(['admin']), createOrUpdatePlan);
router.get('/complaints', auth(['admin']), listComplaints);
router.post('/complaints', auth(['customer']), raiseComplaint);
router.patch('/subscriptions/:userId/activate', auth(['admin']), activateSubscription);

module.exports = router;
