const mongoose = require('mongoose');
const Project = require('./models/Project');
const User = require('./models/User');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/footprint_db';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    console.log('\n--- Users ---');
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    users.forEach(u => console.log(`- ${u.email} (ID: ${u._id})`));

    console.log('\n--- Projects ---');
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects`);
    projects.forEach(p => console.log(`- Project by User ${p.userId}: ${JSON.stringify(p.projectData)}`));

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
  });
