// Check authentication
checkAuth();

let tariffs = [];

// Load tariffs
async function loadTariffs() {
    try {
        tariffs = await api.get('/tariffs');
        const tbody = document.getElementById('tariffsTable');
        
        if (tariffs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No tariffs found</td></tr>';
            return;
        }
        
        tbody.innerHTML = tariffs.map(tariff => `
            <tr>
                <td>${tariff.tariffId}</td>
                <td>${tariff.name}</td>
                <td>${tariff.description || '-'}</td>
                <td>${formatCurrency(tariff.fixedCharge)}</td>
            </tr>
        `).join('');
    } catch (error) {
        showError('Failed to load tariffs');
    }
}

// Show tariff form
function showTariffForm() {
    document.getElementById('tariffForm').style.display = 'block';
}

// Hide tariff form
function hideTariffForm() {
    document.getElementById('tariffForm').style.display = 'none';
    document.getElementById('tariffFormElement').reset();
}

// Handle tariff submission
async function handleTariff(e) {
    e.preventDefault();
    
    const tariffJsonStr = document.getElementById('tariffJson').value;
    
    // Validate JSON
    try {
        JSON.parse(tariffJsonStr);
    } catch (err) {
        showError('Invalid JSON format for tariff configuration');
        return;
    }
    
    const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value || null,
        fixedCharge: parseFloat(document.getElementById('fixedCharge').value) || 0,
        tariffJson: tariffJsonStr
    };
    
    try {
        await api.post('/tariffs', formData);
        showSuccess('Tariff added successfully');
        hideTariffForm();
        loadTariffs();
    } catch (error) {
        showError('Failed to add tariff: ' + error.message);
    }
}

// Load data on page load
loadTariffs();
