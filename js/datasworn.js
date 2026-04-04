/**
 * VOID-LINK // DATASWORN CORE MODULE
 * Fetches and exposes Starforged data globally for all UI modules.
 */

window.datasworn = null;

const DATASWORN_CONFIG = {
    // Default to Starforged, but built to scale for Ironsworn/Sundered Isles later
    GAME_TYPE: 'starforged',
    
    // Points directly to the compiled master JSON in the Datasworn repository
    get URL() {
        return `https://raw.githubusercontent.com/rsek/datasworn/main/datasworn/${this.GAME_TYPE}/${this.GAME_TYPE}.json`;
    },

    init: async function() {
        console.log(`Datasworn: Initializing Neural Link to ${this.GAME_TYPE.toUpperCase()} Core...`);
        try {
            const response = await fetch(this.URL);
            if (!response.ok) {
                throw new Error(`Data Core Fetch Failed: HTTP ${response.status}`);
            }
            
            const data = await response.json();
            window.datasworn = data;
            
            console.log(`Datasworn: ${this.GAME_TYPE.toUpperCase()} Data Core Online.`);
            return data;
            
        } catch (err) {
            console.error("Datasworn: Critical Link Failure ->", err);
            document.body.insertAdjacentHTML('afterbegin', 
                `<div style="background:#ff0055; color:#fff; text-align:center; padding:5px; font-family:monospace; font-size:12px; z-index:9999; position:relative;">
                    CRITICAL ERROR: DATASWORN CORE UNREACHABLE. CHECK NETWORK CONNECTION.
                </div>`
            );
            throw err;
        }
    }
};

// AUTO-BOOT: Fire the fetch immediately and store the Promise globally.
// This allows modules (like the compendium or asset browser) to simply `await window.dataswornReady`
window.dataswornReady = DATASWORN_CONFIG.init();
