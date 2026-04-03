/**
 * js/sync.js - THE CORE ENGINE
 * Full API restored with async awareness for Datasworn.
 */
const params = new URLSearchParams(window.location.search);
const sheetId = params.get('sheet');
const charId = params.get('id');
const GAS_URL = "https://script.google.com/macros/s/AKfycbwN24ooemboCTKWLdL4KxDyb7pyh4JCZgkfTglICcHVfq6FQVE7Cp6JcOF5KSZ_Maj2Kw/exec"; 

// --- CORE UTILITIES ---

// THE DICE ENGINE: Action Roll (1d6 + stat + adds vs 2d10)
function rollDice(statValue = 0, adds = 0) {
    const actionDie = Math.floor(Math.random() * 6) + 1;
    const challenge1 = Math.floor(Math.random() * 10) + 1;
    const challenge2 = Math.floor(Math.random() * 10) + 1;
    
    const actionScore = Math.min(10, actionDie + statValue + adds);
    
    let result = "MISS";
    if (actionScore > challenge1 && actionScore > challenge2) result = "STRONG HIT";
    else if (actionScore > challenge1 || actionScore > challenge2) result = "WEAK HIT";
    
    const isMatch = (challenge1 === challenge2);
    
    return {
        result: result + (isMatch ? " (MATCH!)" : ""),
        score: actionScore,
        details: `[${actionDie}] + ${statValue}${adds ? ' + '+adds : ''} vs [${challenge1}, ${challenge2}]`
    };
}

// PROGRESS ROLL: 2d10 vs Progress Score
function rollProgress(progressScore) {
    const challenge1 = Math.floor(Math.random() * 10) + 1;
    const challenge2 = Math.floor(Math.random() * 10) + 1;
    
    let result = "MISS";
    if (progressScore > challenge1 && progressScore > challenge2) result = "STRONG HIT";
    else if (progressScore > challenge1 || progressScore > challenge2) result = "WEAK HIT";
    
    const isMatch = (challenge1 === challenge2);
    
    return {
        result: result + (isMatch ? " (MATCH!)" : ""),
        score: progressScore,
        details: `${progressScore} vs [${challenge1}, ${challenge2}]`
    };
}

// --- DATA UPLINK (GOOGLE SHEETS) ---

async function saveStat(id, key, value) {
    try {
        await fetch(`${GAS_URL}?id=${id}&key=${key}&value=${encodeURIComponent(value)}`, { method: 'POST' });
    } catch (e) { console.error("Sync Error: Uplink Severed:", e); }
}

async function loadStats(id) {
    try {
        const response = await fetch(`${GAS_URL}?id=${id}`);
        return await response.json();
    } catch (e) { return null; }
}

// --- NEURAL INTERFACE (MOVE LOGGING) ---

// Refactored: Now waits for Datasworn to ensure any move-lookups don't crash the system
async function triggerNeuralRoll(moveName, statValue = 0, adds = 0) {
    // Ensure the data core is online before proceeding
    if (window.dataswornReady) {
        await window.dataswornReady;
    }

    const d6 = Math.floor(Math.random() * 6) + 1;
    const challenge1 = Math.floor(Math.random() * 10) + 1;
    const challenge2 = Math.floor(Math.random() * 10) + 1;
    
    const actionScore = Math.min(10, d6 + statValue + adds);
    let result = "MISS";
    if (actionScore > challenge1 && actionScore > challenge2) result = "STRONG HIT";
    else if (actionScore > challenge1 || actionScore > challenge2) result = "WEAK HIT";

    const isMatch = (challenge1 === challenge2);
    const finalResult = result + (isMatch ? " (MATCH!)" : "");
    const details = `[${d6}] + ${statValue}${adds ? ' + '+adds : ''} vs [${challenge1}, ${challenge2}]`;
    
    const logEntry = `ROLL: ${moveName} | Result: ${finalResult} (${details})`;
    
    console.log(`Sync: Logging ${logEntry}`);
    
    // Asynchronous background save
    saveStat(charId, "history_entry", logEntry);

    return {
        result: finalResult,
        details: details,
        score: actionScore
    };
}
