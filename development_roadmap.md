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
> javascript
> const GITHUB_BASE_URL = "[https://samsrauy.github.io/YOUR_REPO_NAME](https://samsrauy.github.io/YOUR_REPO_NAME)";

### The Strategy:

Immediate Updates: When a bug is fixed or a feature is added to the main branch, every active campaign in the world gets the update the very next time they refresh their browser.

The "God Mode" Risk: If a broken commit is pushed to main, it breaks every user's game instantly.

Mitigation: All work MUST be done on the development branch. Code is only merged into main when it is tested and confirmed working. If a critical failure occurs on main, the merge commit will be immediately reverted.

## 🎯 Phase 2: Version 1.0 Release (The Versioned CDN)
**Current Status: PLANNED**

Once the core features are rock-solid, we will transition to an "Opt-In Versioning" model. This permanently removes the risk of a repository update breaking an active campaign mid-session.

**How it works:**
We will transition away from raw GitHub Pages URLs and utilize jsDelivr, a CDN that allows users to pull code from specific GitHub Releases/Tags.

The deployment shell provided to new users will be updated to lock them into a specific, stable version:

>JavaScript
>const GITHUB_BASE_URL = "[https://cdn.jsdelivr.net/gh/samsrauy/YOUR_REPO_NAME@v1.0](https://cdn.jsdelivr.net/gh/samsrauy/YOUR_REPO_NAME@v1.0)";

### The Strategy:

Crash-Proof Campaigns: If a user starts a campaign on @v1.0, their terminal will never change. Even if we release v2.0 on GitHub, their game remains perfectly preserved.

Opt-In Updates: To get new features, the Game Master simply opens their Google Apps Script, changes the @v1.0 tag to @v2.0 in their Index.html file, and refreshes the page.

Deprecation of "Live-Wire": The main branch will no longer be the direct feed for live games, acting purely as the staging ground for the next versioned release.

## 🛠️ Contributor Workflow (GitFlow)
If you are contributing to this project, please adhere to the following workflow to protect the Central Core:

** Branching:** 
Never push directly to main. Create a feature branch off of development (e.g., feature/dice-roller-fix).

Pull Requests: Submit PRs targeting the development branch.

Testing: The development branch will be tested using a private Google Apps Script deployment.

Merging: The repository maintainer will merge development into main.

During Phase 1: This immediately pushes the code to all live users.

During Phase 2: This updates the codebase in preparation for a newly tagged Release (e.g., creating the v1.1 tag).
