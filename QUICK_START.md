# Quick Start Guide - Electricity Billing System

## 🚀 System is Already Running!

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🔐 Login

**Username**: `admin`  
**Password**: `admin123`

## 📋 Quick Operations

### 1. View Dashboard
- Click "Dashboard" tab
- See total customers, bills, revenue, outstanding amounts
- View recent bills

### 2. Add a Customer
1. Click "Customers" tab
2. Fill in the form:
   - Name (required)
   - Address
   - Connection No
   - Select Tariff (Domestic/Commercial/Industrial)
   - Phone & Email
3. Click "Add Customer"
4. Customer appears in the list below

### 3. Add a Meter for Customer
1. Go to backend folder
2. Use API or add through database:
```javascript
POST /api/meters
{
  "customer_id": 1,
  "meter_no": "MTR-2024-001",
  "install_date": "2024-01-01",
  "meter_type": "Single Phase",
  "multiplier": 1.0
}
```

### 4. Record Meter Reading
1. Click "Readings" tab
2. Select meter from dropdown
3. Enter date (e.g., 2024-01-01)
4. Enter reading value (e.g., 10000.00)
5. Click "Record Reading"

### 5. Generate Bill
1. Click "Bills" tab
2. Select customer
3. Enter period start date (e.g., 2023-12-01)
4. Enter period end date (e.g., 2023-12-31)
5. Click "Generate Bill"
6. System calculates automatically!

**Note**: You need at least 2 readings for the period to generate a bill.

### 6. Record Payment
1. Click "Payments" tab
2. Select bill from dropdown (optional)
3. Select customer
4. Enter payment date
5. Enter amount
6. Select payment mode (Cash/Online/Cheque/Card)
7. Enter reference number (optional)
8. Click "Record Payment"
9. Bill status updates automatically!

### 7. View Reports
1. Click "Reports" tab
2. See collection efficiency
3. View customer-wise billing summary
4. Analyze consumption patterns

## 📊 Sample Data

The system comes with:
- ✅ 4 sample customers
- ✅ 4 meters installed
- ✅ Sample readings recorded
- ✅ 3 tariff plans (Domestic, Commercial, Industrial)

## 💡 Tariff Plans

### Domestic (₹/kWh)
- 0-100 units: ₹2.5
- 101-300 units: ₹4.0
- 301-500 units: ₹5.5
- 500+ units: ₹7.0
- Fixed charge: ₹50
- Tax: 5%

### Commercial (₹/kWh)
- 0-200 units: ₹5.0
- 201-500 units: ₹7.0
- 500+ units: ₹9.0
- Fixed charge: ₹150
- Tax: 10%

### Industrial (₹/kWh)
- 0-1000 units: ₹6.0
- 1000+ units: ₹8.0
- Fixed charge: ₹500
- Tax: 12%

## 🔧 Useful Commands

### Reinitialize System
```bash
cd backend
node init-system.js
```

### Add More Sample Data
```bash
cd backend
node populate-sample-data.js
```

### Restart Backend
```bash
cd backend
npm start
```

### Restart Frontend
```bash
cd frontend
npm start
```

## 🆘 Troubleshooting

### Backend not connecting?
- Check if backend server is running on port 5000
- Check `.env` file for database credentials

### Frontend not loading?
- Check if frontend server is running on port 3000
- Clear browser cache and refresh

### Can't login?
- Use username: `admin` password: `admin123`
- Run `node init-system.js` to recreate users

### No data showing?
- Run `node populate-sample-data.js` to add sample data

## 📚 Full Documentation

See these files for detailed information:
- `USER_GUIDE.md` - Complete user guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `README.md` - Project overview

## ✨ Enjoy using the Electricity Billing System!
