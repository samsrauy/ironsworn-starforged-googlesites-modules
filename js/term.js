/**
 * js/term.js - MASTER TERMINAL LOGIC
 */
const terminalCharId = window.charId || new URLSearchParams(window.location.search).get('id');

function bootTerminal() {
    if (!terminalCharId) {
        console.error("Critical Failure: No Character ID found.");
        document.body.innerHTML = "<div style='color:red; padding:20px;'>FATAL ERROR: CHARACTER ID MISSING. ACCESS DENIED.</div>";
        return;
    }

    document.getElementById('char-display').innerText = `ID: ${terminalCharId.toUpperCase()}`;

    // Inject URLs into Iframes with the ID parameter to maintain the sync session
    const query = `?id=${encodeURIComponent(terminalCharId)}`;
    
    document.getElementById('frame-char').src = `modules/character-sheet/character-sheet.html${query}`;
    document.getElementById('frame-map').src = `modules/map/map.html${query}`;
    document.getElementById('frame-journal').src = `modules/journal/journal.html${query}`;
    document.getElementById('frame-assets').src = `modules/asset-browser/asset-browser.html${query}`;
}

function toggleAssets() {
    document.getElementById('asset-drawer').classList.toggle('open');
}
