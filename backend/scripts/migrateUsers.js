import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users without locationUpdated field
    const users = await User.find({
      $or: [
        { locationUpdated: { $exists: false } },
        { locationUpdated: null }
      ]
    });

    console.log(`Found ${users.length} users to migrate`);

    // Update each user
    for (const user of users) {
      // Set locationUpdated based on whether they have state and city
      user.locationUpdated = (user.state && user.city) ? true : false;
      
      // Ensure empty fields have default values
      if (!user.state) user.state = '';
      if (!user.city) user.city = '';
      if (!user.mobile) user.mobile = '';
      if (!user.address) user.address = '';
      
      await user.save({ validateBeforeSave: false });
      console.log(`Migrated user: ${user.email}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers();
