const { sequelize } = require('./src/models');

async function fix() {
  try {
    await sequelize.authenticate();
    console.log('Connected');
    
    // Drop the default constraint first if any
    await sequelize.query('ALTER TABLE "VendorProfiles" ALTER COLUMN status DROP DEFAULT;');
    
    // Change type to varchar using text casting
    await sequelize.query('ALTER TABLE "VendorProfiles" ALTER COLUMN status TYPE VARCHAR(255) USING status::text;');
    
    // Set the new default
    await sequelize.query(`ALTER TABLE "VendorProfiles" ALTER COLUMN status SET DEFAULT 'pending_verification';`);
    
    console.log('DB Fixed');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

fix();
