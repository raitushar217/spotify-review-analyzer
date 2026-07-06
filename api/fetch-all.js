// /api/fetch-all.js — Vercel Serverless Function
// Runs all three sources (App Store + Reddit + Google Sheets) in parallel
// and returns a combined array of live items plus batch review rows

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Use https in production (Vercel), http for local dev
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const base = `${protocol}://${req.headers.host}`;

  const [appstoreResult, redditResult, sheetsResult] = await Promise.allSettled([
    fetch(`${base}/api/appstore`).then(r => r.json()),
    fetch(`${base}/api/reddit`).then(r => r.json()),
    fetch(`${base}/api/sheets`).then(r => r.json()),
  ]);

  const appstoreItems = appstoreResult.status === 'fulfilled'
    ? (appstoreResult.value.reviews || []) : [];
  const redditItems = redditResult.status === 'fulfilled'
    ? (redditResult.value.posts || []) : [];
  const sheetsRows = sheetsResult.status === 'fulfilled'
    ? (sheetsResult.value.rows || []) : [];

  const appstoreError = appstoreResult.status === 'rejected'
    ? appstoreResult.reason?.message : null;
  const redditError = redditResult.status === 'rejected'
    ? redditResult.reason?.message : null;
  const sheetsError = sheetsResult.status === 'rejected'
    ? sheetsResult.reason?.message : null;

  const allItems = [...appstoreItems, ...redditItems];

  res.status(200).json({
    items: allItems,
    appstoreCount: appstoreItems.length,
    redditCount: redditItems.length,
    total: allItems.length,
    batchRows: sheetsRows,
    batchCount: sheetsRows.length,
    errors: {
      appstore: appstoreError,
      reddit: redditError,
      sheets: sheetsError
    }
  });
}
