# Testing Guide - LazyInitializationException Fix

## Quick Test Commands

After starting the application, test each endpoint to verify the fixes:

### 1. Start the Application
```powershell
cd D:\development\ElectronicBillingSystem
.\local_maven\apache-maven-3.9.12\bin\mvn.cmd spring-boot:run
```

Wait for: `Started ElectricityBillingApplication in X seconds`

### 2. Test Bills API (Main Issue)
```powershell
# PowerShell
Invoke-WebRequest -Uri "http://localhost:8080/api/bills" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected**: ✅ JSON response with bills including customer and payments data  
**Previously**: ❌ 500 Error - LazyInitializationException on Bill.payments

### 3. Test Customers API
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/customers" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected**: ✅ JSON response with customers including tariff data  
**Previously**: ❌ 500 Error - LazyInitializationException on Customer.tariff

### 4. Test Meters API
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/meters" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected**: ✅ JSON response with meters including customer and readings data  
**Previously**: ❌ 500 Error - LazyInitializationException on Meter.customer or Meter.readings

### 5. Test Readings API
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/readings" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected**: ✅ JSON response with readings including meter data

### 6. Test Payments API
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/payments" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected**: ✅ JSON response with payments including bill and customer data

### 7. Test Tariffs API
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/tariffs" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected**: ✅ JSON response with tariffs (this was already working)

## Using Browser

Open your browser and navigate to:
1. http://localhost:8080
2. Login with: admin / admin123
3. Navigate through each menu item:
   - Customers (should show customers with tariff info)
   - Tariffs (should work)
   - Meters (should show meters with customer and readings)
   - Readings (should show all readings)
   - Bills (should show bills with customer and payment info) ← **Main fix**
   - Payments (should show payments with related data)

## Expected Sample Response for Bills

```json
[
  {
    "billId": 1,
    "customerId": 1,
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-31",
    "unitsConsumed": 150.000,
    "energyCharge": 750.00,
    "fixedCharge": 50.00,
    "taxAmount": 40.00,
    "otherCharges": 0.00,
    "totalAmount": 840.00,
    "dueDate": "2024-02-15",
    "status": "GENERATED",
    "generatedAt": "2024-01-31T10:00:00",
    "customer": {
      "customerId": 1,
      "customerCode": "CUST001",
      "name": "John Doe",
      "address": "123 Main St",
      "tariffId": 1,
      "status": "ACTIVE",
      "contactPhone": "1234567890",
      "contactEmail": "john@example.com",
      "tariff": {
        "tariffId": 1,
        "name": "Domestic",
        "description": "Residential tariff",
        "fixedCharge": 50.00
      }
    },
    "payments": [
      {
        "paymentId": 1,
        "billId": 1,
        "customerId": 1,
        "paymentDate": "2024-02-10",
        "amount": 840.00,
        "mode": "ONLINE",
        "reference": "TXN123456"
      }
    ]
  }
]
```

## What Was Fixed

### Before
```
GET /api/bills
❌ Status: 500 Internal Server Error
❌ Error: LazyInitializationException - failed to lazily initialize collection Bill.payments
```

### After
```
GET /api/bills
✅ Status: 200 OK
✅ Response: Complete JSON with nested customer (with tariff) and payments
```

## If You Still See Errors

1. **Restart the application** - Make sure the new compiled version is running
2. **Check console logs** - Look for any startup errors
3. **Verify database connection** - Ensure remote MySQL is accessible
4. **Clear browser cache** - Sometimes old JavaScript is cached
5. **Check AdminUserSeeder logs** - Verify admin user was created/updated

## Console Logs to Look For

### Successful Startup
```
Started ElectricityBillingApplication in X.XXX seconds
========================================
Checking Admin User...
========================================
✓ Admin user created successfully!
========================================
Login Credentials:
Username: admin
Password: admin123
========================================
```

### Successful API Call
```
DEBUG ... - GET "/api/bills", parameters={}
DEBUG ... - Mapped to com.electricitybilling.controller.BillController#getAllBills()
DEBUG ... - Using 'application/json'
DEBUG ... - Writing [...]
DEBUG ... - Completed 200 OK
```

---

**All tests should pass with 200 OK responses!**  
**Date**: January 30, 2026
