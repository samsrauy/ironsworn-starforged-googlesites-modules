/** * PROJECT: Starforged/Ironsworn Datasworn Utility & Data Loader
 * This file handles the fetching and global exposure of Starforged data.
 */

let datasworn = null; 

const DATASWORN_CONFIG = {
    GAME_TYPE: 'starforged',
    
    get URL() {
        return `https://raw.githubusercontent.com/rsek/datasworn/master/datasworn/starforged/starforged.json`;
    },

    // A promise that other scripts can await
    ready: null,

    getResult: function(table, roll) {
        if (!table || !table.rows) return null;
        return table.rows.find(row => roll >= row.floor && roll <= row.ceiling);
    },

    init: async function() {
        console.log("Datasworn: Initializing Neural Link to GitHub...");
        try {
            const response = await fetch(this.URL);
            if (!response.ok) throw new Error(`Fetch Failed: ${response.status}`);
            
            datasworn = await response.json();
            window.datasworn = datasworn;
            
            console.log("Datasworn: Starforged Data Core Online.");
            return datasworn;
        } catch (err) {
            console.error("Datasworn: Critical Link Failure ->", err);
            throw err;
        }
    }
};

// AUTO-BOOT: Store the initialization promise globally
window.dataswornReady = DATASWORN_CONFIG.init();

async function fetchDatasworn(game) {
    if (game) DATASWORN_CONFIG.GAME_TYPE = game;
    return await window.dataswornReady;
}

function getOracleResult(table, roll) {
    return DATASWORN_CONFIG.getResult(table, roll);
}
