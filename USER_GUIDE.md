# ⚡ Electricity Billing System

A comprehensive web-based Electricity Billing System that automates bill generation, customer management, meter readings, and payment processing for utility providers.

## 📋 Project Overview

### Introduction
An Electricity Billing System is a software solution that automates the manual process of generating electricity bills, calculating units consumed, managing customer data, and processing payments. This system aims to improve efficiency, accuracy, and convenience for both utility providers and consumers by reducing paperwork, saving time, and enabling online access.

### Key Features
- **Automated Bill Calculation** - Slab-based tariff calculation with automatic tax computation
- **Centralized Record Management** - Single database for customers, meters, readings, and bills
- **Improved Security** - Role-based access control (Admin, Billing, Viewer)
- **Monthly Bill Generation** - Automated bill generation based on meter readings
- **Comprehensive Reports** - Dashboard analytics, revenue reports, and consumption tracking
- **Payment Processing** - Multiple payment modes with automatic bill status updates
- **Meter Reading Management** - Record and track meter readings over time
- **Customer Management** - Complete customer lifecycle management

## 🎯 Objectives

1. **Automation of Bill Calculation** - Eliminate manual calculation errors with automated slab-based pricing
2. **Centralized Record Management** - Store all customer, billing, and payment data in one secure location
3. **Improved Security** - Implement authentication and role-based access control
4. **Generate Monthly Bills** - Automate the monthly billing process based on consumption
5. **Generate Reports** - Provide insights through dashboard, revenue, and consumption reports

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js with Express.js
- MySQL database
- Sequelize ORM
- bcrypt for password hashing
- CORS enabled

**Frontend:**
- React 18+
- Modern CSS with responsive design
- RESTful API integration

### Database Schema

- **Customers** - Customer information and contact details
- **Meters** - Meter installations linked to customers
- **Tariffs** - Pricing slabs and tax configuration
- **Readings** - Historical meter readings
- **Bills** - Generated bills with charge breakdown
- **Payments** - Payment records and modes
- **Users** - System users with role-based access
- **AuditLogs** - System activity tracking

## 🚀 Quick Start

The system is already running! Open your browser to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Default Login
- **Username:** admin
- **Password:** admin123

## 📱 Application Features

### 1. Dashboard
- Total customers count
- Total bills generated
- Unpaid bills tracking
- Total revenue collected
- Outstanding amount
- Recent bills overview

### 2. Customer Management
- Add new customers with tariff assignment
- View and manage customer list
- Track customer status (Active/Suspended/Disconnected)
- Update customer information

### 3. Meter Reading Management
- Record meter readings
- View reading history
- Link meters to customers

### 4. Bill Generation
- Automated slab-based calculation
- Select customer and billing period
- Automatic unit consumption from readings
- Energy + Fixed charges + Tax calculation

### 5. Payment Processing
- Record payments against bills
- Multiple payment modes (Cash, Cheque, Online, Card)
- Automatic bill status updates

### 6. Reports & Analytics
- Collection efficiency metrics
- Customer-wise billing summary
- Revenue and consumption analysis

## 💡 Usage Guide

### Adding a New Customer
1. Navigate to "Customers" tab
2. Fill in customer details
3. Select tariff plan
4. System generates unique customer code

### Recording Readings
1. Go to "Readings" tab
2. Select meter
3. Enter date and reading value

### Generating Bills
1. Navigate to "Bills" tab
2. Select customer and period
3. System calculates from readings
4. Bill generated automatically

### Processing Payments
1. Go to "Payments" tab
2. Select bill or customer
3. Enter payment details
4. Bill status updates automatically

## 📊 Tariff Calculation Example

**Units consumed:** 250 kWh  
- First 100 units: 100 × ₹2.5 = ₹250
- Next 150 units: 150 × ₹4.0 = ₹600
- **Energy charge:** ₹850
- **Fixed charge:** ₹50
- **Tax (5%):** ₹45
- **Total:** ₹945

## 🛠️ API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - Register user

### Customers
- GET `/api/customers` - List customers
- POST `/api/customers` - Add customer
- PUT `/api/customers/:id` - Update
- DELETE `/api/customers/:id` - Delete

### Readings
- GET `/api/readings` - List readings
- POST `/api/readings` - Record reading

### Bills
- GET `/api/bills` - List bills
- POST `/api/bills/generate` - Generate bill

### Payments
- GET `/api/payments` - List payments
- POST `/api/payments` - Record payment

### Reports
- GET `/api/reports/dashboard` - Dashboard stats
- GET `/api/reports/monthly-revenue` - Revenue report
- GET `/api/reports/consumption` - Consumption report

## 📁 Project Structure

```
ElectronicBillingSystem/
├── backend/
│   ├── src/
│   │   ├── index.js       # Express server
│   │   ├── models.js      # Database models
│   │   └── routes.js      # API routes
│   ├── seed/              # Database seed files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   └── index.js       # Entry point
│   └── package.json
└── docs/
    └── database_schema.sql
```

## 🔒 Security Features

- Password hashing with bcrypt
- Role-based access control
- Audit logging
- Secure API endpoints

## 📈 Future Enhancements

- SMS/Email notifications
- Online payment gateway
- Mobile app
- PDF bill generation
- Advanced analytics
- Automated meter reading

---

**Electricity Billing System**  
*Automating utility billing for better efficiency*
