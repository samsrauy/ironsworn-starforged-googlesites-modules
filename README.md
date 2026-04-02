# Readme

## Void-Link, because it's really a better name then what I called the repo. (Sorry about that)
Current Version: 2.0 (Self-Discovering Architecture)
Using the instructions, it basically uses my repo and [rsek's datasworn](https://github.com/rsek/datasworn) repo as a static game ready Virtual TTRPG engine for [Shawn Tomkin's amazing series of games.](https://tomkinpress.com/)

Todo: Probably change the name of the repo and all of the hard coded stuff in the code that refers to the repo.

### System Overview
Void-Link is a modular TTRPG interface. It decouples data (Datasworn), storage (Google Sheets), and logic (Google Apps Script) to create a persistent, platform-agnostic gaming terminal.

**Quick note about access and permissions:**
To ensure the Navigation Console can reach the Sector Database (Google Sheets), apply these settings:

- Spreadsheet: Set sharing to "Anyone with the link" as Viewer. This allows the UI to discover your API endpoint.

- Script Deployment: When deploying the Web App, set "Execute as" to Me and "Who has access" to Anyone.
  - If you ever change the API URL in your Settings tab, make sure there are no spaces or quote marks around it. It should be the raw ```https://script.google.com/.../exec``` link.

- *Privacy Note: Using "Anyone" does not make your sheet searchable on Google; it simply means the "Void-Link" interface can talk to the database.*

### 🧩 The Component Stack

**The Anchor (Google Sheet):** 
The Google Sheet is the brain of the whole system. For the Auto-Discovery and Sync systems to work without requiring every player to log into a Google Account, you need a specific, two-part permission setup.

Since your script uses ```no-cors``` and the "Discovery" logic fetches the ```Settings``` tab as a CSV, the Google Sheet must have the following permissions:

- The Sheet to be accessible by the app without a private handshake.
  - Click the Share button (top right).
  - Under "General access," change "Restricted" to "Anyone with the link".
  - Set the role to "Viewer".

**Why Viewer?**
The "Web App" (the code in Code.gs) runs as "Me" (you). Since you own the sheet, the script has full edit rights. The "Viewer" permission for the public just allows the sync.js "Discovery" logic to read the api_url from your Settings tab.

The Google Sheet itself needs 
- Stats Tab: Rows of character data

 <img width="258.6" height="359.4" alt="image" src="https://github.com/user-attachments/assets/f286f2d4-d2af-4129-8c00-e95cc8d6881c" />

- Settings Tab: Contains api_url (B1) and game_type (B2)

  <img width="370.8" height="359.4" alt="image" src="https://github.com/user-attachments/assets/3bea6f7b-77de-48e7-908a-01767aacaec9" />


**The Brain (Code.gs): A GAS Web App.**

- GET: Returns JSON of character stats or Gemini Oracle text.

- POST: Updates stats. Appends history_entry to the history JSON array server-side.

**The Header (datasworn.js):**
Global config. Defines the Starforged/Ironsworn JSON source and shared range-finding logic (row.floor to row.ceiling).

**The Nervous System (sync.js):**

- Auto-Discovery: If no api param is found, it fetches the Settings tab from the sheet ID to find the Web App URL.

- Uplink: Provides saveStat() and loadStats().

## Recovery Procedure
The key to this system is the Code.gs, which generates an API Web App URL and your character name. Because the Google Sheet will always be human readable (and editable) you have a cloudbased game save as a decentralized-ish Virtual Table Top for the Shawn Tomkin series of TTRPGs.

Step 1: Open your Google Sheet.

Step 2: Ensure the Settings tab has your latest Web App URL in Cell B1.

Step 3: Ensure your Google Site embed link includes ?sheet=YOUR_SPREADSHEET_ID.

This makes the "human" side of the tech support almost non-existent! Ready to apply the Auto-Discovery code to your sync.js now, or shall we look at the next module?
