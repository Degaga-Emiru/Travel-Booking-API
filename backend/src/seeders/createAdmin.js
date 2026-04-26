const { User } = require('../models');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    console.log('👨‍💼 Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@travelbooking.com' } 
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@travelbooking.com',
      password: 'admin123',
      role: 'admin',
      phone: '+10000000000',
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@travelbooking.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = createAdminUser;