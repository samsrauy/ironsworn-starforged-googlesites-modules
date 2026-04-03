/**
 * js/term.js - MASTER TERMINAL LOGIC
 */
const terminalCharId = window.charId || new URLSearchParams(window.location.search).get('id');

function bootTerminal() {
    if (!terminalCharId) {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('terminal-grid').style.display = 'none';
        return;
    }

    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('terminal-grid').style.display = 'grid';
    document.getElementById('char-display').innerText = `ID: ${terminalCharId.toUpperCase()}`;

    const query = `?id=${encodeURIComponent(terminalCharId)}`;
    document.getElementById('frame-char').src = `modules/character-sheet/character-sheet.html${query}`;
    document.getElementById('frame-map').src = `modules/map/map.html${query}`;
    document.getElementById('frame-journal').src = `modules/journal/journal.html${query}`;
    document.getElementById('frame-assets').src = `modules/asset-browser/asset-browser.html${query}`;
}

function establishLink() {
    const name = document.getElementById('char-name-input').value.trim();
    if (name) {
        const baseUrl = window.location.href.split('?')[0];
        window.location.href = `${baseUrl}?id=${encodeURIComponent(name)}`;
    } else {
        alert("Please enter a callsign to proceed.");
    }
}

function toggleAssets() {
    document.getElementById('asset-drawer').classList.toggle('open');
}
