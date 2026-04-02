/**
 * PROJECT: Starforged Void-Link Sync (Client Side)
 * This file handles the communication between the UI and Google Sheets.
 */

const syncParams = new URLSearchParams(window.location.search);
let GAS_URL = syncParams.get('api');
const charId = syncParams.get('id') || 'Evangeline';
const sheetId = syncParams.get('sheet');

/**
 * AUTO-DISCOVERY BOOTLOADER
 * If no API URL is provided in the address bar, this function attempts 
 * to find it in the 'Settings' tab of the linked Google Sheet.
 */
async function initSync() {
    if (!GAS_URL && sheetId) {
        console.log("Neural Link: Attempting Auto-Discovery via Spreadsheet ID...");
        // Fetches the Settings tab as a CSV for easy parsing without an API key
        const discoveryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Settings`;
        
        try {
            const res = await fetch(discoveryUrl);
            const csv = await res.text();
            
            // Look for the row containing 'api_url'
            const rows = csv.split('\n');
            const apiRow = rows.find(r => r.toLowerCase().includes('api_url'));
            
            if (apiRow) {
                // Extract the URL from the second column (B1)
                GAS_URL = apiRow.split(',')[1].replace(/"/g, '').trim();
                console.log("Neural Link: API Endpoint Synchronized.");
            } else {
                console.warn("Discovery Error: 'api_url' not found in Settings tab.");
            }
        } catch (e) {
            console.error("Discovery Error: Neural link remains dark.", e);
        }
    }
}

/**
 * Sends a single stat update to the Google Sheet.
 * We let the server (Code.gs) handle complex logic like history 
 * merging to prevent race conditions.
 */
async function saveStat(id, statName, value) {
    if (!GAS_URL) {
        console.error("Sync Error: No API endpoint defined.");
        return;
    }

    try {
        await fetch(GAS_URL, {
            method: "POST",
            mode: "no-cors", // Required for Google Apps Script Web Apps
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id: id, 
                stat: statName, 
                value: value 
            })
        });
        console.log(`Uplink: ${statName} updated.`);
    } catch (e) {
        console.error("Sync Write Error:", e);
    }
}

/**
 * Retrieves the full character object from the Google Sheet.
 */
async function loadStats(id) {
    if (!GAS_URL) return null;

    try {
        const cacheBuster = new Date().getTime();
        const finalUrl = `${GAS_URL}?id=${id}&t=${cacheBuster}`;

        const response = await fetch(finalUrl, {
            method: "GET",
            redirect: "follow"
        });

        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Sync Read Error:", error);
        return null;
    }
}

/**
 * Heartbeat Engine
 * Periodically refreshes data to keep the UI in sync with the Sheet.
 */
function startHeartbeat(callback, interval = 30000) {
    if (typeof callback !== 'function') return;

    // Initial load
    callback();

    // Set interval for subsequent refreshes
    return setInterval(() => {
        console.log("Neural Link: Heartbeat pulse...");
        callback();
    }, interval);
}

// Initialize the link on script load
initSync();
