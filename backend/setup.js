const bcrypt = require('bcrypt');
const { User, Tariff, sequelize } = require('./src/models');

async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Sync models (create tables)
    console.log('Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('✓ Database synced');

    // Create default admin user
    console.log('Creating default users...');
    const adminHash = await bcrypt.hash('admin123', 10);
    
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password_hash: adminHash,
        full_name: 'System Administrator',
        role: 'ADMIN',
        email: 'admin@ebsystem.com'
      }
    });

    const billingHash = await bcrypt.hash('billing123', 10);
    await User.findOrCreate({
      where: { username: 'billing' },
      defaults: {
        username: 'billing',
        password_hash: billingHash,
        full_name: 'Billing Department',
        role: 'BILLING',
        email: 'billing@ebsystem.com'
      }
    });

    console.log('✓ Default users created');

    // Create default tariffs
    console.log('Creating default tariffs...');
    
    await Tariff.findOrCreate({
      where: { tariff_id: 1 },
      defaults: {
        tariff_id: 1,
        name: 'Domestic',
        description: 'Residential consumers - Slab based pricing',
        tariff_json: {
          slabs: [
            { upto: 100, rate: 2.5 },
            { upto: 300, rate: 4.0 },
            { upto: 500, rate: 5.5 },
            { upto: null, rate: 7.0 }
          ],
          tax_percent: 5
        },
        fixed_charge: 50.00
      }
    });

    await Tariff.findOrCreate({
      where: { tariff_id: 2 },
      defaults: {
        tariff_id: 2,
        name: 'Commercial',
        description: 'Commercial establishments',
        tariff_json: {
          slabs: [
            { upto: 200, rate: 5.0 },
            { upto: 500, rate: 7.0 },
            { upto: null, rate: 9.0 }
          ],
          tax_percent: 10
        },
        fixed_charge: 150.00
      }
    });

    await Tariff.findOrCreate({
      where: { tariff_id: 3 },
      defaults: {
        tariff_id: 3,
        name: 'Industrial',
        description: 'Industrial consumers',
        tariff_json: {
          slabs: [
            { upto: 1000, rate: 6.0 },
            { upto: null, rate: 8.0 }
          ],
          tax_percent: 12
        },
        fixed_charge: 500.00
      }
    });

    console.log('✓ Default tariffs created');

    console.log('\n========================================');
    console.log('Database setup completed successfully!');
    console.log('========================================');
    console.log('\nDefault Login Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nUsername: billing');
    console.log('Password: billing123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
