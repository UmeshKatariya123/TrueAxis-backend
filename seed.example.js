// Example seed file - Customize this for your needs
// Copy this file to seed.js and modify the data as needed

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Content = require('./models/Content');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://umeshkatariya648:W7dFiGItomnXpj9K@onecrud.trkpzf9.mongodb.net/trueaxis', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for seeding...'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Customize your seed data here
const seedData = async () => {
  try {
    // Create Admin User
    const adminUser = new User({
      username: 'your_admin_username',
      email: 'your_admin@email.com',
      password: 'your_secure_password',
      role: 'admin'
    });

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
    } else {
      await adminUser.save();
      console.log('✓ Admin user created');
    }

    // Add your custom content here
    // Example:
    // const heroContent = new Content({
    //   title: 'Your Hero Title',
    //   description: 'Your hero description',
    //   category: 'hero',
    //   order: 1,
    //   isActive: true
    // });
    // await heroContent.save();

    console.log('✅ Database seeding completed!');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

seedData();

