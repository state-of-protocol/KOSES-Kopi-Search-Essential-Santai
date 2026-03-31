/** 
 * PROTOKOL TEMA (THEME LOGIC) 
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
 * PROTOKOL CARIAN AI (SERVERLESS MODE) 
 */
function handleKey(e) { if (e.key === 'Enter') runSearch(); }

async function runSearch() {
    const input = document.getElementById('searchInput').value.trim();
    const results = document.getElementById('results'); // Container audit/progress
    const out = document.getElementById('output');    // Lokasi text audit
    const btn = document.getElementById('searchBtn');

    if (!input) return;

    // Inisialisasi UI
    btn.innerText = "NEURAL_LINKING...";
    btn.disabled = true;
    results.style.display = 'block';
    
    // Reset output & sembunyikan grid lama jika ada
    out.innerHTML = `<div style="color:var(--accent); font-size:11px; letter-spacing:1px;">> INITIATING_CRAWL: ${input.toUpperCase()}...</div>`;
    
    // Pastikan ada elemen grid dalam HTML anda, jika tiada kita cipta secara dinamik
    let grid = document.getElementById('results-grid');
    if (grid) grid.style.display = 'none';

    try {
        // 1. Panggil Serverless Function (Vercel)
        const response = await fetch(`/api/search?query=${encodeURIComponent(input)}`);
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        const aiResponse = data.candidates[0].content.parts[0].text;

        // 2. Simulasi Proses "Neural Audit"
        setTimeout(() => {
            btn.innerText = "EXECUTE";
            btn.disabled = false;
            
            // Update Progress Bar
            const v = Math.floor(Math.random() * 15 + 85);
            document.getElementById('vVal').innerText = v;
            document.getElementById('bar').style.width = v + '%';

            // Paparkan Status Audit
            out.innerHTML = `
                <div style="font-size:16px; color:var(--accent); margin-bottom:12px; font-weight:bold;">> ACCESS_GRANTED: DATA_STREAM_STABLE</div>
                <div style="font-size:12px; color:var(--dim); margin-bottom:10px;">ANALYSIS_COMPLETE: Link established via Vercel Edge Node.</div>
            `;

            // 3. Bina Grid "Stem Digital" secara dinamik
            // Kita pecahkan respon AI kepada beberapa blok untuk nampak lebih 'High-Tech'
            const segments = aiResponse.split('\n').filter(t => t.length > 5);
            
            // Jika grid belum ada dalam HTML, kita selitkan di bawah 'output'
            if (!grid) {
                grid = document.createElement('div');
                grid.id = 'results-grid';
                out.after(grid);
            }

            grid.style.display = 'grid';
            grid.innerHTML = segments.map((text, index) => `
                <div class="stem-card" style="animation: fadeIn ${0.3 + (index * 0.1)}s ease forwards;">
                    <span class="stem-url">KOSES/NODE/0${index + 1}</span>
                    <div class="stem-title">DATA_FRAGMENT_${index + 1}</div>
                    <p class="stem-desc">${text}</p>
                </div>
            `).join('');

            window.scrollTo({ top: results.offsetTop - 50, behavior: 'smooth' });
        }, 800);

    } catch (error) {
        console.error("Node Error:", error);
        btn.innerText = "RETRY";
        btn.disabled = false;
        out.innerHTML = `<div style="color:#ff5555; font-size:11px;">> ERROR: SECURE_CONNECTION_FAILED. Semak sambungan Vercel/API Key.</div>`;
    }
}

/** 
 * PROTOKOL CARIAN LOKASI GLOBAL 
 */
async function searchLocation() {
    const input = document.getElementById('cityInput').value.trim().toUpperCase();
    const suggestions = document.getElementById('citySuggestions');
    
    if (input.length < 2) {
        suggestions.style.display = 'none';
        return;
    }

    try {
        const continentFiles = ['./data/asia.json', './data/europe.json', './data/america.json'];
        const responses = await Promise.all(
            continentFiles.map(file => fetch(file).then(res => res.ok ? res.json() : []))
        );
        
        let matches = [];
        responses.forEach(continentData => {
            continentData.forEach(countryObj => {
                const stateMatches = countryObj.states.filter(s => 
                    s.name.toUpperCase().includes(input) || s.code.toUpperCase().includes(input)
                );
                
                stateMatches.forEach(s => {
                    matches.push({ name: s.name, country: countryObj.country, flag: countryObj.flag });
                });
            });
        });

        if (matches.length > 0) {
            suggestions.innerHTML = matches.slice(0, 8).map(m => `
                <div class="suggestion-item" onclick="selectLocation('${m.name}')">
                    <span>${m.name.toUpperCase()} <small style="color:var(--dim)">/ ${m.country.toUpperCase()}</small></span>
                    <span class="flag">${m.flag}</span>
                </div>
            `).join('');
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    } catch (error) {
        console.error("Global Data Node Failure:", error);
    }
}

function selectLocation(name) {
    document.getElementById('cityInput').value = name;
    document.getElementById('citySuggestions').style.display = 'none';
    getWeather();
}

/** 
 * PROTOKOL CUACA (WEATHER PROTOCOL)
 */
function handleCityKey(e) { if (e.key === 'Enter') getWeather(); }

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;

    const display = document.getElementById('weatherDisplay');
    const btn = document.querySelector('.city-protocol button');
    
    btn.innerText = "...";
    btn.disabled = true;

    try {
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        if (!response.ok) throw new Error('Network failure');
        const weatherData = await response.json();
        
        const cityName = weatherData.nearest_area[0].areaName[0].value;
        const tempC = weatherData.current_condition[0].temp_C;
        const condition = weatherData.current_condition[0].weatherDesc[0].value;
        const rawTime = weatherData.current_condition[0].localObsDateTime; 

        display.style.opacity = "0";
        display.style.display = 'flex';
        setTimeout(() => {
            display.style.transition = "opacity 0.6s ease";
            display.style.opacity = "1";
        }, 50);

        document.getElementById('cityName').innerText = cityName.toUpperCase();
        document.getElementById('temp').innerText = `${tempC}°C`;
        document.getElementById('wDesc').innerText = condition.toUpperCase();

        const timeMatch = rawTime.match(/(\d{1,2}):(\d{2})\s+(AM|PM)/);
        if (timeMatch) {
            document.getElementById('localTime').innerText = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]} ${timeMatch[3]}`;
        }

        btn.innerText = "FETCH";
        btn.disabled = false;
    } catch (error) {
        btn.innerText = "RETRY";
        btn.disabled = false;
        document.getElementById('wDesc').innerText = "LOCATION_NOT_FOUND";
    }
}

/** 
 * HUD & INTERFACE LISTENER
 */
setInterval(() => {
    const t = new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.innerText = `SYNC_ACTIVE // ${t} // 85°C`;
}, 1000);

document.addEventListener('click', (e) => {
    const sug = document.getElementById('citySuggestions');
    if (sug && !e.target.closest('.city-protocol')) sug.style.display = 'none';
});

document.getElementById('cityInput').addEventListener('input', searchLocation);
