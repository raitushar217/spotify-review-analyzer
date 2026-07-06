import React from 'react';

export default function KeyInsights({ analysis }) {
  if (!analysis) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Key Insight Card */}
      <div className="bg-[#1a1a1a] border border-white/5 border-l-4 border-l-[#1DB954] rounded-r-xl p-6 relative overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-150 ease-out">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5" role="img" aria-label="lightbulb">💡</span>
          <div className="space-y-1.5">
            <span className="text-[#1DB954] text-xs font-bold uppercase tracking-wider block">
              Key Insight
            </span>
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              {analysis.key_insight || 'No key insight available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Surprising Insight Card */}
      <div className="bg-[#1a1a1a] border border-white/5 border-l-4 border-l-amber-500 rounded-r-xl p-6 relative overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-150 ease-out">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5" role="img" aria-label="zap">⚡</span>
          <div className="space-y-1.5">
            <span className="text-amber-500 text-xs font-bold uppercase tracking-wider block">
              Surprising Insight
            </span>
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed">
              {analysis.surprising_insight || 'No surprising insight available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Scale Note */}
      {analysis.scale_note && (
        <p className="text-xs text-gray-500 italic px-1">
          {analysis.scale_note}
        </p>
      )}
    </section>
  );
}
