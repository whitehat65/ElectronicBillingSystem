// Check authentication
checkAuth();

let bills = [];
let payments = [];

// Load bills for dropdown
async function loadBillsDropdown() {
    try {
        bills = await api.get('/bills');
        const select = document.getElementById('billId');
        select.innerHTML = '<option value="">Select Bill</option>';
        
        // Only show unpaid or partially paid bills
        const unpaidBills = bills.filter(b => 
            b.status !== 'PAID' && b.status !== 'CANCELLED'
        );
        
        unpaidBills.forEach(bill => {
            select.innerHTML += `<option value="${bill.billId}">Bill #${bill.billId} - ${formatCurrency(bill.totalAmount)}</option>`;
        });
    } catch (error) {
        showError('Failed to load bills');
    }
}

// Load bill details
async function loadBillDetails() {
    const billId = document.getElementById('billId').value;
    if (!billId) {
        document.getElementById('amount').value = '';
        return;
    }
    
    const bill = bills.find(b => b.billId === parseInt(billId));
    if (bill) {
        document.getElementById('amount').value = parseFloat(bill.totalAmount).toFixed(2);
    }
}

// Load payments
async function loadPayments() {
    try {
        payments = await api.get('/payments');
        const tbody = document.getElementById('paymentsTable');
        
        if (payments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No payments found</td></tr>';
            return;
        }
        
        tbody.innerHTML = payments.map(payment => `
            <tr>
                <td>${payment.paymentId}</td>
                <td>${payment.billId || '-'}</td>
                <td>${formatDate(payment.paymentDate)}</td>
                <td>${formatCurrency(payment.amount)}</td>
                <td>${payment.mode}</td>
                <td>${payment.reference || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        showError('Failed to load payments');
    }
}

// Show payment form
function showPaymentForm() {
    document.getElementById('paymentForm').style.display = 'block';
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('paymentDate').value = today;
}

// Hide payment form
function hidePaymentForm() {
    document.getElementById('paymentForm').style.display = 'none';
    document.getElementById('paymentFormElement').reset();
}

// Handle payment submission
async function handlePayment(e) {
    e.preventDefault();
    
    const billId = document.getElementById('billId').value;
    const bill = bills.find(b => b.billId === parseInt(billId));
    
    const formData = {
        billId: billId ? parseInt(billId) : null,
        customerId: bill ? bill.customerId : null,
        paymentDate: document.getElementById('paymentDate').value,
        amount: parseFloat(document.getElementById('amount').value),
        mode: document.getElementById('mode').value,
        reference: document.getElementById('reference').value || null
    };
    
    try {
        await api.post('/payments', formData);
        showSuccess('Payment recorded successfully');
        hidePaymentForm();
        loadPayments();
        loadBillsDropdown(); // Refresh bills list
    } catch (error) {
        showError('Failed to record payment: ' + error.message);
    }
}

// Load data on page load
loadBillsDropdown();
loadPayments();
