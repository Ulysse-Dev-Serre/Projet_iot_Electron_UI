let API_KEY = localStorage.getItem('api_key') || CONFIG.API_KEY;
let BASE_URL = localStorage.getItem('base_url') || CONFIG.BASE_URL;

let isConnected = false;
let tempChart = null;
let humChart = null;
let co2Chart = null;

function switchTab(tabName) {
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
  
  document.getElementById('content-dashboard').classList.add('hidden');
  document.getElementById('content-history').classList.add('hidden');
  
  document.getElementById(`content-${tabName}`).classList.remove('hidden');
  
  if (tabName === 'history' && !tempChart) {
    loadHistory(24);
  }
}

function openSettingsModal() {
  document.getElementById('config-base-url').value = BASE_URL;
  document.getElementById('config-api-key').value = API_KEY;
  document.getElementById('settings-modal').classList.remove('hidden');
}

function closeSettingsModal() {
  document.getElementById('settings-modal').classList.add('hidden');
}

function openConfigModal() {
  document.getElementById('config-modal').classList.remove('hidden');
}

function closeConfigModal() {
  document.getElementById('config-modal').classList.add('hidden');
}

function saveConnectionSettings() {
  BASE_URL = document.getElementById('config-base-url').value.trim();
  API_KEY = document.getElementById('config-api-key').value.trim();
  
  localStorage.setItem('base_url', BASE_URL);
  localStorage.setItem('api_key', API_KEY);
  
  closeSettingsModal();
  showNotification('success', 'Paramètres enregistrés');
  fetchStatus();
}

async function fetchStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/status`);
    const data = await response.json();

    updateConnectionStatus(true);

    if (!data.sensor_read_ok) {
      document.getElementById('sensor-alert').classList.remove('hidden');
    } else {
      document.getElementById('sensor-alert').classList.add('hidden');
    }

    document.getElementById('temperature').textContent = 
      data.temperature === "N/A" ? "---" : data.temperature;
    document.getElementById('humidity').textContent = 
      data.humidite === "N/A" ? "---" : data.humidite;
    document.getElementById('co2').textContent = 
      data.co2 === "N/A" ? "---" : data.co2;
    document.getElementById('timestamp').textContent = data.timestamp;

    updateActuator('leds', data.leds);
    updateActuator('humidifier', data.humidifier);
    updateActuator('ventilation', data.ventilation);
  } catch (error) {
    console.error('Erreur de connexion:', error);
    updateConnectionStatus(false);
  }
}

function updateActuator(name, data) {
  const statusEl = document.getElementById(`${name}-status`);
  const modeEl = document.getElementById(`${name}-mode`);

  const isActive = data.is_active;
  const isManual = data.manual_mode;

  if (isActive) {
    statusEl.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-neon-green"></span>
      ON
    `;
    statusEl.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-neon-green/10 rounded text-xs font-bold uppercase tracking-wider text-neon-green';
  } else {
    statusEl.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
      OFF
    `;
    statusEl.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-700 rounded text-xs font-bold uppercase tracking-wider text-gray-300';
  }

  if (isManual) {
    modeEl.textContent = 'MANUEL';
    modeEl.className = 'px-2.5 py-1 bg-neon-orange/10 text-neon-orange rounded text-xs font-bold uppercase tracking-wider';
  } else {
    modeEl.textContent = 'AUTO';
    modeEl.className = 'px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold uppercase tracking-wider';
  }
}

function updateConnectionStatus(connected) {
  isConnected = connected;
  const statusDot = document.querySelector('#connection-status');
  const statusText = document.querySelector('#connection-text');
  
  if (connected) {
    statusDot.className = 'w-2 h-2 rounded-full bg-neon-cyan animate-pulse transition-all';
    statusText.textContent = 'Online';
    statusText.className = 'text-xs text-neon-cyan uppercase tracking-wider';
  } else {
    statusDot.className = 'w-2 h-2 rounded-full bg-red-400 transition-all';
    statusText.textContent = 'Offline';
    statusText.className = 'text-xs text-red-400 uppercase tracking-wider';
  }
}

async function controlActuator(actuator, state) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }
    
    const response = await fetch(`${BASE_URL}/api/control/${actuator}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        manual_mode: true,
        state: state
      })
    });

    const result = await response.json();
    if (result.success) {
      await fetchStatus();
      showNotification('success', `${actuator.toUpperCase()} ${state ? 'activé' : 'désactivé'}`);
    }
  } catch (error) {
    console.error('Erreur de contrôle:', error);
    showNotification('error', 'Erreur de connexion');
  }
}

