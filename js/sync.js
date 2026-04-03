/**
 * js/sync.js - THE CORE ENGINE
 */
const params = new URLSearchParams(window.location.search);
const sheetId = params.get('sheet');
const charId = params.get('id');
const GAS_URL = "YOUR_DEPLOYED_WEB_APP_URL_HERE"; 

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
        details: `[${actionDie}] + ${statValue}${adds ? ' + '+adds : ''} vs [${challenge1}, ${challenge2}]`,
        isMatch: isMatch
    };
}

// THE PROGRESS ROLL: (Progress Score vs 2d10)
function rollProgress(progressScore) {
    const challenge1 = Math.floor(Math.random() * 10) + 1;
    const challenge2 = Math.floor(Math.random() * 10) + 1;
    
    let result = "MISS";
    if (progressScore > challenge1 && progressScore > challenge2) result = "STRONG HIT";
    else if (progressScore > challenge1 || progressScore > challenge2) result = "WEAK HIT";
    
    return {
        result: result + (challenge1 === challenge2 ? " (MATCH!)" : ""),
        details: `Progress [${progressScore}] vs [${challenge1}, ${challenge2}]`
    };
}

// PERSISTENCE LAYER
async function saveStat(id, stat, value) {
    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ id, stat, value })
        });
        console.log(`Uplink: ${stat} synchronized.`);
    } catch (e) { console.error("Link Severed:", e); }
}

async function loadStats(id) {
    try {
        const response = await fetch(`${GAS_URL}?id=${id}`);
        return await response.json();
    } catch (e) { return null; }
}
