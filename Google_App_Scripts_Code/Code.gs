/**
 * Code.gs - STARFORGED VOID-LINK (GM DATABASE BACKEND)
 * Deployment: Execute as "Me", Access: "Anyone"
 */

function doGet(e) {
  const html = HtmlService.createTemplateFromFile('Index');
  
  // Extract ID from URL parameter
  html.charId = e.parameter.id || '';
  
  return html.evaluate() 
    .setTitle('VOID-LINK // TERMINAL')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * CORE DB INTERFACE: Save/Create Pilot Data
 */
function saveStatServer(id, field, val) {
  if (!id || !field) return "ERROR: MISSING PARAMS";
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stats = ss.getSheetByName("Stat");
  const data = stats.getDataRange().getValues();
  const headers = data[0];
  
  let colIdx = headers.indexOf(field);
  if (colIdx === -1) return "ERROR: INVALID FIELD";

  let rowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === id.toLowerCase()) {
      rowIdx = i + 1;
      break; 
    }
  }

  // UPDATE EXISTING OR CREATE NEW PILOT
  if (rowIdx !== -1) {
    stats.getRange(rowIdx, colIdx + 1).setValue(val);
  } else {
    // New Pilot creation logic
    let newRow = new Array(headers.length).fill("");
    newRow[0] = id; 
    newRow[colIdx] = val;
    stats.appendRow(newRow);
  }
  return "SUCCESS";
}

/**
 * CORE DB INTERFACE: Load Pilot Data
 */
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

  // If pilot doesn't exist yet, return a template with their ID
  if (!found) {
    headers.forEach(h => obj[h] = "");
    obj[headers[0]] = id; 
  }
  
  return JSON.stringify(obj);
}

/**
 * ARCHIVE INTERFACE: Write to Google Doc / History
 */
function logServer(id, message) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const settings = ss.getSheetByName("Settings");
    const docId = settings.getRange("B3").getValue();
    
    if (docId) {
      const doc = DocumentApp.openById(docId);
      const body = doc.getBody();
      const timestamp = new Date().toLocaleString();
      body.appendParagraph(`[${timestamp}] PILOT ${id}: ${message}`).setItalic(true);
    }
    return "LOGGED";
  } catch (e) {
    return "LOG ERROR: " + e.message;
  }
}
