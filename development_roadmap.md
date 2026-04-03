# 🗺️ Starforged Void-Link Terminal: Development Roadmap

## 🚀 The Vision: Decentralized SaaS Architecture
This project utilizes a highly unique "Hybrid SaaS" (Software as a Service) deployment model. 

Rather than forcing users (Game Masters) to fork, clone, or manually host the UI files, this repository acts as the **Central Frontend CDN**. 
* **The Backend:** Users act as their own private database. They host the authentication and data persistence locally via Google Apps Script and Google Sheets.
* **The Frontend:** The user's Google Apps Script fetches the HTML, CSS, and JS (the blueprints) live from this GitHub repository and injects them into the authenticated Google environment.

This roadmap details how we will manage updates to the Central Core without breaking live campaigns for our users.

---

## 📍 Phase 1: Active Beta (The "Live-Wire" SaaS)
**Current Status:** IN PROGRESS

During the Beta phase, the architecture is designed for rapid iteration, bug fixing, and feature deployment. 

**How it works:**
The deployment shell (`Index.html`) that users copy to their Google Apps Script is hardcoded to pull files directly from the live `main` branch of this repository:
```javascript
const GITHUB_BASE_URL = "[https://samsrauy.github.io/YOUR_REPO_NAME](https://samsrauy.github.io/YOUR_REPO_NAME)";
