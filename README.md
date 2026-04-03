# Starforged Void-Link Terminal

A synchronized, multiplayer-ready character and campaign manager for Ironsworn: Starforged. 

This project utilizes a **Hybrid CDN Architecture** to bypass CORS restrictions, provide secure Google Account authentication, and seamlessly sync data directly to a Google Sheet and Google Doc.

## 🏗️ Architecture

To achieve a verified multiplayer environment without browser security blocking cross-origin requests, this app splits hosting duties:

1. **Google Apps Script (The Bouncer & Database):** Google acts as the secure host. When players visit the Google Web App URL, they are forced to log in via their Google Account. The Apps Script then serves a lightweight shell (`Index.html`).
2. **GitHub Pages (The Blueprints):** The shell running on Google uses `fetch()` to dynamically inject the HTML, CSS, and JS (like Datasworn) directly from this GitHub repository. 
3. **`google.script.run` (The Data Core):** Because the front-end runs natively inside Google's authenticated environment, `sync.js` utilizes Google's native API (`google.script.run`) to read and write to the Google Sheet with zero CORS errors, actively tracking which player made which roll.

## 🚀 Setup Instructions

### Part 1: GitHub Configuration
1. Fork or clone this repository.
2. Ensure GitHub Pages is enabled for your repository (Settings > Pages).
3. Take note of your GitHub Pages URL (e.g., `https://username.github.io/repo/`).

### Part 2: Database Configuration (Google Drive)
1. Create a new **Google Sheet**. Name the first tab `Settings` and the second tab `Stat`. 
2. Create a new **Google Doc** (this will be the campaign log).
3. On the `Settings` tab of the Sheet, paste the Document ID of your Google Doc into cell **B3**. *(The ID is the long string of letters/numbers in the Doc's URL).*

### Part 3: The Google Apps Script Server
1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Replace `Code.gs` with the backend code provided in the repository.
3. Click the `+` next to Files, select **HTML**, and name it exactly `Index`.
4. Paste the HTML shell code. **Crucial:** Update `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` inside `Index.html` to point to your live GitHub Pages site.
5. Click **Deploy > New Deployment**.
   * Type: **Web App**
   * Execute as: **Me**
   * Who has access: **Anyone with a Google Account**
6. Copy the resulting **Web App URL**. 

### Part 4: Connecting the Terminals
The Web App URL you just copied is your new master game link. Do not share the GitHub link with your players.

To log in as a specific character, simply append `?id=CharacterName` to the end of the Google Web App URL. 
*Example:* `https://script.google.com/macros/s/xyz/exec?id=Fallon`

## 📁 File Structure
* `/css`: Stylesheets injected into the Google shell.
* `/js/sync.js`: The neural link adapter using `google.script.run`.
* `/js/datasworn.js`: External data ruleset.
* `/modules`: Specific character sheet, map, and journal UI components.

> [!Note]
> To access the game you can click here after setting up your Google Sheets and Google Docs backend.  https://samsrauy.github.io/void-link/void-link-term.html 
