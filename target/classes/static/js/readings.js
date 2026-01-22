// Check authentication
checkAuth();

let meters = [];
let readings = [];

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
            const meter = meters.find(m => m.meterId === reading.meterId);
            return `
                <tr>
                    <td>${reading.readingId}</td>
                    <td>${meter ? meter.meterNo : 'N/A'}</td>
                    <td>${meter && meter.customer ? meter.customer.name : 'N/A'}</td>
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
loadMetersDropdown();
loadReadings();
