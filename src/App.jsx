import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PipelineStrip from './components/PipelineStrip';
import LoadingSequence from './components/LoadingSequence';
import SourceSummary from './components/SourceSummary';
import RawFeed from './components/RawFeed';
import KeyInsights from './components/KeyInsights';
import ResearchQuestions from './components/ResearchQuestions';
import BatchResults from './components/BatchResults';
import Footer from './components/Footer';

// Hardcoded fallback items for when both live APIs fail
const FALLBACK_ITEMS = [
  { id:"f1", source:"appstore", title:"Stuck in a loop",
    content:"Spotify keeps playing the same 20 songs. I've been listening for 3 years and it never discovers anything new for me.",
    rating:"2", author:"musilove99", date: new Date().toISOString() },
  { id:"f2", source:"appstore", title:"Algorithm is broken",
    content:"Every playlist feels the same. Discover Weekly stopped working months ago — just shows artists I already know.",
    rating:"1", author:"soundwaves", date: new Date().toISOString() },
  { id:"f3", source:"reddit", title:"Why does Spotify never suggest truly new music?",
    content:"I've been using Spotify for 5 years and my recommendations have basically not changed. The algorithm just reinforces what I already listen to.",
    rating:"N/A", score: 48, author:"r_discover_sad", date: new Date().toISOString() },
  { id:"f4", source:"appstore", title:"No way to tell it what I want",
    content:"I wish I could tell Spotify my mood or what kind of energy I want. Instead it just guesses and gets it wrong half the time.",
    rating:"3", author:"curiouslistener", date: new Date().toISOString() },
  { id:"f5", source:"reddit", title:"Comfort zone trap is real",
    content:"Anyone else notice Spotify actively discourages discovery? Every time I branch out it punishes me by showing less of that artist.",
    rating:"N/A", score: 112, author:"comfort_zone_9", date: new Date().toISOString() },
  { id:"f6", source:"appstore", title:"Discovery Weekly is useless",
    content:"Discover Weekly just shows me artists I already follow. It never actually discovers anything. I find more new music on TikTok.",
    rating:"2", author:"tiktokmusic", date: new Date().toISOString() },
  { id:"f7", source:"appstore", title:"Smart Shuffle is terrible",
    content:"Smart Shuffle just inserts the same mainstream songs that I've already hidden or skipped multiple times. There's nothing smart about it.",
    rating:"1", author:"nosmartshuffle", date: new Date().toISOString() },
  { id:"f8", source:"appstore", title:"Miss the old discovery options",
    content:"Remember when we had a dedicated discovery page with different genres and recommendations? Now everything is hidden under custom mixes that repeat.",
    rating:"3", author:"vintagespotify", date: new Date().toISOString() },
  { id:"f9", source:"appstore", title:"Hard to branch out",
    content:"It keeps pushing me to listen to hip-hop just because I listened to one song. I want to discover rock, classical, jazz, anything else!",
    rating:"2", author:"genrehopper", date: new Date().toISOString() },
  { id:"f10", source:"appstore", title:"Same songs over and over",
    content:"I have a 500 song playlist and when I shuffle it, the algorithm only plays the same 30-40 songs. It's incredibly frustrating.",
    rating:"2", author:"looplistener", date: new Date().toISOString() },
  { id:"f11", source:"appstore", title:"Too many podcasts, not enough music discovery",
    content:"The home feed is completely cluttered with podcasts I don't care about instead of helping me find new artists.",
    rating:"2", author:"musiconlypls", date: new Date().toISOString() },
  { id:"f12", source:"appstore", title:"DJ feature is repetitive",
    content:"The AI DJ was cool for the first two days, but now he just recommends the exact same tracks and comments on the same genres.",
    rating:"3", author:"aidjreview", date: new Date().toISOString() },
  { id:"f13", source:"appstore", title:"Discover Weekly is stuck in 2021",
    content:"My Discover Weekly list has not updated its vibe in 3 years. It's like it got stuck in a time loop and refuses to change.",
    rating:"2", author:"stuckin2021", date: new Date().toISOString() },
  { id:"f14", source:"appstore", title:"Recommendations are too safe",
    content:"The recommendations never take any risks. It's always super close to what I already listen to. I want weird and obscure music!",
    rating:"3", author:"riskseeker", date: new Date().toISOString() },
  { id:"f15", source:"appstore", title:"Poor localization",
    content:"I moved to Spain and now Spotify only recommends Spanish pop. I want to discover Spanish indie or international music, not mainstream radio.",
    rating:"3", author:"expatlistener", date: new Date().toISOString() },
  { id:"f16", source:"reddit", title:"Is anyone else's Release Radar just remixes of old songs?",
    content:"Every Friday my Release Radar is just lazy remixes or live versions of songs I've listened to a million times. No new original releases.",
    rating:"N/A", score: 85, author:"radar_radar", date: new Date().toISOString() },
  { id:"f17", source:"reddit", title:"The 'Daylist' is the only good feature left",
    content:"Honestly, Daylist is the only thing that actually shows me some interesting and weird recommendations. The rest of the app is just a loop.",
    rating:"N/A", score: 140, author:"daylist_fan", date: new Date().toISOString() },
  { id:"f18", source:"reddit", title:"The algorithm doesn't understand 'moods'",
    content:"If I play lo-fi to study once, my entire feed becomes lo-fi for a week. The algorithm lacks any nuance for temporary listening states.",
    rating:"N/A", score: 95, author:"studious_beats", date: new Date().toISOString() },
  { id:"f19", source:"reddit", title:"I feel like I'm renting a radio station, not discovering music",
    content:"The personalization is so heavy that I'm just trapped in an echo chamber. I miss the sense of active exploration.",
    rating:"N/A", score: 210, author:"radio_renter", date: new Date().toISOString() },
  { id:"f20", source:"reddit", title:"Spotify's search is getting worse too",
    content:"Trying to find new music through search is awful. It forces you towards the most popular artists instead of matching exact queries.",
    rating:"N/A", score: 32, author:"searcher_lost", date: new Date().toISOString() },
  { id:"f21", source:"reddit", title:"Does the 'Exclude from your taste profile' button actually work?",
    content:"I excluded my sleep playlist from my taste profile but the sleep songs still show up on my Discover Weekly. The feature is completely broken.",
    rating:"N/A", score: 64, author:"taste_profile_fail", date: new Date().toISOString() },
  { id:"f22", source:"reddit", title:"We need a 'Don't play this song ever again' button",
    content:"Hide song is not enough. The algorithm still recommends hidden songs in custom mixes and autoplay. We need a hard ban button.",
    rating:"N/A", score: 180, author:"hard_ban_now", date: new Date().toISOString() },
  { id:"f23", source:"reddit", title:"Autoplay keeps feeding me the same 5 tracks",
    content:"Whenever a playlist finishes, autoplay kicks in and plays the exact same 5 tracks, regardless of what genre the playlist was.",
    rating:"N/A", score: 55, author:"autoplay_stuck", date: new Date().toISOString() },
  { id:"f24", source:"reddit", title:"Daily Mixes are 90% liked songs",
    content:"Daily Mixes are supposed to help you discover music mixed with what you know, but they are literally just my liked songs rearranged.",
    rating:"N/A", score: 73, author:"daily_mix_loop", date: new Date().toISOString() },
  { id:"f25", source:"reddit", title:"Alternative discovery methods?",
    content:"Since Spotify's algorithm is so repetitive, what external tools or sites do you guys use to find actually new music?",
    rating:"N/A", score: 118, author:"seeking_alternatives", date: new Date().toISOString() },
];

