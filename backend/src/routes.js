const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Customer, Meter, Reading, Bill, Payment, Tariff, User, AuditLog, sequelize } = require('./models');
const { Op } = require('sequelize');

// Health
router.get('/ping', (req, res) => res.json({ ok: true }));

// ===========================
// AUTHENTICATION
// ===========================
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      user_id: user.user_id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, full_name, role, email } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username,
      password_hash,
      full_name,
      role: role || 'VIEWER',
      email
    });
    
    res.status(201).json({
      user_id: user.user_id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ===========================
// CUSTOMERS
// ===========================
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [{ model: Tariff }, { model: Meter }],
      order: [['created_at', 'DESC']]
    });
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{ model: Tariff }, { model: Meter }, { model: Bill }]
    });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/customers', async (req, res) => {
  try {
    const { name, address, connection_no, tariff_id, contact_phone, contact_email } = req.body;
    
    // Generate unique customer code
    const customer_code = `CUST${Date.now().toString().slice(-8)}`;
    
    const customer = await Customer.create({
      customer_code,
      name,
      address,
      connection_no,
      tariff_id,
      contact_phone,
      contact_email,
      status: 'ACTIVE'
    });
    
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

router.put('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    await customer.update(req.body);
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    await customer.destroy();
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// ===========================
// METERS
// ===========================
router.get('/meters', async (req, res) => {
  try {
    const meters = await Meter.findAll({
      include: [{ model: Customer }]
    });
    res.json(meters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/meters', async (req, res) => {
  try {
    const meter = await Meter.create(req.body);
    res.status(201).json(meter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create meter' });
  }
});

router.put('/meters/:id', async (req, res) => {
  try {
    const meter = await Meter.findByPk(req.params.id);
    if (!meter) {
      return res.status(404).json({ error: 'Meter not found' });
    }
    
    await meter.update(req.body);
    res.json(meter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update meter' });
  }
});

// ===========================
// TARIFFS
// ===========================
router.get('/tariffs', async (req, res) => {
  try {
    const tariffs = await Tariff.findAll();
    res.json(tariffs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/tariffs', async (req, res) => {
  try {
    const tariff = await Tariff.create(req.body);
    res.status(201).json(tariff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tariff' });
  }
});

router.put('/tariffs/:id', async (req, res) => {
  try {
    const tariff = await Tariff.findByPk(req.params.id);
    if (!tariff) {
      return res.status(404).json({ error: 'Tariff not found' });
    }
    
    await tariff.update(req.body);
    res.json(tariff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update tariff' });
  }
});

// ===========================
// READINGS
// ===========================
router.get('/readings', async (req, res) => {
  try {
    const { meter_id } = req.query;
    const where = meter_id ? { meter_id } : {};
    
    const readings = await Reading.findAll({
      where,
      include: [{ model: Meter, include: [Customer] }],
      order: [['reading_date', 'DESC']],
      limit: 100
    });
    res.json(readings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/readings', async (req, res) => {
  try {
    const reading = await Reading.create(req.body);
    res.status(201).json(reading);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reading' });
  }
});

// ===========================
// BILLS - CORE BILLING LOGIC
// ===========================
router.get('/bills', async (req, res) => {
  try {
    const { customer_id, status } = req.query;
    const where = {};
    if (customer_id) where.customer_id = customer_id;
    if (status) where.status = status;
    
    const bills = await Bill.findAll({
      where,
      include: [{ model: Customer }, { model: Payment }],
      order: [['period_end', 'DESC']]
    });
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.get('/bills/:id', async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id, {
      include: [
        { model: Customer, include: [Tariff] },
        { model: Payment }
      ]
    });
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Calculate slab-based energy charges
function calculateEnergyCharge(units, tariffJson) {
  const slabs = tariffJson.slabs || [];
  let totalCharge = 0;
  let remainingUnits = units;
  let previousLimit = 0;
  
  for (const slab of slabs) {
    if (remainingUnits <= 0) break;
    
    const slabLimit = slab.upto || Infinity;
    const slabUnits = Math.min(remainingUnits, slabLimit - previousLimit);
    totalCharge += slabUnits * slab.rate;
    remainingUnits -= slabUnits;
    
    if (!slab.upto) break; // Last slab
    previousLimit = slab.upto;
  }
  
  return totalCharge;
}

// Generate bill for a customer
router.post('/bills/generate', async (req, res) => {
  try {
    const { customer_id, period_start, period_end } = req.body;
    
    const customer = await Customer.findByPk(customer_id, {
      include: [{ model: Tariff }, { model: Meter }]
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    if (!customer.Meters || customer.Meters.length === 0) {
      return res.status(400).json({ error: 'No meter found for customer' });
    }
    
    const meter = customer.Meters[0]; // Use first meter
    
    // Get readings for the period
    const readings = await Reading.findAll({
      where: {
        meter_id: meter.meter_id,
        reading_date: {
          [Op.between]: [period_start, period_end]
        }
      },
      order: [['reading_date', 'ASC']]
    });
    
    if (readings.length < 2) {
      return res.status(400).json({ error: 'Insufficient readings for billing period' });
    }
    
    const startReading = readings[0].reading_value;
    const endReading = readings[readings.length - 1].reading_value;
    const units_consumed = (endReading - startReading) * meter.multiplier;
    
    // Calculate charges
    const tariff = customer.Tariff;
    const tariffJson = tariff.tariff_json;
    const energy_charge = calculateEnergyCharge(units_consumed, tariffJson);
    const fixed_charge = tariff.fixed_charge;
    const tax_percent = tariffJson.tax_percent || 0;
    const tax_amount = ((energy_charge + fixed_charge) * tax_percent) / 100;
    const total_amount = energy_charge + fixed_charge + tax_amount;
    
    // Set due date (15 days from period end)
    const due_date = new Date(period_end);
    due_date.setDate(due_date.getDate() + 15);
    
    const bill = await Bill.create({
      customer_id,
      period_start,
      period_end,
      units_consumed,
      energy_charge,
      fixed_charge,
      tax_amount,
      other_charges: 0,
      total_amount,
      due_date: due_date.toISOString().split('T')[0],
      status: 'GENERATED'
    });
    
    res.status(201).json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate bill', details: err.message });
  }
});

// ===========================
// PAYMENTS
// ===========================
router.get('/payments', async (req, res) => {
  try {
    const { customer_id } = req.query;
    const where = customer_id ? { customer_id } : {};
    
    const payments = await Payment.findAll({
      where,
      include: [{ model: Customer }, { model: Bill }],
      order: [['payment_date', 'DESC']]
    });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

router.post('/payments', async (req, res) => {
  try {
    const { bill_id, customer_id, payment_date, amount, mode, reference } = req.body;
    
    const payment = await Payment.create({
      bill_id,
      customer_id,
      payment_date,
      amount,
      mode,
      reference
    });
    
    // Update bill status if fully paid
    if (bill_id) {
      const bill = await Bill.findByPk(bill_id);
      const payments = await Payment.findAll({ where: { bill_id } });
      const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      if (totalPaid >= parseFloat(bill.total_amount)) {
        await bill.update({ status: 'PAID' });
      } else if (totalPaid > 0) {
        await bill.update({ status: 'PARTIALLY_PAID' });
      }
    }
    
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// ===========================
// REPORTS & ANALYTICS
// ===========================
router.get('/reports/dashboard', async (req, res) => {
  try {
    const totalCustomers = await Customer.count({ where: { status: 'ACTIVE' } });
    const totalBills = await Bill.count();
    const unpaidBills = await Bill.count({ where: { status: { [Op.in]: ['GENERATED', 'SENT', 'OVERDUE'] } } });
    
    const revenueResult = await Payment.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      raw: true
    });
    const totalRevenue = revenueResult.total || 0;
    
    const outstandingResult = await Bill.findOne({
      where: { status: { [Op.in]: ['GENERATED', 'SENT', 'OVERDUE', 'PARTIALLY_PAID'] } },
      attributes: [[sequelize.fn('SUM', sequelize.col('total_amount')), 'total']],
      raw: true
    });
    const outstandingAmount = outstandingResult.total || 0;
    
    const recentBills = await Bill.findAll({
      include: [{ model: Customer }],
      order: [['generated_at', 'DESC']],
      limit: 10
    });
    
    res.json({
      totalCustomers,
      totalBills,
      unpaidBills,
      totalRevenue,
      outstandingAmount,
      recentBills
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

router.get('/reports/monthly-revenue', async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();
    
    const monthlyData = await Payment.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('payment_date')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'revenue']
      ],
      where: sequelize.where(sequelize.fn('YEAR', sequelize.col('payment_date')), currentYear),
      group: [sequelize.fn('MONTH', sequelize.col('payment_date'))],
      order: [[sequelize.fn('MONTH', sequelize.col('payment_date')), 'ASC']],
      raw: true
    });
    
    res.json(monthlyData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate revenue report' });
  }
});

router.get('/reports/consumption', async (req, res) => {
  try {
    const { customer_id, limit } = req.query;
    
    const bills = await Bill.findAll({
      where: customer_id ? { customer_id } : {},
      attributes: ['period_start', 'period_end', 'units_consumed', 'total_amount'],
      include: [{ model: Customer, attributes: ['name', 'customer_code'] }],
      order: [['period_end', 'DESC']],
      limit: limit ? parseInt(limit) : 12
    });
    
    res.json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate consumption report' });
  }
});

module.exports = router;