async function setAutoMode(actuator) {
  try {
    const url = `${BASE_URL}/api/control/${actuator}`;
    const body = JSON.stringify({ manual_mode: false });

    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    const result = await response.json();
    if (result.success) {
      await fetchStatus();
      showNotification('success', `${actuator.toUpperCase()} en mode automatique`);
    }
  } catch (error) {
    console.error('Erreur mode auto:', error);
    showNotification('error', 'Erreur de connexion');
  }
}

async function setAutoModeAll() {
  try {
    const headers = {};
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }

    const response = await fetch(`${BASE_URL}/api/control/auto`, {
      method: 'POST',
      headers: headers
    });

    const result = await response.json();
    if (result.success) {
      await fetchStatus();
      showNotification('success', 'Tous les appareils en mode automatique');
    }
  } catch (error) {
    console.error('Erreur mode auto global:', error);
    showNotification('error', 'Erreur de connexion');
  }
}

async function emergencyStop() {
  if (!confirm('⚠️ Arrêter tous les appareils immédiatement ?')) return;

  try {
    const headers = {};
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }
    
    const response = await fetch(`${BASE_URL}/api/control/emergency_stop`, {
      method: 'POST',
      headers: headers
    });

    const result = await response.json();
    if (result.success) {
      showNotification('warning', 'Arrêt d\'urgence effectué');
      await fetchStatus();
    }
  } catch (error) {
    console.error('Erreur arrêt d\'urgence:', error);
    showNotification('error', 'Erreur de connexion');
  }
}

async function loadSettings() {
  try {
    const response = await fetch(`${BASE_URL}/api/settings`);
    const settings = await response.json();

    document.getElementById('led-start').value = settings.HEURE_DEBUT_LEDS;
    document.getElementById('led-end').value = settings.HEURE_FIN_LEDS;
    document.getElementById('humidity-on').value = settings.SEUIL_HUMIDITE_ON;
    document.getElementById('humidity-off').value = settings.SEUIL_HUMIDITE_OFF;
    document.getElementById('co2-max').value = settings.SEUIL_CO2_MAX;
    
    updateConfigDisplay();
  } catch (error) {
    console.error('Erreur chargement config:', error);
  }
}

async function saveSettings() {
  const settings = {
    HEURE_DEBUT_LEDS: parseInt(document.getElementById('led-start').value),
    HEURE_FIN_LEDS: parseInt(document.getElementById('led-end').value),
    SEUIL_HUMIDITE_ON: parseFloat(document.getElementById('humidity-on').value),
    SEUIL_HUMIDITE_OFF: parseFloat(document.getElementById('humidity-off').value),
    SEUIL_CO2_MAX: parseFloat(document.getElementById('co2-max').value)
  };

  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }
    
    const response = await fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ settings })
    });

    const result = await response.json();
    showNotification('success', result.message || 'Configuration enregistrée');
    closeConfigModal();
    updateConfigDisplay();
  } catch (error) {
    console.error('Erreur sauvegarde config:', error);
    showNotification('error', 'Erreur de connexion');
  }
}

function updateConfigDisplay() {
  const ledStart = document.getElementById('led-start').value;
  const ledEnd = document.getElementById('led-end').value;
  const humOn = document.getElementById('humidity-on').value;
  const humOff = document.getElementById('humidity-off').value;
  const co2 = document.getElementById('co2-max').value;
  
  document.getElementById('config-leds').textContent = `${ledStart}h-${ledEnd}h`;
  document.getElementById('config-humidity').textContent = `${humOn}%-${humOff}%`;
  document.getElementById('config-co2').textContent = `${co2}ppm`;
}

