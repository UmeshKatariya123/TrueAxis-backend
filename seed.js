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

// Seed data
const seedData = async () => {
  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Content.deleteMany({});
    console.log('Existing data cleared.');

    // Create Admin User
    console.log('Creating admin user...');
    const adminUser = new User({
      username: 'admin',
      email: 'admin@trueaxis.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin'
    });

    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
    } else {
      await adminUser.save();
      console.log('✓ Admin user created:');
      console.log('  Email: admin@trueaxis.com');
      console.log('  Password: admin123');
    }

    // Create Hero Content
    console.log('\nCreating hero content...');
    const heroContent = new Content({
      title: 'Welcome to TrueAxis IT Solution',
      description: 'We develop modern, high-performance websites with complete frontend and backend development. Clean design, secure backend, and scalable solutions for your business.',
      category: 'hero',
      link: '#services',
      order: 1,
      isActive: true
    });
    await heroContent.save();
    console.log('✓ Hero content created');

    // Create Services
    console.log('\nCreating services...');
    const services = [
      {
        title: 'Frontend Development',
        description: 'Modern, responsive frontend development using React.js, HTML, CSS, and Tailwind CSS. We create fast, user-friendly interfaces with clean designs.',
        category: 'service',
        order: 1,
        isActive: true
      },
      {
        title: 'Backend Development',
        description: 'Scalable backend solutions using Node.js, Express.js, and MongoDB. Secure APIs and proper database management for your applications.',
        category: 'service',
        order: 2,
        isActive: true
      },
      {
        title: 'Full Stack Solutions',
        description: 'Complete web application development from frontend to backend. We provide end-to-end solutions with secure admin panels and dynamic content management.',
        category: 'service',
        order: 3,
        isActive: true
      },
      {
        title: 'Admin Panel Development',
        description: 'Secure admin panels with protected routes and role-based access. Manage your website content easily with our intuitive admin interfaces.',
        category: 'service',
        order: 4,
        isActive: true
      }
    ];

    for (const service of services) {
      const serviceContent = new Content(service);
      await serviceContent.save();
      console.log(`✓ Service created: ${service.title}`);
    }

    // Create Features
    console.log('\nCreating features...');
    const features = [
      {
        title: 'Clean & Responsive UI',
        description: 'Beautiful, modern designs that work seamlessly across all devices and screen sizes.',
        category: 'feature',
        order: 1,
        isActive: true
      },
      {
        title: 'Secure Backend',
        description: 'Robust security with JWT authentication, encrypted passwords, and protected routes.',
        category: 'feature',
        order: 2,
        isActive: true
      },
      {
        title: 'Easy Content Management',
        description: 'Manage all your website content through an intuitive admin panel with real-time updates.',
        category: 'feature',
        order: 3,
        isActive: true
      },
      {
        title: 'Scalable Architecture',
        description: 'Built with scalability in mind, ready to grow with your business needs.',
        category: 'feature',
        order: 4,
        isActive: true
      },
      {
        title: 'Fast Performance',
        description: 'Optimized for speed and performance, ensuring quick load times and smooth user experience.',
        category: 'feature',
        order: 5,
        isActive: true
      },
      {
        title: 'Modern Tech Stack',
        description: 'Built with the latest technologies including React.js, Node.js, and MongoDB.',
        category: 'feature',
        order: 6,
        isActive: true
      }
    ];

    for (const feature of features) {
      const featureContent = new Content(feature);
      await featureContent.save();
      console.log(`✓ Feature created: ${feature.title}`);
    }

    // Create Testimonials
    console.log('\nCreating testimonials...');
    const testimonials = [
      {
        title: 'John Smith',
        description: 'TrueAxis IT Solution delivered an exceptional website for our business. The admin panel makes content management so easy, and the design is exactly what we wanted.',
        category: 'testimonial',
        order: 1,
        isActive: true
      },
      {
        title: 'Sarah Johnson',
        description: 'Professional service from start to finish. The team understood our needs and created a scalable solution that will grow with our business.',
        category: 'testimonial',
        order: 2,
        isActive: true
      },
      {
        title: 'Michael Chen',
        description: 'The secure admin panel and clean design exceeded our expectations. Highly recommend TrueAxis IT Solution for any web development project.',
        category: 'testimonial',
        order: 3,
        isActive: true
      }
    ];

    for (const testimonial of testimonials) {
      const testimonialContent = new Content(testimonial);
      await testimonialContent.save();
      console.log(`✓ Testimonial created: ${testimonial.title}`);
    }

    // Create Blog Posts
    console.log('\nCreating blog posts...');
    const blogs = [
      {
        title: 'Why Modern Web Development Matters in 2024',
        description: 'Explore the latest trends in web development and why modern frameworks like React.js and Node.js are essential for building scalable applications. Learn about the benefits of headless architecture and API-first development.',
        category: 'blog',
        order: 1,
        isActive: true
      },
      {
        title: 'Building Secure Admin Panels: Best Practices',
        description: 'Discover the key security practices for building admin panels. From JWT authentication to role-based access control, learn how to protect your application and user data effectively.',
        category: 'blog',
        order: 2,
        isActive: true
      },
      {
        title: 'The Future of Full-Stack Development',
        description: 'A comprehensive guide to full-stack development trends. We discuss the evolution of web technologies, modern development practices, and what to expect in the coming years.',
        category: 'blog',
        order: 3,
        isActive: true
      }
    ];

    for (const blog of blogs) {
      const blogContent = new Content(blog);
      await blogContent.save();
      console.log(`✓ Blog post created: ${blog.title}`);
    }

    // Create Work/Projects
    console.log('\nCreating work projects...');
    const works = [
      {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution built with React.js and Node.js. Features include secure payment processing, inventory management, and admin dashboard.',
        category: 'work',
        order: 1,
        isActive: true
      },
      {
        title: 'SaaS Dashboard Application',
        description: 'Modern SaaS dashboard with real-time analytics, user management, and customizable widgets. Built with React and Express.js backend.',
        category: 'work',
        order: 2,
        isActive: true
      },
      {
        title: 'Corporate Website Redesign',
        description: 'Complete website redesign for a Fortune 500 company. Responsive design, improved UX, and integrated CMS for easy content management.',
        category: 'work',
        order: 3,
        isActive: true
      },
      {
        title: 'Mobile App Backend API',
        description: 'RESTful API development for a mobile application. Scalable architecture with MongoDB, JWT authentication, and comprehensive documentation.',
        category: 'work',
        order: 4,
        isActive: true
      }
    ];

    for (const work of works) {
      const workContent = new Content(work);
      await workContent.save();
      console.log(`✓ Work project created: ${work.title}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@trueaxis.com');
    console.log('   Password: admin123');
    console.log('\n🚀 You can now login to the admin panel at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
};

// Run seed
seedData();

