// Check authentication
checkAuth();

let customers = [];
let meters = [];

// Load customers for dropdown
async function loadCustomersDropdown() {
    try {
        customers = await api.get('/customers');
        const select = document.getElementById('customerId');
        select.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(customer => {
            select.innerHTML += `<option value="${customer.customerId}">${customer.name}</option>`;
        });
    } catch (error) {
        showError('Failed to load customers');
    }
}

// Load meters
async function loadMeters() {
    try {
        meters = await api.get('/meters');
        const tbody = document.getElementById('metersTable');
        
        if (meters.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No meters found</td></tr>';
            return;
        }
        
        tbody.innerHTML = meters.map(meter => {
            // Use the nested customer object from the meter response (EAGER fetching)
            const customerName = meter.customer ? meter.customer.name : 'N/A';
            return `
                <tr>
                    <td>${meter.meterNo}</td>
                    <td>${customerName}</td>
                    <td>${meter.meterType || '-'}</td>
                    <td>${formatDate(meter.installDate)}</td>
                    <td><span class="badge badge-${meter.status === 'INSTALLED' ? 'success' : 'warning'}">${meter.status}</span></td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        showError('Failed to load meters');
    }
}

// Show meter form
function showMeterForm() {
    document.getElementById('meterForm').style.display = 'block';
}

// Hide meter form
function hideMeterForm() {
    document.getElementById('meterForm').style.display = 'none';
    document.getElementById('meterFormElement').reset();
}

// Handle meter submission
async function handleMeter(e) {
    e.preventDefault();
    
    const formData = {
        customerId: parseInt(document.getElementById('customerId').value),
        meterNo: document.getElementById('meterNo').value,
        installDate: document.getElementById('installDate').value || null,
        meterType: document.getElementById('meterType').value || null,
        multiplier: parseFloat(document.getElementById('multiplier').value) || 1.0,
        status: 'INSTALLED'
    };
    
    try {
        await api.post('/meters', formData);
        showSuccess('Meter added successfully');
        hideMeterForm();
        loadMeters();
    } catch (error) {
        showError('Failed to add meter: ' + error.message);
    }
}

// Load data on page load
loadCustomersDropdown();
loadMeters();
