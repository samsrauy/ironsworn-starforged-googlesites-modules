/**
 * Code.gs - STARFORGED VOID-LINK (GM DATABASE BACKEND)
 * Deployment: Execute as "Me", Access: "Anyone"
 */
function doGet(e) {
  const html = HtmlService.createTemplateFromFile('Index');
  html.charId = e.parameter.id || ''; 
  return html.evaluate() 
    .setTitle('VOID-LINK // TERMINAL')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

function saveStatServer(id, field, val) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let stats = ss.getSheetByName("Stat") || ss.insertSheet("Stat");
  const data = stats.getDataRange().getValues();
  const headers = data[0];
  const colIdx = headers.indexOf(field);
  if (colIdx === -1) return "ERR_FIELD";
  const searchId = id.toString().trim().toLowerCase();
  let rowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().trim().toLowerCase() === searchId) {
      rowIdx = i + 1; break; 
    }
  }
  if (rowIdx !== -1) {
    stats.getRange(rowIdx, colIdx + 1).setValue(val);
  } else {
    let newRow = new Array(headers.length).fill("");
    newRow[0] = id.trim(); 
    newRow[colIdx] = val;
    stats.appendRow(newRow);
  }
  return "SUCCESS";
}

function loadStatsServer(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stats = ss.getSheetByName("Stat");
  if (!stats) return JSON.stringify({id: id});
  const data = stats.getDataRange().getValues();
  const headers = data[0];
  const searchId = id.toString().trim().toLowerCase();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().trim().toLowerCase() === searchId) {
      let obj = {};
      headers.forEach((h, idx) => obj[h] = data[i][idx]);
      return JSON.stringify(obj);
    }
  }
  return JSON.stringify({id: id});
}

function logServer(id, message) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const settings = ss.getSheetByName("Settings");
    const docId = settings.getRange("B3").getValue();
    DocumentApp.openById(docId).getBody().appendParagraph(`[${new Date().toLocaleString()}] ${id}: ${message}`);
    return "OK";
  } catch (e) { return "ERR"; }
}
