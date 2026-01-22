// Check authentication
checkAuth();

let customers = [];
let tariffs = [];

// Load tariffs for dropdown
async function loadTariffs() {
    try {
        tariffs = await api.get('/tariffs');
        const select = document.getElementById('tariffId');
        select.innerHTML = '<option value="">Select Tariff</option>';
        tariffs.forEach(tariff => {
            select.innerHTML += `<option value="${tariff.tariffId}">${tariff.name}</option>`;
        });
    } catch (error) {
        showError('Failed to load tariffs');
    }
}

// Load customers
async function loadCustomers() {
    try {
        customers = await api.get('/customers');
        const tbody = document.getElementById('customersTable');
        
        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No customers found</td></tr>';
            return;
        }
        
        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.customerCode || ''}</td>
                <td>${customer.name}</td>
                <td>${customer.contactPhone || '-'}</td>
                <td>${customer.connectionNo || '-'}</td>
                <td><span class="badge badge-${customer.status === 'ACTIVE' ? 'success' : 'warning'}">${customer.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${customer.customerId})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showError('Failed to load customers');
    }
}

// Show add form
function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
}

// Hide add form
function hideAddForm() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('customerForm').reset();
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        connectionNo: document.getElementById('connectionNo').value,
        tariffId: parseInt(document.getElementById('tariffId').value),
        contactPhone: document.getElementById('contactPhone').value,
        contactEmail: document.getElementById('contactEmail').value
    };
    
    try {
        await api.post('/customers', formData);
        showSuccess('Customer added successfully');
        hideAddForm();
        loadCustomers();
    } catch (error) {
        showError('Failed to add customer: ' + error.message);
    }
}

// Delete customer
async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) {
        return;
    }
    
    try {
        await api.delete(`/customers/${id}`);
        showSuccess('Customer deleted successfully');
        loadCustomers();
    } catch (error) {
        showError('Failed to delete customer');
    }
}

// Load data on page load
loadTariffs();
loadCustomers();
