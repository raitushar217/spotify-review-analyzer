// /api/reddit.js — Vercel Serverless Function
// Fetches Reddit r/spotify posts about music discovery and recommendation frustrations
// Uses RSS feeds (Atom XML) since Reddit blocks JSON API from server-side

const SUBREDDITS = [
  'spotify',
  'truespotify',
];

const SEARCH_QUERIES = [
  'music+discovery',
  'recommendations+same+songs',
  'algorithm+repetitive',
  'discover+weekly+not+working',
];

const UA = 'SpotifyResearch/1.0';

// Lightweight XML field extractor (no dependency needed for Atom feeds)
function extractEntries(xml) {
  const entries = [];
  const entryBlocks = xml.split('<entry>').slice(1); // skip preamble

  for (const block of entryBlocks) {
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 's'));
      return m ? m[1].trim() : '';
    };

    const id = get('id');
    const title = get('title');
    const updated = get('updated');
    const author = get('name'); // nested inside <author>
    const rawContent = get('content');

    // Decode HTML entities then strip HTML tags to get plain text
    const content = rawContent
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 600);

    if (title) {
      entries.push({ id, title, content, author, updated });
    }
  }

  return entries;
}

async function fetchRSS(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return [];
  const xml = await res.text();
  return extractEntries(xml);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const seen = new Set();
    const posts = [];

    // Strategy 1: Fetch hot posts from relevant subreddits
    for (const sub of SUBREDDITS) {
      try {
        const entries = await fetchRSS(`https://www.reddit.com/r/${sub}/.rss`);
        for (const entry of entries) {
          if (seen.has(entry.id)) continue;
          seen.add(entry.id);
          posts.push({
            id: entry.id,
            source: 'reddit',
            title: entry.title,
            content: entry.content || entry.title,
            rating: 'N/A',
            score: null,
            author: entry.author.replace(/^\/u\//, ''),
            date: entry.updated,
            subreddit: sub,
          });
        }
        await delay(500); // Respect rate limits between requests
      } catch {
        // Individual feed failure is non-fatal
      }
    }

    // Strategy 2: Try search RSS feeds (may be rate-limited)
    for (const q of SEARCH_QUERIES) {
      try {
        const url =
          `https://www.reddit.com/r/spotify/search.rss` +
          `?q=${q}&sort=top&t=year&limit=10&restrict_sr=1`;
        const entries = await fetchRSS(url);
        for (const entry of entries) {
          if (seen.has(entry.id)) continue;
          seen.add(entry.id);
          posts.push({
            id: entry.id,
            source: 'reddit',
            title: entry.title,
            content: entry.content || entry.title,
            rating: 'N/A',
            score: null,
            author: entry.author.replace(/^\/u\//, ''),
            date: entry.updated,
            subreddit: 'spotify',
          });
        }
        await delay(1000); // Longer delay for search to avoid 429
      } catch {
        // Search may 429 — non-fatal
      }
    }

    res.status(200).json({ posts, count: posts.length });
  } catch (err) {
    res.status(500).json({ error: err.message, posts: [] });
  }
}