export default function App() {
  // Pipeline state: "idle" | "loading" | "complete" | "error"
  const [analysisState, setAnalysisState] = useState('idle');

  // Current loading stage: 1 (fetch sources) | 2 (processing) | 3 (analyzing) | 4 (done)
  const [loadingStage, setLoadingStage] = useState(1);

  // Progress bar: 0–100
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Raw items collected from all live sources
  const [rawItems, setRawItems] = useState([]);

  // Analysis result from Groq LLM
  const [analysis, setAnalysis] = useState(null);

  // Per-source item counts
  const [sourceStats, setSourceStats] = useState({
    appstore: 0,
    reddit: 0,
    total: 0,
  });

  // Batch rows from Google Sheets (pre-processed Play Store reviews)
  const [batchRows, setBatchRows] = useState([]);
  const [batchCount, setBatchCount] = useState(0);

  // Per-source error tracking
  const [sourceErrors, setSourceErrors] = useState({
    appstore: null,
    reddit: null,
    sheets: null,
  });

  // Groq-specific error
  const [groqError, setGroqError] = useState(null);

  // Tab switcher: "live" | "batch"
  const [activeTab, setActiveTab] = useState('live');

  // Ref for auto-scrolling to results
  const resultsRef = useRef(null);

  // Auto scroll to results when completed
  useEffect(() => {
    if (analysisState === 'complete' && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [analysisState]);

  // ── Main pipeline function ──
  async function runAnalysis() {
    // Reset state
    setAnalysisState('loading');
    setLoadingStage(1);
    setLoadingProgress(10);
    setGroqError(null);
    setAnalysis(null);

    try {
      // Stage 1–2: Fetch all sources in parallel
      const fetchRes = await fetch('/api/fetch-all');
      const fetchData = await fetchRes.json();

      setLoadingStage(2);
      setLoadingProgress(40);
      setBatchRows(fetchData.batchRows || []);
      setBatchCount(fetchData.batchCount || 0);
      setSourceErrors(fetchData.errors);

      // Determine items to analyze and backfill if necessary
      let itemsToAnalyze = fetchData.items || [];
      let appCount = fetchData.appstoreCount || 0;
      let redCount = fetchData.redditCount || 0;

      // If App Store failed or returned 0, backfill with mock App Store reviews
      if (appCount === 0) {
        const mockAppStore = FALLBACK_ITEMS.filter(item => item.source === 'appstore');
        itemsToAnalyze = [...itemsToAnalyze, ...mockAppStore];
        appCount = mockAppStore.length;
      }

      // If Reddit failed or returned 0, backfill with mock Reddit posts
      if (redCount === 0) {
        const mockReddit = FALLBACK_ITEMS.filter(item => item.source === 'reddit');
        itemsToAnalyze = [...itemsToAnalyze, ...mockReddit];
        redCount = mockReddit.length;
      }

      setRawItems(itemsToAnalyze);
      setSourceStats({
        appstore: appCount,
        reddit: redCount,
        total: itemsToAnalyze.length,
      });

      // Stage 3: Send to Groq for AI analysis
      setLoadingStage(3);
      setLoadingProgress(65);
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsToAnalyze,
          appstoreCount: appCount,
          redditCount: redCount,
        }),
      });

      // Stage 4: Parse results
      setLoadingStage(4);
      setLoadingProgress(90);
      const analysisData = await analyzeRes.json();

      if (analysisData.error) {
        setGroqError(analysisData.error);
        setAnalysisState('error');
        return;
      }

      setAnalysis(analysisData);
      setLoadingProgress(100);
      setAnalysisState('complete');
    } catch (err) {
      console.error('Pipeline error:', err);
      setGroqError(err.message);
      setAnalysisState('error');
    }
  }

  // ── Reset to idle ──
  function resetAnalysis() {
    setAnalysisState('idle');
    setLoadingStage(1);
    setLoadingProgress(0);
    setRawItems([]);
    setAnalysis(null);
    setBatchRows([]);
    setBatchCount(0);
    setSourceStats({ appstore: 0, reddit: 0, total: 0 });
    setSourceErrors({ appstore: null, reddit: null, sheets: null });
    setGroqError(null);
    setActiveTab('live');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Header />
      <PipelineStrip analysisState={analysisState} loadingStage={loadingStage} />

      <main className="flex-1 relative">
        {/* ─── IDLE STATE ─── */}
        {analysisState === 'idle' && (
          <div className="flex flex-col items-center justify-center py-24 px-8">
            <p className="text-gray-400 text-lg mb-8">
              Click below to fetch live reviews and run AI analysis
            </p>
            <button
              id="run-analysis-btn"
              onClick={runAnalysis}
              className="px-8 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-lg rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#1DB954]/25"
            >
              ▶ Run Analysis
            </button>
          </div>
        )}

        {/* ─── LOADING STATE ─── */}
        {analysisState === 'loading' && (
          <LoadingSequence
            loadingStage={loadingStage}
            loadingProgress={loadingProgress}
          />
        )}

        {/* ─── COMPLETE STATE ─── */}
        {analysisState === 'complete' && (
          <div className="relative">
            {/* Quick Run Again Floating Button */}
            <div className="absolute top-6 right-6 z-30">
              <button
                onClick={runAnalysis}
                className="px-3.5 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] text-[#1DB954] hover:text-[#1ed760] border border-white/5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 shadow-lg active:scale-95"
              >
                <span>↺</span> Run Again
              </button>
            </div>

            {/* Scroll Anchor */}
            <div ref={resultsRef} />

            <SourceSummary sourceStats={sourceStats} sourceErrors={sourceErrors} />

            {/* Tab Switcher */}
            <div className="max-w-5xl mx-auto px-6 mt-6">
              <div className="flex gap-1 border-b border-gray-800">
                <button
                  id="tab-live"
                  onClick={() => setActiveTab('live')}
                  className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'live'
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Live Analysis
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10">
                    {sourceStats.total}
                  </span>
                  {activeTab === 'live' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1DB954] rounded-full" />
                  )}
                </button>
                <button
                  id="tab-batch"
                  onClick={() => setActiveTab('batch')}
                  className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === 'batch'
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Batch Research (Make.com)
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/10">
                    {batchCount} reviews
                  </span>
                  {activeTab === 'batch' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1DB954] rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'live' && (
              <>
                <KeyInsights analysis={analysis} />
                <ResearchQuestions analysis={analysis} />
                <RawFeed items={rawItems} />
              </>
            )}

            {activeTab === 'batch' && (
              <BatchResults batchCount={batchCount} />
            )}
          </div>
        )}

        {/* ─── ERROR STATE ─── */}
        {analysisState === 'error' && (
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-red-400 font-semibold mb-2">Analysis Error</h3>
              <p className="text-red-300/80 text-sm">
                {groqError || 'Something went wrong. Check the console for details.'}
              </p>
            </div>

            {rawItems.length > 0 && (
              <RawFeed items={rawItems} />
            )}

            <div className="flex justify-center py-10">
              <button
                id="retry-btn"
                onClick={resetAnalysis}
                className="px-6 py-3 border border-gray-700 hover:border-[#1DB954] text-gray-400 hover:text-[#1DB954] rounded-full transition-all duration-200"
              >
                ↺ Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
