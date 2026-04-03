/**
 * js/sync.js - THE ARCHITECT BOOTSTRAPPER
 */
const params = new URLSearchParams(window.location.search);
const charId = params.get('id');
const sheetID = params.get('sheet'); // The Google Sheet ID (from the URL)

let GAS_URL = ""; // This will be populated dynamically

/**
 * Stage 1: The Handshake
 * Reads Settings!B1 from the Spreadsheet ID provided in the URL
 */
async function bootstrap() {
    if (!sheetID) {
        console.error("CRITICAL: No 'sheet' (ID) provided in URL.");
        return;
    }

    try {
        // We use the Google Visualization API to read the sheet without an API Key
        const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&sheet=Settings&range=B1`;
        const response = await fetch(url);
        const text = await response.text();
        
        // Remove quotes from the CSV output to get the clean URL
        GAS_URL = text.replace(/"/g, "").trim();
        console.log("Neural Link Established via Bootstrap.");
    } catch (e) {
        console.error("Bootstrap Failure: Ensure Sheet is set to 'Anyone with link can view'", e);
    }
}

/**
 * Stage 2: Standard Operations
 */
async function saveStat(id, field, value) {
    if (!GAS_URL) await bootstrap();
    const url = `${GAS_URL}?id=${encodeURIComponent(id)}&field=${encodeURIComponent(field)}&val=${encodeURIComponent(value)}`;
    fetch(url, { mode: 'no-cors' });
    if (field === "history_entry" || field === "journal") sendToArchive(value);
}

async function loadStats(id) {
    if (!GAS_URL) await bootstrap();
    try {
        const response = await fetch(`${GAS_URL}?id=${id}`);
        return await response.json();
    } catch (e) { return null; }
}

async function sendToArchive(message) {
    if (!GAS_URL) return;
    const logUrl = `${GAS_URL}?action=log&id=${encodeURIComponent(charId)}&message=${encodeURIComponent(message)}`;
    fetch(logUrl, { mode: 'no-cors' });
}

// Roll logic remains the same, calling saveStat
async function triggerNeuralRoll(moveName, stat = 0, adds = 0) {
    const d6 = Math.floor(Math.random() * 6) + 1;
    const c1 = Math.floor(Math.random() * 10) + 1;
    const c2 = Math.floor(Math.random() * 10) + 1;
    const score = Math.min(10, d6 + stat + adds);
    let res = (score > c1 && score > c2) ? "STRONG HIT" : (score > c1 || score > c2) ? "WEAK HIT" : "MISS";
    if (c1 === c2) res += " (MATCH!)";
    const logEntry = `ROLL: ${moveName} | Result: ${res} ([${d6}]+${stat} vs ${c1},${c2})`;
    saveStat(charId, "history_entry", logEntry);
    return { result: res, details: `[${d6}] + ${stat} vs [${c1}, ${c2}]` };
}

// Start the handshake immediately
bootstrap();
