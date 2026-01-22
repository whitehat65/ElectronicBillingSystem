import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  
  // Authentication
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  // Data states
  const [dashboard, setDashboard] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [tariffs, setTariffs] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [readings, setReadings] = useState([]);
  
  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: '', address: '', connection_no: '', tariff_id: '', contact_phone: '', contact_email: ''
  });
  const [readingForm, setReadingForm] = useState({
    meter_id: '', reading_date: '', reading_value: ''
  });
  const [billGenerateForm, setBillGenerateForm] = useState({
    customer_id: '', period_start: '', period_end: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    bill_id: '', customer_id: '', payment_date: '', amount: '', mode: 'CASH', reference: ''
  });
  
  // Load data
  useEffect(() => {
    if (user) {
      loadDashboard();
      loadCustomers();
      loadTariffs();
      loadBills();
      loadPayments();
      loadReadings();
    }
  }, [user]);
  
  const loadDashboard = async () => {
    const res = await fetch('/api/reports/dashboard');
    if (res.ok) setDashboard(await res.json());
  };
  
  const loadCustomers = async () => {
    const res = await fetch('/api/customers');
    if (res.ok) setCustomers(await res.json());
  };
  
  const loadTariffs = async () => {
    const res = await fetch('/api/tariffs');
    if (res.ok) setTariffs(await res.json());
  };
  
  const loadBills = async () => {
    const res = await fetch('/api/bills');
    if (res.ok) setBills(await res.json());
  };
  
  const loadPayments = async () => {
    const res = await fetch('/api/payments');
    if (res.ok) setPayments(await res.json());
  };
  
  const loadReadings = async () => {
    const res = await fetch('/api/readings');
    if (res.ok) setReadings(await res.json());
  };
  
  // Authentication handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    });
    
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      alert('Login successful!');
    } else {
      alert('Login failed. Please check credentials.');
    }
  };
  
  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };
  
  // Customer handlers
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerForm)
    });
    
    if (res.ok) {
      alert('Customer added successfully!');
      setCustomerForm({
        name: '', address: '', connection_no: '', tariff_id: '', contact_phone: '', contact_email: ''
      });
      loadCustomers();
    } else {
      alert('Failed to add customer');
    }
  };
  
  // Reading handlers
  const handleAddReading = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(readingForm)
    });
    
    if (res.ok) {
      alert('Reading recorded successfully!');
      setReadingForm({ meter_id: '', reading_date: '', reading_value: '' });
      loadReadings();
    } else {
      alert('Failed to record reading');
    }
  };
  
  // Bill generation handler
  const handleGenerateBill = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/bills/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billGenerateForm)
    });
    
    if (res.ok) {
      const bill = await res.json();
      alert(`Bill generated successfully! Amount: ₹${bill.total_amount}`);
      setBillGenerateForm({ customer_id: '', period_start: '', period_end: '' });
      loadBills();
      loadDashboard();
    } else {
      const error = await res.json();
      alert(`Failed to generate bill: ${error.error}`);
    }
  };
  
  // Payment handler
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentForm)
    });
    
    if (res.ok) {
      alert('Payment recorded successfully!');
      setPaymentForm({
        bill_id: '', customer_id: '', payment_date: '', amount: '', mode: 'CASH', reference: ''
      });
      loadPayments();
      loadBills();
      loadDashboard();
    } else {
      alert('Failed to record payment');
    }
  };
  
  // Login view
  if (!user) {
    return (
      <div className="app-container">
        <div className="login-container">
          <h1>⚡ Electricity Billing System</h1>
          <form onSubmit={handleLogin} className="form-card">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">Login</button>
            <p className="hint">Default: admin / admin123</p>
          </form>
        </div>
      </div>
    );
  }
  
  // Main application view
  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>⚡ Electricity Billing System</h1>
        <div className="nav-menu">
          <button onClick={() => setCurrentView('dashboard')} className={currentView === 'dashboard' ? 'active' : ''}>Dashboard</button>
          <button onClick={() => setCurrentView('customers')} className={currentView === 'customers' ? 'active' : ''}>Customers</button>
          <button onClick={() => setCurrentView('readings')} className={currentView === 'readings' ? 'active' : ''}>Readings</button>
          <button onClick={() => setCurrentView('bills')} className={currentView === 'bills' ? 'active' : ''}>Bills</button>
          <button onClick={() => setCurrentView('payments')} className={currentView === 'payments' ? 'active' : ''}>Payments</button>
          <button onClick={() => setCurrentView('reports')} className={currentView === 'reports' ? 'active' : ''}>Reports</button>
        </div>
        <div className="user-info">
          <span>{user.full_name} ({user.role})</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>
      
      <main className="main-content">
        {/* Dashboard View */}
        {currentView === 'dashboard' && dashboard && (
          <div className="view-container">
            <h2>Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Customers</h3>
                <p className="stat-value">{dashboard.totalCustomers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Bills</h3>
                <p className="stat-value">{dashboard.totalBills}</p>
              </div>
              <div className="stat-card">
                <h3>Unpaid Bills</h3>
                <p className="stat-value">{dashboard.unpaidBills}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">₹{parseFloat(dashboard.totalRevenue).toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <h3>Outstanding Amount</h3>
                <p className="stat-value">₹{parseFloat(dashboard.outstandingAmount).toFixed(2)}</p>
              </div>
            </div>
            
            <h3>Recent Bills</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Customer</th>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentBills.map(bill => (
                  <tr key={bill.bill_id}>
                    <td>#{bill.bill_id}</td>
                    <td>{bill.Customer?.name}</td>
                    <td>{bill.period_start} to {bill.period_end}</td>
                    <td>₹{parseFloat(bill.total_amount).toFixed(2)}</td>
                    <td><span className={`status ${bill.status.toLowerCase()}`}>{bill.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Customers View */}
        {currentView === 'customers' && (
          <div className="view-container">
            <h2>Customer Management</h2>
            
            <div className="form-card">
              <h3>Add New Customer</h3>
              <form onSubmit={handleAddCustomer}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={customerForm.address}
                    onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Connection No"
                    value={customerForm.connection_no}
                    onChange={(e) => setCustomerForm({ ...customerForm, connection_no: e.target.value })}
                  />
                  <select
                    value={customerForm.tariff_id}
                    onChange={(e) => setCustomerForm({ ...customerForm, tariff_id: e.target.value })}
                    required
                  >
                    <option value="">Select Tariff</option>
                    {tariffs.map(t => (
                      <option key={t.tariff_id} value={t.tariff_id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Phone"
                    value={customerForm.contact_phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, contact_phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={customerForm.contact_email}
                    onChange={(e) => setCustomerForm({ ...customerForm, contact_email: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Add Customer</button>
              </form>
            </div>
            
            <h3>Customer List</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Connection No</th>
                  <th>Tariff</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.customer_id}>
                    <td>{customer.customer_code}</td>
                    <td>{customer.name}</td>
                    <td>{customer.connection_no}</td>
                    <td>{customer.Tariff?.name || 'N/A'}</td>
                    <td>{customer.contact_phone}</td>
                    <td><span className={`status ${customer.status.toLowerCase()}`}>{customer.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Readings View */}
        {currentView === 'readings' && (
          <div className="view-container">
            <h2>Meter Readings</h2>
            
            <div className="form-card">
              <h3>Record New Reading</h3>
              <form onSubmit={handleAddReading}>
                <div className="form-row">
                  <select
                    value={readingForm.meter_id}
                    onChange={(e) => setReadingForm({ ...readingForm, meter_id: e.target.value })}
                    required
                  >
                    <option value="">Select Meter</option>
                    {customers.flatMap(c => c.Meters || []).map(m => (
                      <option key={m.meter_id} value={m.meter_id}>
                        {m.meter_no} - {customers.find(c => c.customer_id === m.customer_id)?.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={readingForm.reading_date}
                    onChange={(e) => setReadingForm({ ...readingForm, reading_date: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Reading Value"
                    value={readingForm.reading_value}
                    onChange={(e) => setReadingForm({ ...readingForm, reading_value: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Record Reading</button>
              </form>
            </div>
            
            <h3>Recent Readings</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Meter No</th>
                  <th>Customer</th>
                  <th>Reading Value</th>
                </tr>
              </thead>
              <tbody>
                {readings.map(reading => (
                  <tr key={reading.reading_id}>
                    <td>{reading.reading_date}</td>
                    <td>{reading.Meter?.meter_no}</td>
                    <td>{reading.Meter?.Customer?.name}</td>
                    <td>{parseFloat(reading.reading_value).toFixed(3)} kWh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Bills View */}
        {currentView === 'bills' && (
          <div className="view-container">
            <h2>Bill Management</h2>
            
            <div className="form-card">
              <h3>Generate Monthly Bill</h3>
              <form onSubmit={handleGenerateBill}>
                <div className="form-row">
                  <select
                    value={billGenerateForm.customer_id}
                    onChange={(e) => setBillGenerateForm({ ...billGenerateForm, customer_id: e.target.value })}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.customer_id} value={c.customer_id}>{c.name} - {c.customer_code}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    placeholder="Period Start"
                    value={billGenerateForm.period_start}
                    onChange={(e) => setBillGenerateForm({ ...billGenerateForm, period_start: e.target.value })}
                    required
                  />
                  <input
                    type="date"
                    placeholder="Period End"
                    value={billGenerateForm.period_end}
                    onChange={(e) => setBillGenerateForm({ ...billGenerateForm, period_end: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Generate Bill</button>
              </form>
            </div>
            
            <h3>All Bills</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Customer</th>
                  <th>Period</th>
                  <th>Units</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.bill_id}>
                    <td>#{bill.bill_id}</td>
                    <td>{bill.Customer?.name}</td>
                    <td>{bill.period_start} to {bill.period_end}</td>
                    <td>{parseFloat(bill.units_consumed).toFixed(2)} kWh</td>
                    <td>₹{parseFloat(bill.total_amount).toFixed(2)}</td>
                    <td>{bill.due_date}</td>
                    <td><span className={`status ${bill.status.toLowerCase()}`}>{bill.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Payments View */}
        {currentView === 'payments' && (
          <div className="view-container">
            <h2>Payment Processing</h2>
            
            <div className="form-card">
              <h3>Record Payment</h3>
              <form onSubmit={handleRecordPayment}>
                <div className="form-row">
                  <select
                    value={paymentForm.bill_id}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bill_id: e.target.value })}
                  >
                    <option value="">Select Bill (Optional)</option>
                    {bills.filter(b => b.status !== 'PAID').map(b => (
                      <option key={b.bill_id} value={b.bill_id}>
                        Bill #{b.bill_id} - {b.Customer?.name} - ₹{parseFloat(b.total_amount).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={paymentForm.customer_id}
                    onChange={(e) => setPaymentForm({ ...paymentForm, customer_id: e.target.value })}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.customer_id} value={c.customer_id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <input
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    required
                  />
                  <select
                    value={paymentForm.mode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                  >
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="ONLINE">Online</option>
                    <option value="CARD">Card</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Reference No"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Record Payment</button>
              </form>
            </div>
            
            <h3>Payment History</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Customer</th>
                  <th>Bill ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.payment_id}>
                    <td>#{payment.payment_id}</td>
                    <td>{payment.Customer?.name}</td>
                    <td>{payment.bill_id ? `#${payment.bill_id}` : '-'}</td>
                    <td>{payment.payment_date}</td>
                    <td>₹{parseFloat(payment.amount).toFixed(2)}</td>
                    <td>{payment.mode}</td>
                    <td>{payment.reference || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Reports View */}
        {currentView === 'reports' && dashboard && (
          <div className="view-container">
            <h2>Reports & Analytics</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Collection Efficiency</h3>
                <p className="stat-value">
                  {dashboard.totalRevenue > 0 
                    ? ((dashboard.totalRevenue / (parseFloat(dashboard.totalRevenue) + parseFloat(dashboard.outstandingAmount))) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <div className="stat-card">
                <h3>Average Bill Amount</h3>
                <p className="stat-value">
                  ₹{dashboard.totalBills > 0 
                    ? ((parseFloat(dashboard.totalRevenue) + parseFloat(dashboard.outstandingAmount)) / dashboard.totalBills).toFixed(2)
                    : 0}
                </p>
              </div>
            </div>
            
            <h3>Customer-wise Billing Summary</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total Bills</th>
                  <th>Total Units</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => {
                  const customerBills = bills.filter(b => b.customer_id === customer.customer_id);
                  const totalUnits = customerBills.reduce((sum, b) => sum + parseFloat(b.units_consumed), 0);
                  const totalAmount = customerBills.reduce((sum, b) => sum + parseFloat(b.total_amount), 0);
                  
                  return (
                    <tr key={customer.customer_id}>
                      <td>{customer.name}</td>
                      <td>{customerBills.length}</td>
                      <td>{totalUnits.toFixed(2)} kWh</td>
                      <td>₹{totalAmount.toFixed(2)}</td>
                      <td><span className={`status ${customer.status.toLowerCase()}`}>{customer.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
