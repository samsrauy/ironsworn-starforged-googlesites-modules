/**
 * Code.gs - STARFORGED VOID-LINK (GM DATABASE BACKEND)
 * * INSTRUCTIONS FOR GAME MASTERS:
 * 1. Paste this entirely into your Google Apps Script editor (replacing any default code).
 * 2. Create a new HTML file named 'Index' and paste the Index.html code into it.
 * 3. Deploy as a Web App (Execute as: Me, Who has access: Anyone with a Google Account).
 *
 */

// ==============================================================================
// 1. WEB SERVER ROUTE
// This is what actually paints the Index.html file to your screen.
// ==============================================================================
function doGet(e) {
  const html = HtmlService.createTemplateFromFile('Index');
  
  // Pass the URL ID parameter to the HTML template (if one exists)
  html.charId = e.parameter.id || '';
  
  // THIS IS THE LINE YOU WERE MISSING
  return html.evaluate() 
    .setTitle('Starforged Void-Link Terminal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ==============================================================================
// 2. DATABASE BACKEND (Called natively by sync.js via google.script.run)
// ==============================================================================

function saveStatServer(id, field, val) {
  if (!id || !field) return "Missing Data";
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stats = ss.getSheetByName("Stat");
  let data = stats.getDataRange().getValues();
  let headers = data[0];
  let colIdx = headers.indexOf(field);

  // If header doesn't exist, create it
  if (colIdx === -1) {
    colIdx = headers.length;
    stats.getRange(1, colIdx + 1).setValue(field);
    data = stats.getDataRange().getValues(); // Refresh
  }

  // Find character row
  let rowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === id.toLowerCase()) { 
      rowIdx = i + 1; 
      break; 
    }
  }

  // Update or append
  if (rowIdx !== -1) {
    stats.getRange(rowIdx, colIdx + 1).setValue(val);
  } else {
    let newRow = new Array(headers.length).fill("");
    newRow[0] = id;
    newRow[colIdx] = val;
    stats.appendRow(newRow);
  }
  return "SUCCESS";
}

function loadStatsServer(id) {
  if (!id) return JSON.stringify({});
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stats = ss.getSheetByName("Stat");
  const data = stats.getDataRange().getValues();
  const headers = data[0];
  let obj = {};
  let found = false;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === id.toLowerCase()) {
      headers.forEach((h, idx) => obj[h] = data[i][idx]);
      found = true;
      break;
    }
  }

  if (!found) {
    headers.forEach(h => obj[h] = "");
    obj[headers[0]] = id; 
  }
  return JSON.stringify(obj);
}

function logServer(id, message) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const settings = ss.getSheetByName("Settings");
    const docId = settings.getRange("B3").getValue();
    
    if (!docId) return "No Document ID found in Settings:B3";
    
    const doc = DocumentApp.openById(docId);
    const body = doc.getBody();
    const entry = `[${new Date().toLocaleString()}] ${(id || "UNK").toUpperCase()}: ${message}`;
    body.appendParagraph(entry).setFontFamily("Courier New").setFontSize(9);
    return "OK";
  } catch(err) { 
    return "ERROR: " + err.toString(); 
  }
}
