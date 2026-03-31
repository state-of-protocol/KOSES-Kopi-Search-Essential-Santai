/** 
 * PROTOKOL TEMA (THEME LOGIC) 
 * Mengawal pertukaran mod Gelap/Cerah secara lokal.
 */
function toggleTheme() {
    const b = document.documentElement;
    const isL = b.getAttribute('data-theme') === 'light';
    b.setAttribute('data-theme', isL ? 'dark' : 'light');
    localStorage.setItem('k-theme', isL ? 'dark' : 'light');
}

if (localStorage.getItem('k-theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
}

/** 
 * PROTOKOL CARIAN ASET (MAIN SEARCH) 
 * Simulasi audit neural yang pantas dan estetik.
 */
function handleKey(e) { if (e.key === 'Enter') runSearch(); }

function runSearch() {
    const input = document.getElementById('searchInput').value.trim();
    const results = document.getElementById('results');
    const out = document.getElementById('output');
    const btn = document.getElementById('searchBtn');

    if (!input) return;

    btn.innerText = "AUDITING...";
    btn.disabled = true;

    setTimeout(() => {
        results.style.display = 'block';
        btn.innerText = "EXECUTE";
        btn.disabled = false;

        const v = Math.floor(Math.random() * 30 + 70);
        document.getElementById('vVal').innerText = v;
        document.getElementById('bar').style.width = v + '%';

        out.innerHTML = `
            <div style="font-size:18px; color:var(--text); margin-bottom:10px;">> ACCESS_GRANTED: ${input.toUpperCase()}</div>
            <div style="font-size:11px; color:var(--dim); line-height:1.8;">
                Neural hash verified via Local Node Sync. Asset provenance confirmed 
                at Epoch 4. Synchronized with S.O.P Foundation standards.
            </div>
        `;

        window.scrollTo({ top: results.offsetTop - 50, behavior: 'smooth' });
    }, 1000);
}

/** 
 * PROTOKOL LOKASI & CUACA (WEATHER PROTOCOL) 
 * Menggunakan wttr.in (No API Key Required)
 */
function handleCityKey(e) { if (e.key === 'Enter') getWeather(); }

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;

    const display = document.getElementById('weatherDisplay');
    const btn = document.querySelector('.city-protocol button');
    
    btn.innerText = "...";

    try {
        // wttr.in/CityName?format=j1 untuk data JSON lengkap tanpa pendaftaran
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();

        display.style.display = 'flex';
        
        // 1. Paparan Nama Bandar, Suhu & Status
        document.getElementById('cityName').innerText = city.toUpperCase();
        document.getElementById('temp').innerText = data.current_condition[0].temp_C + "°C";
        document.getElementById('wDesc').innerText = data.current_condition[0].weatherDesc[0].value;

        // 2. Ekstraksi Masa 12 Jam (AM/PM) dari localObsDateTime
        // Format asal: "2026-03-31 09:51 AM"
        const localDateTime = data.current_condition[0].localObsDateTime; 
        const parts = localDateTime.split(' ');
        const timePart = parts[1]; // "09:51"
        const ampmPart = parts[2]; // "AM"
        
        document.getElementById('localTime').innerText = `${timePart} ${ampmPart}`;
        
        btn.innerText = "FETCH";

    } catch (error) {
        console.error("Weather Protocol Error:", error);
        btn.innerText = "RETRY";
        alert("Node failure: City not found or server timeout.");
    }
}

/** 
 * HUD UPDATE (REAL-TIME CLOCK) 
 * Kemaskini status bar setiap saat.
 */
setInterval(() => {
    const t = new Date().toLocaleTimeString('ms-MY', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    });
    document.getElementById('status').innerText = `SYNC_ACTIVE // ${t} // 85°C`;
}, 1000);
