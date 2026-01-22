const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME || 'ElectricityBillingSystem', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false
});

const Customer = sequelize.define('Customer', {
  customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_code: { type: DataTypes.STRING(32), unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT },
  connection_no: { type: DataTypes.STRING(64) },
  tariff_id: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('ACTIVE','SUSPENDED','DISCONNECTED'), defaultValue: 'ACTIVE' },
  contact_phone: { type: DataTypes.STRING(32) },
  contact_email: { type: DataTypes.STRING(255) }
}, { tableName: 'Customers', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Meter = sequelize.define('Meter', {
  meter_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  meter_no: { type: DataTypes.STRING(64), unique: true },
  install_date: { type: DataTypes.DATEONLY },
  meter_type: { type: DataTypes.STRING(64) },
  multiplier: { type: DataTypes.DECIMAL(10,4), defaultValue: 1.0 },
  status: { type: DataTypes.ENUM('INSTALLED','REPLACED','REMOVED'), defaultValue: 'INSTALLED' }
}, { tableName: 'Meters', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Tariff = sequelize.define('Tariff', {
  tariff_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(128) },
  description: { type: DataTypes.TEXT },
  tariff_json: { type: DataTypes.JSON },
  fixed_charge: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 }
}, { tableName: 'Tariffs', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Reading = sequelize.define('Reading', {
  reading_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reading_date: { type: DataTypes.DATEONLY, allowNull: false },
  reading_value: { type: DataTypes.DECIMAL(14,3), allowNull: false }
}, { tableName: 'Readings', timestamps: true, createdAt: 'created_at', updatedAt: false, indexes: [{ unique: true, fields: ['meter_id','reading_date'] }] });

const Bill = sequelize.define('Bill', {
  bill_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  period_start: { type: DataTypes.DATEONLY, allowNull: false },
  period_end: { type: DataTypes.DATEONLY, allowNull: false },
  units_consumed: { type: DataTypes.DECIMAL(14,3), defaultValue: 0.000 },
  energy_charge: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 },
  fixed_charge: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 },
  tax_amount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 },
  other_charges: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 },
  total_amount: { type: DataTypes.DECIMAL(14,2), defaultValue: 0.00 },
  due_date: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.ENUM('GENERATED','SENT','PAID','PARTIALLY_PAID','OVERDUE','CANCELLED'), defaultValue: 'GENERATED' }
}, { tableName: 'Bills', timestamps: true, createdAt: 'generated_at', updatedAt: false });

const Payment = sequelize.define('Payment', {
  payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  payment_date: { type: DataTypes.DATEONLY, allowNull: false },
  amount: { type: DataTypes.DECIMAL(14,2), allowNull: false },
  mode: { type: DataTypes.ENUM('CASH','CHEQUE','ONLINE','CARD','OTHER'), defaultValue: 'CASH' },
  reference: { type: DataTypes.STRING(255) }
}, { tableName: 'Payments', timestamps: true, createdAt: 'created_at', updatedAt: false });

const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(128), unique: true },
  password_hash: { type: DataTypes.STRING(255) },
  full_name: { type: DataTypes.STRING(255) },
  role: { type: DataTypes.ENUM('ADMIN','BILLING','VIEWER'), defaultValue: 'VIEWER' },
  email: { type: DataTypes.STRING(255) }
}, { tableName: 'Users', timestamps: true, createdAt: 'created_at', updatedAt: false });

const AuditLog = sequelize.define('AuditLog', {
  log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING(255) },
  details: { type: DataTypes.TEXT }
}, { tableName: 'AuditLogs', timestamps: true, createdAt: 'created_at', updatedAt: false });

// Associations
Customer.hasMany(Meter, { foreignKey: 'customer_id' });
Meter.belongsTo(Customer, { foreignKey: 'customer_id' });

Meter.hasMany(Reading, { foreignKey: 'meter_id' });
Reading.belongsTo(Meter, { foreignKey: 'meter_id' });

Customer.hasMany(Bill, { foreignKey: 'customer_id' });
Bill.belongsTo(Customer, { foreignKey: 'customer_id' });

Bill.hasMany(Payment, { foreignKey: 'bill_id' });
Payment.belongsTo(Bill, { foreignKey: 'bill_id' });

Customer.hasMany(Payment, { foreignKey: 'customer_id' });
Payment.belongsTo(Customer, { foreignKey: 'customer_id' });

Tariff.hasMany(Customer, { foreignKey: 'tariff_id' });
Customer.belongsTo(Tariff, { foreignKey: 'tariff_id' });

User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, Customer, Meter, Tariff, Reading, Bill, Payment, User, AuditLog };
