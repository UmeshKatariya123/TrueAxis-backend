const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Logo = require('./models/Logo');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://umeshkatariya648:W7dFiGItomnXpj9K@onecrud.trkpzf9.mongodb.net/trueaxis?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for logo seeding...'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Helper function to convert image to base64
const imageToBase64 = (imagePath) => {
  try {
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64String = imageBuffer.toString('base64');
      const ext = path.extname(imagePath).slice(1).toLowerCase();
      return { base64: base64String, format: ext };
    }
    return null;
  } catch (error) {
    console.error(`Error reading image ${imagePath}:`, error.message);
    return null;
  }
};

// Seed logo data
const seedLogos = async () => {
  try {
    console.log('Clearing existing logos...');
    await Logo.deleteMany({});
    console.log('Existing logos cleared.');

    // Check if logo images exist in assets folder
    const assetsPath = path.join(__dirname, '../frontend/src/assets/images');
    const logoLightPath = path.join(assetsPath, 'logo-light.png');
    const logoDarkPath = path.join(assetsPath, 'logo-dark.png');

    let logoLightData = null;
    let logoDarkData = null;

    // Try to read logo images if they exist
    if (fs.existsSync(logoLightPath)) {
      const lightImage = imageToBase64(logoLightPath);
      if (lightImage) {
        logoLightData = lightImage;
        console.log('✓ Found logo-light.png');
      }
    }

    if (fs.existsSync(logoDarkPath)) {
      const darkImage = imageToBase64(logoDarkPath);
      if (darkImage) {
        logoDarkData = darkImage;
        console.log('✓ Found logo-dark.png');
      }
    }

    // Create logo-light (for light backgrounds - navbar)
    console.log('\nCreating logo-light...');
    const logoLight = new Logo({
      name: 'logo-light',
      title: 'TrueAxis Logo (Light)',
      description: 'Logo for use on light backgrounds',
      imageData: logoLightData ? logoLightData.base64 : '', // Empty if image not found
      imageType: logoLightData ? 'base64' : 'url',
      imageFormat: logoLightData ? logoLightData.format : 'png',
      variant: 'light',
      isActive: true
    });
    await logoLight.save();
    console.log('✓ Logo-light created');

    // Create logo-dark (for dark backgrounds - footer)
    console.log('\nCreating logo-dark...');
    const logoDark = new Logo({
      name: 'logo-dark',
      title: 'TrueAxis Logo (Dark)',
      description: 'Logo for use on dark backgrounds',
      imageData: logoDarkData ? logoDarkData.base64 : '', // Empty if image not found
      imageType: logoDarkData ? 'base64' : 'url',
      imageFormat: logoDarkData ? logoDarkData.format : 'png',
      variant: 'dark',
      isActive: true
    });
    await logoDark.save();
    console.log('✓ Logo-dark created');

    console.log('\n✅ Logo seeding completed!');
    console.log('\n📝 Note:');
    if (!logoLightData || !logoDarkData) {
      console.log('   Logo images not found in frontend/src/assets/images/');
      console.log('   Please add your logo images:');
      console.log('   - logo-light.png (for light backgrounds)');
      console.log('   - logo-dark.png (for dark backgrounds)');
      console.log('   Then run this script again to update the database.');
    } else {
      console.log('   Both logo images have been stored in the database.');
    }
    console.log('\n💡 You can also upload logos through the admin panel API:');
    console.log('   POST /api/logo (requires admin authentication)');

  } catch (error) {
    console.error('Error seeding logos:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
};

// Run seed
seedLogos();

