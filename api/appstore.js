// /api/appstore.js — Vercel Serverless Function
// Fetches real Spotify App Store reviews from the iTunes RSS feed
// Tries multiple country stores to maximize review count

const COUNTRY_CODES = ['us', 'gb', 'ca', 'au', 'nz', 'ie', 'in', 'sg', 'za'];
const SPOTIFY_APP_ID = '324684580';

async function fetchReviewsForCountry(cc, page = 1) {
  const url =
    `https://itunes.apple.com/${cc}/rss/customerreviews/` +
    `page=${page}/id=${SPOTIFY_APP_ID}/sortBy=mostRecent/json`;

  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json();
  if (!data.feed.entry) return [];

  // entry[0] is app metadata when present — detect by checking for 'im:rating'
  const entries = data.feed.entry.filter(entry => entry['im:rating']);

  return entries.map(entry => ({
    id: entry.id.label,
    source: 'appstore',
    title: entry.title.label,
    content: entry.content.label,
    rating: entry['im:rating'].label,
    author: entry.author.name.label,
    date: entry.updated.label,
    country: cc,
  }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    let allReviews = [];

    // Try each country code until we get reviews (or collect from all)
    for (const cc of COUNTRY_CODES) {
      const reviews = await fetchReviewsForCountry(cc);
      allReviews = allReviews.concat(reviews);
      // Stop once we have a good batch
      if (allReviews.length >= 40) break;
    }

    // Deduplicate by review ID
    const seen = new Set();
    const reviews = allReviews.filter(r => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });

    res.status(200).json({ reviews, count: reviews.length });
  } catch (err) {
    res.status(500).json({ error: err.message, reviews: [] });
  }
}
