const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');

dotenv.config({ path: require('path').join(__dirname, '../../.env') });

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), SubscriptionPlan.deleteMany({})]);

  const password = await bcrypt.hash('123456', 10);

  await User.insertMany([
    { name: 'Ravi Kumar', phone: '9999911111', password, role: 'customer', isActiveSubscription: true },
    { name: 'Ajay Electrician', phone: '9999922222', password, role: 'technician' },
    { name: 'FixSure Admin', phone: '9999933333', password, role: 'admin' }
  ]);

  await SubscriptionPlan.insertMany([
    {
      name: 'FixSure Basic Monthly',
      type: 'monthly',
      price: 499,
      benefits: ['2 service visits', 'Priority support', '7-day service warranty']
    },
    {
      name: 'FixSure Family Yearly',
      type: 'yearly',
      price: 4999,
      benefits: ['24 service visits', 'Emergency bookings', 'Extended warranty support']
    }
  ]);

  console.log('Seed complete');
  process.exit(0);
};

seed();
