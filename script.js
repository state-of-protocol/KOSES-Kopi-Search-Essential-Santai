/**
 * KOPI-SEARCH-SANTAI CORE ENGINE
 */

// 1. Logik Tema (Dark/Light)
function toggleTheme() {
    const body = document.documentElement;
    const currentTheme = body.getAttribute('data-theme');
    const themeIcon = document.getElementById('themeIcon');

    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('kopi-theme', 'dark');
        themeIcon.innerText = "☕";
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('kopi-theme', 'light');
        themeIcon.innerText = "🍦";
    }
}

// Semak tema masa load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('kopi-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeIcon').innerText = "🍦";
    }
});

// 2. Logik Carian
function handleKey(e) {
    if (e.key === 'Enter') executeSearch();
}

function executeSearch() {
    const input = document.getElementById('searchInput').value.trim();
    const btn = document.getElementById('searchBtn');
    const results = document.getElementById('results');
    const output = document.getElementById('resultOutput');

    if (!input) return;

    // UI Feedback
    btn.innerText = "BREWING...";
    btn.disabled = true;
    
    // Reset visual metrics
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('velocityVal').innerText = '0';

    setTimeout(() => {
        results.style.display = 'grid';
        btn.innerText = "BREW CARIAN";
        btn.disabled = false;

        // Simulasi Data
        const randomVelocity = Math.floor(Math.random() * 40 + 60);
        const randomVolume = (Math.random() * 5 + 0.5).toFixed(2);

        document.getElementById('velocityVal').innerText = randomVelocity;
        document.getElementById('progressBar').style.width = randomVelocity + '%';
        document.getElementById('volumeVal').innerText = randomVolume;

        output.innerHTML = `
            <h3 style="color:var(--white); margin-bottom:10px;">HASIL: ${input.toUpperCase()}</h3>
            <p style="font-size:12px; color:var(--text);">Data berjaya diekstrak daripada node <span style="color:var(--accent)">WSE-SOVEREIGN</span>. 
            Sila semak integriti maklumat di bawah.</p>
            <div style="margin-top:15px; padding:10px; background:var(--hover-bg); border: 1px dashed var(--accent); font-size:11px;">
                STATUS: VALID_IDENT_DETECTED // BREW_ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
        `;

        // Scroll ke results
        window.scrollTo({
            top: results.offsetTop - 100,
            behavior: 'smooth'
        });

    }, 1200);
}

// Footer Sync Time Simulation
setInterval(() => {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                    now.getMinutes().toString().padStart(2, '0') + ":" + 
                    now.getSeconds().toString().padStart(2, '0');
    document.getElementById('sync-time').innerText = `LOCAL_NODE_SYNC: ${timeStr}`;
}, 1000);
