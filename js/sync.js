/**
 * js/sync.js - DECENTRALIZED SAAS ADAPTER
 */
const params = new URLSearchParams(window.location.search);
// Grabs the ID from the host environment, fallback to URL params if testing locally
const charId = window.charId || params.get('id') || "Unknown_Pilot";

function saveStat(id, field, value) {
    google.script.run
        .withFailureHandler(err => console.error("Neural Link Save Failure:", err))
        .saveStatServer(id, field, value);

    if (field === "history_entry" || field === "journal") {
        sendToArchive(value);
    }
}

async function loadStats(id) {
    return new Promise((resolve) => {
        google.script.run
            .withSuccessHandler(data => resolve(JSON.parse(data)))
            .withFailureHandler(err => {
                console.warn("Initializing New Character Template...");
                resolve({ id: id });
            })
            .loadStatsServer(id);
    });
}

function sendToArchive(message) {
    google.script.run.logServer(charId, message);
}

async function triggerNeuralRoll(moveName, stat = 0, adds = 0) {
    const d6 = Math.floor(Math.random() * 6) + 1;
    const c1 = Math.floor(Math.random() * 10) + 1;
    const c2 = Math.floor(Math.random() * 10) + 1;
    const score = Math.min(10, d6 + stat + adds);
    
    let res = (score > c1 && score > c2) ? "STRONG HIT" : (score > c1 || score > c2) ? "WEAK HIT" : "MISS";
    if (c1 === c2) res += " (MATCH)";
    
    const details = `[D6: ${d6}] vs [C1: ${c1}, C2: ${c2}]`;
    
    // Log rolls to the archive automatically
    sendToArchive(`Rolled ${moveName}: ${res} ${details}`);
    
    return { result: res, details: details, score: score };
}
