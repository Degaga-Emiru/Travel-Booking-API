const { User, VendorProfile } = require('../models');

const createVendorUser = async () => {
  try {
    console.log('🏢 Creating vendor user...');

    // Check if vendor already exists
    const existingVendor = await User.findOne({ 
      where: { email: 'vendor@travelbooking.com' } 
    });

    if (existingVendor) {
      console.log('✅ Vendor user already exists');
      const existingProfile = await VendorProfile.findOne({ where: { userId: existingVendor.id } });
      if (existingProfile) {
        console.log('✅ Vendor profile already exists');
        return;
      }
      console.log('🏗️ Profile missing, creating now...');
      await VendorProfile.create({
        userId: existingVendor.id,
        companyName: 'Global Travel Agency',
        businessType: 'Agency',
        status: 'approved',
        businessLicenseNumber: 'LIC-123456',
        taxId: 'TIN-987654',
        address: 'Bole, Addis Ababa, Ethiopia',
        contactPhone: '+251912345678',
        contactEmail: 'vendor@travelbooking.com'
      });
      console.log('✅ Vendor profile created for existing user');
      return;
    }

    // Create vendor user
    const vendorUser = await User.create({
      firstName: 'Travel',
      lastName: 'Agency',
      email: 'vendor@travelbooking.com',
      password: 'vendor123',
      role: 'vendor',
      phone: '+251912345678',
      isEmailVerified: true,
      isActive: true
    });

    // Create vendor profile
    await VendorProfile.create({
      userId: vendorUser.id,
      companyName: 'Global Travel Agency',
      businessType: 'Agency',
      status: 'approved', // Pre-approved for testing
      businessLicenseNumber: 'LIC-123456',
      taxId: 'TIN-987654',
      address: 'Bole, Addis Ababa, Ethiopia',
      contactPhone: '+251912345678',
      contactEmail: 'vendor@travelbooking.com'
    });

    console.log('✅ Vendor user and profile created successfully');
    console.log('📧 Email: vendor@travelbooking.com');
    console.log('🔑 Password: vendor123');

  } catch (error) {
    console.error('❌ Error creating vendor user:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  createVendorUser()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = createVendorUser;
