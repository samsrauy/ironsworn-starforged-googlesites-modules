/**
 * VOID-LINK // SYNC MANAGER
 * Communicates with the Game Master's Google Apps Script API.
 */

window.gLink = {
    // Helper to get the server URL from local browser storage
    getServerUrl: function() {
        const url = localStorage.getItem('voidLinkServer');
        if (!url) {
            console.error("SYNC FATAL: No GM Server URL found. Please log out and provide a valid Web App URL.");
            return null;
        }
        return url;
    },

    // Standardized network request function
    sendRequest: async function(payload) {
        const url = this.getServerUrl();
        if (!url) return null;

        try {
            const response = await fetch(url, {
                method: "POST",
                // Sending as text/plain bypasses the Google Apps Script CORS preflight issue
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload)
            });
            return await response.json();
        } catch (error) {
            console.error("SYNC NETWORK ERROR:", error);
            return null;
        }
    },

    saveStatServer: async function(id, field, val) {
        console.log(`Sync: Saving ${field} for ${id}...`);
        const result = await this.sendRequest({
            action: "saveStat",
            id: id,
            field: field,
            value: val
        });
        if (result && result.status === "SUCCESS") {
            console.log("Sync: Save successful.");
        } else {
            console.error("Sync: Save failed.", result);
        }
    },

    loadStatsServer: async function(id) {
        console.log(`Sync: Loading stats for ${id}...`);
        const result = await this.sendRequest({
            action: "loadStats",
            id: id
        });
        
        if (result && result.status === "success") {
            // Trigger your existing frontend function once data arrives (for backwards compatibility)
            if (typeof window.onStatsLoaded === "function") {
                window.onStatsLoaded(JSON.stringify(result.data));
            }
            return result.data; // <--- Returns data for modern modules using await
        } else {
            console.error("Sync: Load failed.", result);
            return null;
        }
    },

    logServer: async function(id, msg) {
        console.log(`Sync: Writing log for ${id}...`);
        const result = await this.sendRequest({
            action: "logEntry",
            id: id,
            message: msg
        });
        if (result && result.status === "OK") {
            console.log("Sync: Log written successfully.");
        } else {
            console.error("Sync: Log failed.", result);
        }
    }
};
