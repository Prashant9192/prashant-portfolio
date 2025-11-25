/**
 * Google Apps Script to handle Contact Form submissions
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code into the editor (replace existing code)
 * 4. Save the project (Ctrl+S)
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 * 7. Description: "Contact Form API"
 * 8. Execute as: "Me"
 * 9. Who has access: "Anyone" (Important!)
 * 10. Click "Deploy"
 * 11. Copy the "Web app URL"
 * 12. Add this URL to your .env.local file as GOOGLE_SHEETS_WEBAPP_URL
 */

function doPost(e) {
  try {
    // Parse the JSON data sent from the Next.js API
    var data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet and the first sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If header row doesn't exist, create it
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
    }
    
    // Append the new row with data
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.message
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
