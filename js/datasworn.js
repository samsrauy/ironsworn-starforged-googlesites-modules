/** * PROJECT: Starforged/Ironsworn Datasworn Utility
 * This file acts as a global "header" for all modules.
 * Centralizing this prevents logic drift across different HTML files.
 */

const DATASWORN_CONFIG = {
    // Current primary data source. 
    // You can change this to 'ironsworn' or 'sundered_isles' in the future.
    GAME_TYPE: 'starforged',
    
    // Official RAW Github link for the latest Starforged schema
    get URL() {
        return `https://raw.githubusercontent.com/rsek/datasworn/master/datasworn/${this.GAME_TYPE}/${this.GAME_TYPE}.json`;
    },

    /**
     * Finds the correct row in a Datasworn table based on a 1-100 roll.
     * Starforged uses 'floor' and 'ceiling' for its ranges.
     */
    getResult: function(table, roll) {
        if (!table || !table.rows) {
            console.error("Datasworn Error: Invalid table provided to getResult.");
            return null;
        }
        // Corrected: Uses 'ceiling' to match the official Datasworn schema
        return table.rows.find(row => roll >= row.floor && roll <= row.ceiling);
    },

    /**
     * Standardized fetcher used by modules like Compendium and Asset Browser.
     */
    fetchData: async function() {
        try {
            const response = await fetch(this.URL);
            if (!response.ok) throw new Error(`Link Offline: ${response.status}`);
            const data = await response.json();
            console.log(`Datasworn: ${this.GAME_TYPE} data loaded successfully.`);
            return data;
        } catch (err) {
            console.error("Datasworn Critical Fetch Error:", err);
            return null;
        }
    }
};

/**
 * Legacy Support Wrapper
 * Included to maintain compatibility with modules using the old function names.
 */
async function fetchDatasworn(game) {
    DATASWORN_CONFIG.GAME_TYPE = game;
    return await DATASWORN_CONFIG.fetchData();
}

function getOracleResult(table, roll) {
    return DATASWORN_CONFIG.getResult(table, roll);
}
