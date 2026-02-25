const ROLES = {
  CUSTOMER: 'customer',
  TECHNICIAN: 'technician',
  ADMIN: 'admin'
};

const JOB_STATUS = {
  REQUESTED: 'Requested',
  ASSIGNED: 'Assigned',
  ON_THE_WAY: 'On the way',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected'
};

const SERVICE_CATEGORIES = ['electrician', 'plumber', 'ac', 'carpenter'];

module.exports = { ROLES, JOB_STATUS, SERVICE_CATEGORIES };
