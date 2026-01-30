// Check authentication
checkAuth();

let meters = [];
let readings = [];
let customers = [];

// Fetch customers for lookup
async function loadCustomers() {
    try {
        customers = await api.get('/customers');
    } catch (error) {
        showError('Failed to load customers');
        customers = [];
    }
}

// Load meters for dropdown
async function loadMetersDropdown() {
    try {
        meters = await api.get('/meters');
        const select = document.getElementById('meterId');
        select.innerHTML = '<option value="">Select Meter</option>';
        meters.forEach(meter => {
            select.innerHTML += `<option value="${meter.meterId}">${meter.meterNo}</option>`;
        });
    } catch (error) {
        showError('Failed to load meters');
    }
}

// Load readings
async function loadReadings() {
    try {
        readings = await api.get('/readings');
        const tbody = document.getElementById('readingsTable');
        
        if (readings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No readings found</td></tr>';
            return;
        }
        
        tbody.innerHTML = readings.map(reading => {
            // Use the nested meter and customer objects from the reading response (EAGER fetching)
            const meterNo = reading.meter ? reading.meter.meterNo : 'N/A';
            const customerName = (reading.meter && reading.meter.customer) ? reading.meter.customer.name : 'N/A';
            return `
                <tr>
                    <td>${reading.readingId}</td>
                    <td>${meterNo}</td>
                    <td>${customerName}</td>
                    <td>${formatDate(reading.readingDate)}</td>
                    <td>${parseFloat(reading.readingValue).toFixed(3)}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        showError('Failed to load readings');
    }
}

// Show reading form
function showReadingForm() {
    document.getElementById('readingForm').style.display = 'block';
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('readingDate').value = today;
}

// Hide reading form
function hideReadingForm() {
    document.getElementById('readingForm').style.display = 'none';
    document.getElementById('readingFormElement').reset();
}

// Handle reading submission
async function handleReading(e) {
    e.preventDefault();
    
    const formData = {
        meterId: parseInt(document.getElementById('meterId').value),
        readingDate: document.getElementById('readingDate').value,
        readingValue: parseFloat(document.getElementById('readingValue').value)
    };
    
    try {
        await api.post('/readings', formData);
        showSuccess('Reading recorded successfully');
        hideReadingForm();
        loadReadings();
    } catch (error) {
        showError('Failed to record reading: ' + error.message);
    }
}

// Load data on page load
(async function initReadings() {
    await loadCustomers();
    await loadMetersDropdown();
    await loadReadings();
})();
