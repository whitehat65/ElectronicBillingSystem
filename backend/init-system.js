// Initialize the system with default data via API calls
const BASE_URL = 'http://localhost:5000/api';

async function initializeSystem() {
  console.log('Initializing Electricity Billing System...\n');

  try {
    // 1. Register admin user
    console.log('Creating admin user...');
    const adminRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123',
        full_name: 'System Administrator',
        role: 'ADMIN',
        email: 'admin@ebsystem.com'
      })
    });
    
    if (adminRes.ok) {
      console.log('✓ Admin user created');
    } else {
      console.log('⚠ Admin user might already exist');
    }

    // 2. Register billing user
    console.log('Creating billing user...');
    const billingRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'billing',
        password: 'billing123',
        full_name: 'Billing Department',
        role: 'BILLING',
        email: 'billing@ebsystem.com'
      })
    });
    
    if (billingRes.ok) {
      console.log('✓ Billing user created');
    } else {
      console.log('⚠ Billing user might already exist');
    }

    // 3. Create tariffs
    console.log('\nCreating default tariffs...');
    
    const tariffs = [
      {
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
      },
      {
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
      },
      {
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
    ];

    for (const tariff of tariffs) {
      const res = await fetch(`${BASE_URL}/tariffs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tariff)
      });
      
      if (res.ok) {
        console.log(`✓ ${tariff.name} tariff created`);
      } else {
        console.log(`⚠ ${tariff.name} tariff might already exist`);
      }
    }

    console.log('\n========================================');
    console.log('System initialized successfully!');
    console.log('========================================');
    console.log('\nDefault Login Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nUsername: billing');
    console.log('Password: billing123');
    console.log('\nOpen your browser to: http://localhost:3000');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error initializing system:', error.message);
    console.log('\nMake sure the backend server is running on port 5000');
  }
}

initializeSystem();
