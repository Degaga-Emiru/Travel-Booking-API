const { sequelize } = require('./src/models');

const syncDB = async () => {
  try {
    console.log('🔄 Syncing database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
};

syncDB();
