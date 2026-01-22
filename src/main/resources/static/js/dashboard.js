// Check authentication
const user = checkAuth();
if (!user) {
    window.location.href = '/index.html';
}

// Display user info
document.getElementById('userName').textContent = user.full_name || user.username;

// Load dashboard data
async function loadDashboard() {
    try {
        const data = await api.get('/reports/dashboard');
        
        document.getElementById('totalCustomers').textContent = data.totalCustomers || 0;
        document.getElementById('totalBills').textContent = data.totalBills || 0;
        document.getElementById('unpaidBills').textContent = data.unpaidBills || 0;
        document.getElementById('totalRevenue').textContent = formatCurrency(data.totalRevenue || 0);
        document.getElementById('outstandingAmount').textContent = formatCurrency(data.outstandingAmount || 0);
    } catch (error) {
        showError('Failed to load dashboard data');
    }
}

// Load data on page load
loadDashboard();
