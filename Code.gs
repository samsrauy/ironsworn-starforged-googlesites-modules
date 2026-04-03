/**
 * Code.gs - STARFORGED VOID-LINK (GM DATABASE BACKEND)
 * * INSTRUCTIONS FOR GAME MASTERS:
 * 1. Paste this entirely into your Google Apps Script editor (replacing any default code).
 * 2. Create a new HTML file named 'Index' and paste the Index.html code into it.
 * 3. Deploy as a Web App (Execute as: Me, Who has access: Anyone with a Google Account).
 */

function doGet(e) {
  const html = HtmlService.createTemplateFromFile('Index');
  html.charId = e.parameter.id || '';
  
  return html.evaluate()
    .setTitle('Starforged Void-Link Terminal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function saveStatServer(id, field, val) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stats = ss.getSheetByName("Stat");
  
  let data = stats.getDataRange().getValues();
  let headers = data[0];
  let colIdx = headers.indexOf(field);

  if (colIdx === -1) {
    colIdx = headers.length;
    stats.getRange(1, colIdx + 1).setValue(field);
    data = stats.getDataRange().getValues();
  }

  let rowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === id.toLowerCase()) { 
      rowIdx = i + 1; 
      break; 
    }
  }

  if (rowIdx !== -1) {
    stats.getRange(rowIdx, colIdx + 1).setValue(val);
  } else {
    let newRow = new Array(headers.length).fill("");
    newRow[0] = id;
    newRow[colIdx] = val;
    stats.appendRow(newRow);
  }
}

function loadStatsServer(id) {
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const docId = ss.getSheetByName("Settings").getRange("B3").getValue();
  const playerEmail = Session.getActiveUser().getEmail() || "Unknown Player"; 

  try {
    const doc = DocumentApp.openById(docId);
    const body = doc.getBody();
    const entry = `[${new Date().toLocaleString()}] [${playerEmail}] ${(id || "UNK").toUpperCase()}: ${message}`;
    body.appendParagraph(entry).setFontFamily("Courier New").setFontSize(9);
  } catch(err) { 
    console.error("Log error: " + err); 
  }
}
