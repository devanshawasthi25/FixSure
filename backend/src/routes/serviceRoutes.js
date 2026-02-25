const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  bookService,
  customerDashboard,
  rateService,
  listJobsForTechnician,
  technicianAction,
  listAllJobs,
  assignTechnician,
  manualOverride
} = require('../controllers/serviceController');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/customer/dashboard', auth(['customer']), customerDashboard);
router.post('/customer/book', auth(['customer']), upload.single('photo'), bookService);
router.patch('/customer/rate/:id', auth(['customer']), rateService);

router.get('/technician/jobs', auth(['technician']), listJobsForTechnician);
router.patch('/technician/jobs/:id', auth(['technician']), upload.single('photo'), technicianAction);

router.get('/admin/jobs', auth(['admin']), listAllJobs);
router.patch('/admin/jobs/:id/assign', auth(['admin']), assignTechnician);
router.patch('/admin/jobs/:id/override', auth(['admin']), manualOverride);

module.exports = router;
