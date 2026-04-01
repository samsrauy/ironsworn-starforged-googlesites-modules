/**
 * @param {string} game - 'starforged' or 'ironsworn'
 * @param {string} category - e.g., 'oracles/core.json'
 */
async function fetchDatasworn(game, category) {
    const url = `https://raw.githubusercontent.com/rsek/datasworn/main/${game}/${category}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${game} ${category}`);
        return await response.json();
    } catch (err) {
        console.error("Datasworn Fetch Error:", err);
        return null;
    }
}
