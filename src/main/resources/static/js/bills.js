// Check authentication
checkAuth();

let customers = [];
let bills = [];

// Load customers for dropdown
async function loadCustomers() {
    try {
        customers = await api.get('/customers');
        const select = document.getElementById('customerId');
        select.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(customer => {
            select.innerHTML += `<option value="${customer.customerId}">${customer.name} (${customer.customerCode})</option>`;
        });
    } catch (error) {
        showError('Failed to load customers');
    }
}

// Load bills
async function loadBills() {
    try {
        bills = await api.get('/bills');
        const tbody = document.getElementById('billsTable');
        
        if (bills.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No bills found</td></tr>';
            return;
        }
        
        tbody.innerHTML = bills.map(bill => {
            // Use the nested customer object from the bill response (EAGER fetching)
            const customerName = bill.customer ? bill.customer.name : 'N/A';
            return `
                <tr>
                    <td>${bill.billId}</td>
                    <td>${customerName}</td>
                    <td>${formatDate(bill.periodStart)} - ${formatDate(bill.periodEnd)}</td>
                    <td>${parseFloat(bill.unitsConsumed).toFixed(2)}</td>
                    <td>${formatCurrency(bill.totalAmount)}</td>
                    <td>${formatDate(bill.dueDate)}</td>
                    <td><span class="badge badge-${getBillStatusClass(bill.status)}">${bill.status}</span></td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        showError('Failed to load bills');
    }
}

function getBillStatusClass(status) {
    switch (status) {
        case 'PAID': return 'success';
        case 'PARTIALLY_PAID': return 'info';
        case 'OVERDUE': return 'danger';
        default: return 'warning';
    }
}

// Show generate form
function showGenerateForm() {
    document.getElementById('generateForm').style.display = 'block';
}

// Hide generate form
function hideGenerateForm() {
    document.getElementById('generateForm').style.display = 'none';
    document.getElementById('billForm').reset();
}

// Handle bill generation
async function handleGenerate(e) {
    e.preventDefault();
    
    const formData = {
        customerId: parseInt(document.getElementById('customerId').value),
        periodStart: document.getElementById('periodStart').value,
        periodEnd: document.getElementById('periodEnd').value
    };
    
    try {
        await api.post('/bills/generate', formData);
        showSuccess('Bill generated successfully');
        hideGenerateForm();
        loadBills();
    } catch (error) {
        showError('Failed to generate bill: ' + error.message);
    }
}

// Load data on page load
loadCustomers();
loadBills();
