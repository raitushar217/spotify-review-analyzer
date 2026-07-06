// /api/sheets.js — Vercel Serverless Function
// Fetches pre-processed Play Store batch reviews from a public Google Sheets CSV export

// Quote-aware CSV parser that handles newlines and commas inside quoted fields
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      currentRow.push(currentVal.trim());
      rows.push(currentRow);
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    rows.push(currentRow);
  }
  
  return rows;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const SHEET_ID = '1ocJy_e7DaXbppQw_aYP2K7nEvdPOMK0d502Mj90u8KI';
  const GID = '0'; // Sheet 1 containing pre-processed reviews
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Sheet unavailable');
    
    const csvText = await response.text();
    const allRows = parseCSV(csvText);

    if (allRows.length === 0) {
      return res.status(200).json({ rows: [], count: 0, headers: [] });
    }

    // Parse headers (row 0)
    const headers = allRows[0].map(h =>
      h.trim().toLowerCase().replace(/ /g, '_')
    );
    
    const rows = allRows.slice(1).map(values => {
      const row = {};
      headers.forEach((h, i) => {
        row[h] = values[i] || '';
      });
      return row;
    }).filter(row => {
      // Filter out rows without a valid review_id or completely empty ones
      return row.review_id && row.review_id.trim() !== '';
    }).slice(0, 30);

    res.status(200).json({ 
      rows, 
      count: rows.length,
      headers 
    });
  } catch (err) {
    res.status(500).json({ error: err.message, rows: [] });
  }
}
