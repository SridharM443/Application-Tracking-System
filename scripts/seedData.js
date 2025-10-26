const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const JobPosting = require('../models/JobPosting');
const connectDB = require('../config/db');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await JobPosting.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create users
    const applicant = await User.create({
      name: 'John Applicant',
      email: 'applicant@test.com',
      password: 'password123',
      role: 'applicant'
    });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    const botUser = await User.create({
      name: 'Bot Mimic',
      email: 'bot@test.com',
      password: 'password123',
      role: 'botMimic'
    });

    console.log('✅ Users created');

    // Create job postings
    await JobPosting.create([
      {
        title: 'Senior Software Engineer',
        description: 'Looking for experienced software engineer',
        roleType: 'technical',
        department: 'Engineering',
        location: 'Remote',
        requirements: ['5+ years experience', 'Node.js', 'React'],
        salaryRange: { min: 100000, max: 150000 },
        createdBy: admin._id
      },
      {
        title: 'Marketing Manager',
        description: 'Lead our marketing team',
        roleType: 'non-technical',
        department: 'Marketing',
        location: 'New York',
        requirements: ['3+ years in marketing', 'Leadership skills'],
        salaryRange: { min: 80000, max: 120000 },
        createdBy: admin._id
      }
    ]);

    console.log('✅ Job postings created');
    console.log('\n📧 Test Credentials:');
    console.log('Applicant: applicant@test.com / password123');
    console.log('Admin: admin@test.com / password123');
    console.log('Bot: bot@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