function showNotification(type, message) {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500'
  };

  const notification = document.createElement('div');
  notification.className = `fixed top-20 right-6 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-2xl z-50 fade-in`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

document.getElementById('btn-leds-on').onclick = () => controlActuator('leds', true);
document.getElementById('btn-leds-off').onclick = () => controlActuator('leds', false);
document.getElementById('btn-leds-auto').onclick = () => setAutoMode('leds');

document.getElementById('btn-humidifier-on').onclick = () => controlActuator('humidifier', true);
document.getElementById('btn-humidifier-off').onclick = () => controlActuator('humidifier', false);
document.getElementById('btn-humidifier-auto').onclick = () => setAutoMode('humidifier');

document.getElementById('btn-ventilation-on').onclick = () => controlActuator('ventilation', true);
document.getElementById('btn-ventilation-off').onclick = () => controlActuator('ventilation', false);
document.getElementById('btn-ventilation-auto').onclick = () => setAutoMode('ventilation');

document.getElementById('btn-emergency').onclick = emergencyStop;
document.getElementById('btn-auto-all').onclick = setAutoModeAll;
document.getElementById('btn-save-config').onclick = saveSettings;

async function loadHistory(hours = 24) {
  try {
    let limit = 500;
    if (hours === 24) {
      limit = 5760;  // 24h × 240 mesures/h (mesures toutes les 15s)
    } else if (hours === 48) {
      limit = 11520;  // 48h × 240 mesures/h
    } else if (hours === 168) {
      limit = 40320;  // 168h × 240 mesures/h
    }
    
    const response = await fetch(`${BASE_URL}/api/history?limit=${limit}`);
    const result = await response.json();
    
    if (!result.data || result.data.length === 0) {
      showNotification('warning', 'Aucune donnée historique disponible');
      return;
    }

    let rawData = result.data.reverse();
    
    // Grouper les données par période et calculer la moyenne
    const grouped = {};
    let groupInterval;
    
    if (hours === 24) {
      groupInterval = 60 * 60 * 1000; // 1 heure en ms
    } else if (hours === 48) {
      groupInterval = 4 * 60 * 60 * 1000; // 4 heures en ms
    } else if (hours === 168) {
      groupInterval = 12 * 60 * 60 * 1000; // 12 heures en ms
    }
    
    rawData.forEach(d => {
      const date = new Date(d.timestamp);
      const timestamp = date.getTime();
      const groupKey = Math.floor(timestamp / groupInterval) * groupInterval;
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          temps: [],
          hums: [],
          co2s: [],
          timestamp: groupKey
        };
      }
      
      const temp = parseFloat(d.temperature);
      const hum = parseFloat(d.humidity);
      const co2 = parseFloat(d.co2);
      
      if (!isNaN(temp)) grouped[groupKey].temps.push(temp);
      if (!isNaN(hum)) grouped[groupKey].hums.push(hum);
      if (!isNaN(co2)) grouped[groupKey].co2s.push(co2);
    });
    
    // Convertir en tableau et calculer moyennes
    const data = Object.values(grouped).map(group => ({
      timestamp: new Date(group.timestamp),
      temperature: group.temps.length > 0 ? group.temps.reduce((a, b) => a + b) / group.temps.length : 0,
      humidity: group.hums.length > 0 ? group.hums.reduce((a, b) => a + b) / group.hums.length : 0,
      co2: group.co2s.length > 0 ? group.co2s.reduce((a, b) => a + b) / group.co2s.length : 0
    })).sort((a, b) => a.timestamp - b.timestamp);
    
    const labels = data.map((d, index) => {
      const currentDate = d.timestamp.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      const time = d.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      
      if (index === 0) {
        return currentDate + '\n' + time;
      }
      
      const previousDate = data[index - 1].timestamp.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      
      if (currentDate !== previousDate) {
        return currentDate + '\n' + time;
      }
      
      return time;
    });
    
    const temps = data.map(d => d.temperature);
    const hums = data.map(d => d.humidity);
    const co2s = data.map(d => d.co2);

    if (tempChart) tempChart.destroy();
    if (humChart) humChart.destroy();
    if (co2Chart) co2Chart.destroy();

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(18, 18, 26, 0.95)',
          titleColor: '#00f0ff',
          bodyColor: '#9ca3af',
          borderColor: '#252537',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          titleFont: { family: 'monospace', size: 12 },
          bodyFont: { family: 'monospace', size: 11 }
        }
      },
      scales: {
        x: {
          ticks: { 
            color: '#6b7280',
            font: { family: 'monospace', size: 10 },
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12
          },
          grid: { 
            color: '#252537',
            drawTicks: false
          }
        }
      }
    };

    tempChart = new Chart(document.getElementById('tempChart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Température',
          data: temps,
          borderColor: '#00f0ff',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ticks: { 
              color: '#00f0ff', 
              font: { family: 'monospace', size: 10 },
              callback: function(value) { return Math.round(value) + '°C'; }
            },
            grid: { color: 'rgba(0, 240, 255, 0.1)' }
          }
        }
      }
    });

    humChart = new Chart(document.getElementById('humChart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Humidité',
          data: hums,
          borderColor: '#b794f6',
          backgroundColor: 'rgba(183, 148, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ticks: { 
              color: '#b794f6', 
              font: { family: 'monospace', size: 10 },
              callback: function(value) { return Math.round(value) + '%'; }
            },
            grid: { color: 'rgba(183, 148, 246, 0.1)' }
          }
        }
      }
    });

    co2Chart = new Chart(document.getElementById('co2Chart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'CO2',
          data: co2s,
          borderColor: '#00ff88',
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: {
            ticks: { 
              color: '#00ff88', 
              font: { family: 'monospace', size: 10 },
              callback: function(value) { return Math.round(value) + ' ppm'; }
            },
            grid: { color: 'rgba(0, 255, 136, 0.1)' }
          }
        }
      }
    });

    // Calculer les stats sur toutes les données brutes
    const allTemps = rawData.map(d => parseFloat(d.temperature)).filter(v => !isNaN(v));
    const allHums = rawData.map(d => parseFloat(d.humidity)).filter(v => !isNaN(v));
    const allCo2s = rawData.map(d => parseFloat(d.co2)).filter(v => !isNaN(v));
    
    const tempAvg = allTemps.length > 0 ? (allTemps.reduce((a, b) => a + b, 0) / allTemps.length).toFixed(1) : '--';
    const tempMin = allTemps.length > 0 ? Math.min(...allTemps).toFixed(1) : '--';
    const tempMax = allTemps.length > 0 ? Math.max(...allTemps).toFixed(1) : '--';
    
    const humAvg = allHums.length > 0 ? (allHums.reduce((a, b) => a + b, 0) / allHums.length).toFixed(1) : '--';
    const humMin = allHums.length > 0 ? Math.min(...allHums).toFixed(1) : '--';
    const humMax = allHums.length > 0 ? Math.max(...allHums).toFixed(1) : '--';
    
    const co2Avg = allCo2s.length > 0 ? Math.floor(allCo2s.reduce((a, b) => a + b, 0) / allCo2s.length) : '--';
    const co2Min = allCo2s.length > 0 ? Math.floor(Math.min(...allCo2s)) : '--';
    const co2Max = allCo2s.length > 0 ? Math.floor(Math.max(...allCo2s)) : '--';

    document.getElementById('temp-avg').textContent = `${tempAvg}°C`;
    document.getElementById('temp-min').textContent = `${tempMin}°C`;
    document.getElementById('temp-max').textContent = `${tempMax}°C`;
    
    document.getElementById('hum-avg').textContent = `${humAvg}%`;
    document.getElementById('hum-min').textContent = `${humMin}%`;
    document.getElementById('hum-max').textContent = `${humMax}%`;
    
    document.getElementById('co2-avg').textContent = `${co2Avg} ppm`;
    document.getElementById('co2-min').textContent = `${co2Min} ppm`;
    document.getElementById('co2-max-hist').textContent = `${co2Max} ppm`;

  } catch (error) {
    console.error('Erreur chargement historique:', error);
    showNotification('error', 'Erreur lors du chargement de l\'historique');
  }
}

loadSettings();
fetchStatus();
setInterval(fetchStatus, 10000);
