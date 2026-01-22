// Populate system with sample data
const BASE_URL = 'http://localhost:5000/api';

async function populateSampleData() {
  console.log('Populating system with sample data...\n');

  try {
    // Create sample customers
    console.log('Creating sample customers...');
    
    const customers = [
      {
        name: 'Rajesh Kumar',
        address: '123 MG Road, Mumbai, Maharashtra 400001',
        connection_no: 'CONN-2024-001',
        tariff_id: 1,
        contact_phone: '+91-9876543210',
        contact_email: 'rajesh.kumar@email.com'
      },
      {
        name: 'Priya Sharma',
        address: '456 Park Street, Kolkata, West Bengal 700016',
        connection_no: 'CONN-2024-002',
        tariff_id: 1,
        contact_phone: '+91-9876543211',
        contact_email: 'priya.sharma@email.com'
      },
      {
        name: 'Amit Patel',
        address: '789 Brigade Road, Bangalore, Karnataka 560001',
        connection_no: 'CONN-2024-003',
        tariff_id: 2,
        contact_phone: '+91-9876543212',
        contact_email: 'amit.patel@email.com'
      },
      {
        name: 'Sneha Reddy',
        address: '321 Anna Salai, Chennai, Tamil Nadu 600002',
        connection_no: 'CONN-2024-004',
        tariff_id: 1,
        contact_phone: '+91-9876543213',
        contact_email: 'sneha.reddy@email.com'
      }
    ];

    const createdCustomers = [];
    for (const customer of customers) {
      const res = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      
      if (res.ok) {
        const data = await res.json();
        createdCustomers.push(data);
        console.log(`✓ Customer created: ${customer.name}`);
      }
    }

    // Get all customers to find their meters
    const customersRes = await fetch(`${BASE_URL}/customers`);
    const allCustomers = await customersRes.json();

    // Create meters for customers who don't have one
    console.log('\nCreating meters for customers...');
    for (const customer of allCustomers.slice(0, 4)) {
      if (!customer.Meters || customer.Meters.length === 0) {
        const meterRes = await fetch(`${BASE_URL}/meters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: customer.customer_id,
            meter_no: `MTR-2024-${String(customer.customer_id).padStart(3, '0')}`,
            install_date: '2024-01-01',
            meter_type: customer.tariff_id === 2 ? 'Three Phase' : 'Single Phase',
            multiplier: 1.0,
            status: 'INSTALLED'
          })
        });
        
        if (meterRes.ok) {
          console.log(`✓ Meter created for ${customer.name}`);
        }
      }
    }

    // Wait a bit for meters to be created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get updated customer list with meters
    const updatedCustomersRes = await fetch(`${BASE_URL}/customers`);
    const updatedCustomers = await updatedCustomersRes.json();

    // Create sample readings
    console.log('\nCreating sample readings...');
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    for (const customer of updatedCustomers.slice(0, 4)) {
      if (customer.Meters && customer.Meters.length > 0) {
        const meter = customer.Meters[0];
        
        // Last month reading
        const lastMonthReading = await fetch(`${BASE_URL}/readings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meter_id: meter.meter_id,
            reading_date: lastMonth.toISOString().split('T')[0],
            reading_value: 10000 + (customer.customer_id * 1000)
          })
        });

        // This month reading
        const thisMonthReading = await fetch(`${BASE_URL}/readings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meter_id: meter.meter_id,
            reading_date: thisMonth.toISOString().split('T')[0],
            reading_value: 10000 + (customer.customer_id * 1000) + 150 + (customer.customer_id * 20)
          })
        });

        if (lastMonthReading.ok && thisMonthReading.ok) {
          console.log(`✓ Readings created for ${customer.name}`);
        }
      }
    }

    console.log('\n========================================');
    console.log('Sample data populated successfully!');
    console.log('========================================');
    console.log('\nYou can now:');
    console.log('1. View customers in the Customers tab');
    console.log('2. View readings in the Readings tab');
    console.log('3. Generate bills in the Bills tab');
    console.log('4. Process payments in the Payments tab');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error populating data:', error.message);
  }
}

populateSampleData();
