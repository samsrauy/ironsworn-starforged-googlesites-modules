const syncParams = new URLSearchParams(window.location.search);
const GAS_URL = syncParams.get('api');
const charId = syncParams.get('id') || 'global_user';

/**
 * Sends data to the Google Sheet (POST)
 */
async function saveStat(id, statName, value) {
    if (!GAS_URL) return;

    // Fix: If we are saving history, we must be careful not to overwrite 
    // simultaneous rolls. 
    if (statName === "history_entry") {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const entry = { time: timestamp, text: value };
        
        // We send the single entry to a special 'history_push' stat 
        // which your GAS Code.gs should handle by appending, 
        // OR we handle the merge here with a slight delay.
        const currentData = await loadStats(id);
        let history = [];
        try { 
            history = (typeof currentData.history === 'string') 
                ? JSON.parse(currentData.history) 
                : (currentData.history || []); 
        } catch(e) { history = []; }
        
        history.push(entry);
        if (history.length > 25) history.shift(); // Increased to 25 for better logging
        
        statName = "history";
        value = JSON.stringify(history);
    }

    try {
        // We use 'no-cors' for POST because GAS doesn't return proper CORS headers 
        // on successful execution, but 'no-cors' still sends the data!
        await fetch(GAS_URL, {
            method: "POST",
            mode: "no-cors", 
            cache: "no-cache",
            body: JSON.stringify({ id: id, stat: statName, value: value })
        });
    } catch (e) { console.error("Sync write error:", e); }
}

/**
 * Retrieves data from the Google Sheet (GET)
 */
async function loadStats(id) {
    if (!GAS_URL) return null;

    try {
        const t = new Date().getTime();
        const finalUrl = `${GAS_URL}?id=${id}&t=${t}`;

        const response = await fetch(finalUrl, {
            method: "GET",
            redirect: "follow"
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Sync read error:", error);
        return null;
    }
}

/**
 * Heartbeat Engine with randomized jitter
 */
function startHeartbeat(callback, interval = 35000) {
    if (typeof callback !== 'function') return;

    // Initial immediate load
    callback();

    const jitter = Math.floor(Math.random() * 5000);
    setTimeout(() => {
        setInterval(callback, interval);
        console.log(`Neural Link: Heartbeat active (+${jitter}ms jitter)`);
    }, jitter);
}
