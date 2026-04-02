# ironsworn-starforged-googlesites-modules
Modules for custom Google Sites based Ironsworn/Starforged/etc.

## Embed on Google Sites as a URL
Use this generic format:
```https://samsrauy.github.io/ironsworn-starforged-googlesites-modules/modules/[MODULE_FOLDER]/index.html?game=starforged&id=[CHARACTER_NAME]&api=[YOUR_GAS_URL]```

### What each of these fields mean.
To make each module work, you need these three parameters at the end of every URL:

| Parameter | Purpose | Example Value |
| :--- | :--- | :--- |
| **`game`** | Sets the theme (CSS) and rules. | `starforged` or `ironsworn` |
| **`id`** | Your Character Name (no spaces). | `Valerius` |
| **`api`** | The "Web App" URL from Google Apps Script. | `https://script.google.com/macros/s/AKfycb.../exec` |

---

**Quick Tip for URL Construction:**
When you combine these, ensure the first parameter starts with a **`?`** and all subsequent parameters are separated by an **`&`**.

**Example:**
`.../index.html?game=starforged&id=Valerius&api=https://...`
