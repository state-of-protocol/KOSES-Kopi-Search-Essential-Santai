/** * NAVIGATION & ENGINE LOGIC
 */
export let currentEngine = 'AI';

export function setEngine(mode) {
    currentEngine = mode;
    const aiBtn = document.getElementById('aiMode');
    const webBtn = document.getElementById('webMode');
    const searchBox = document.getElementById('mainSearchBox');
    const prefix = document.getElementById('enginePrefix');
    const input = document.getElementById('searchInput');
    const auditLabel = document.getElementById('auditLabel');

    if(!aiBtn || !webBtn) return;

    aiBtn.classList.remove('active');
    webBtn.classList.remove('active');
    searchBox.classList.remove('ai-active', 'web-active');

    if (mode === 'AI') {
        aiBtn.classList.add('active');
        searchBox.classList.add('ai-active');
        prefix.innerText = "AI >";
        input.placeholder = "ASK NEURAL AI ANYTHING...";
        if(auditLabel) auditLabel.innerText = "NEURAL_AUDIT_REPORT";
    } else {
        webBtn.classList.add('active');
        searchBox.classList.add('web-active');
        prefix.innerText = "WEB >";
        input.placeholder = "SEARCH THE BIG FOUR INDEX...";
        if(auditLabel) auditLabel.innerText = "CRAWLER_AUDIT_REPORT";
    }
}
