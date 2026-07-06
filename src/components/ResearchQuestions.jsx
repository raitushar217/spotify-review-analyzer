import React from 'react';

export default function ResearchQuestions({ analysis }) {
  if (!analysis) return null;

  // Helper for empty states
  const renderEmptyState = () => (
    <p className="text-gray-500 italic text-xs py-4">
      Insufficient data from this fetch — try again for more comprehensive results
    </p>
  );

  // Q1 Data Logic
  const q1Data = analysis.q1_why_struggle_to_discover || [];
  const maxQ1Count = q1Data.length > 0 ? Math.max(...q1Data.map(item => item.count || 1)) : 1;

  // Q2 Data Logic
  const q2Data = analysis.q2_recommendation_frustrations || [];

  // Q3 Data Logic
  const q3Data = analysis.q3_listening_behaviors || [];

  // Q4 Data Logic
  const q4Data = analysis.q4_repeat_listening_causes || [];

  // Q5 Data Logic
  const q5Data = analysis.q5_user_segments || [];
  const q5Colors = ['text-green-400', 'text-blue-400', 'text-amber-400', 'text-purple-400'];

  // Q6 Data Logic
  const q6Data = [...(analysis.q6_unmet_needs || [])].sort((a, b) => (b.mention_count || 0) - (a.mention_count || 0));

  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      {/* Title block */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          6 Research Questions — Live AI Answers
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm">
          Every answer generated from real fetched data
        </p>
      </div>

      {/* 2x3 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Q1 CARD */}
        <div className="bg-[#282828] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-[#2f2f2f] hover:border-white/10 transition-all duration-150 ease-out">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">
              Q1: Why do users struggle to discover new music?
            </h3>
            {q1Data.length === 0 ? renderEmptyState() : (
              <div className="space-y-3.5">
                {q1Data.map((item, idx) => {
                  const percentage = ((item.count || 0) / maxQ1Count) * 100;
                  return (
                    <div key={idx} className="relative overflow-hidden rounded-lg bg-white/[0.02] border border-white/5 p-3">
                      {/* Bar Fill Background */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-[#1DB954]/10 transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex justify-between items-center gap-3">
                        <span className="text-xs text-white font-medium leading-relaxed">
                          {item.reason}
                        </span>
                        <span className="text-[10px] bg-[#1DB954] text-black font-bold px-2 py-0.5 rounded-full shrink-0">
                          {item.count}
                        </span>
                      </div>
                      {item.evidence && (
                        <p className="relative text-[10px] text-gray-500 mt-1 italic">
                          "{item.evidence}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Q2 CARD */}
        <div className="bg-[#282828] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-[#2f2f2f] hover:border-white/10 transition-all duration-150 ease-out">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">
              Q2: Most common frustrations with recommendations?
            </h3>
            {q2Data.length === 0 ? renderEmptyState() : (
              <div className="space-y-4">
                {q2Data.map((item, idx) => {
                  const severity = (item.severity || 'low').toLowerCase();
                  const severityBadge = severity === 'high' 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                    : severity === 'medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-white/5 text-gray-400 border border-white/10';

                  return (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-white font-medium leading-tight">
                            {item.frustration}
                          </span>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${severityBadge}`}>
                            {severity}
                          </span>
                          {item.count !== undefined && (
                            <span className="text-[9px] text-gray-500 font-mono">
                              ({item.count} hits)
                            </span>
                          )}
                        </div>
                        {item.example && (
                          <p className="text-[10px] text-gray-500 italic">
                            "{item.example}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Q3 CARD */}
        <div className="bg-[#282828] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-[#2f2f2f] hover:border-white/10 transition-all duration-150 ease-out">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">
              Q3: What listening behaviors are users trying to achieve?
            </h3>
            {q3Data.length === 0 ? renderEmptyState() : (
              <div className="flex flex-wrap gap-2">
                {q3Data.map((item, idx) => {
                  const freq = (item.frequency || 'rare').toLowerCase();
                  const freqDot = freq === 'common'
                    ? 'bg-[#1DB954]'
                    : freq === 'occasional'
                    ? 'bg-amber-500'
                    : 'bg-gray-600';

                  return (
                    <div 
                      key={idx} 
                      className="group relative bg-[#1f1f1f] border border-white/5 hover:border-white/15 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors duration-150"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${freqDot}`} />
                      <span className="text-xs text-white font-medium">{item.behavior}</span>
                      
                      {/* Tooltip on Hover */}
                      {item.description && (
                        <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-black border border-white/10 text-[10px] text-gray-300 p-2 rounded shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          {item.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Q4 CARD */}
        <div className="bg-[#282828] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-[#2f2f2f] hover:border-white/10 transition-all duration-150 ease-out">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">
              Q4: What causes repeated same-content listening?
            </h3>
            {q4Data.length === 0 ? renderEmptyState() : (
              <div className="space-y-3.5">
                {q4Data.map((item, idx) => {
                  const freq = (item.frequency || 'low').toLowerCase();
                  const badgeStyle = freq === 'high'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : freq === 'medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-white/5 text-gray-400 border border-white/10';

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${badgeStyle}`}>
                          {freq}
                        </span>
                        <span className="text-xs font-medium text-white leading-snug">
                          {item.cause}
                        </span>
                      </div>
                      {item.evidence && (
                        <p className="text-[10px] text-gray-500 italic pl-1">
                          "{item.evidence}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Q5 CARD */}
        <div className="bg-[#282828] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-[#2f2f2f] hover:border-white/10 transition-all duration-150 ease-out">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">
              Q5: Which user segments face different challenges?
            </h3>
            {q5Data.length === 0 ? renderEmptyState() : (
              <div className={`grid gap-4 ${q5Data.length >= 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {q5Data.map((item, idx) => {
                  const colorClass = q5Colors[idx % q5Colors.length];
                  return (
                    <div key={idx} className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-lg space-y-1">
                      <h4 className={`text-xs font-bold ${colorClass}`}>
                        {item.segment}
                      </h4>
                      <p className="text-[10px] text-gray-300 leading-normal">
                        {item.discovery_challenge}
                      </p>
                      {item.evidence && (
                        <p className="text-[9px] text-gray-500 italic">
                          "{item.evidence}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Q6 CARD */}
        <div className="bg-[#282828] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-[#2f2f2f] hover:border-white/10 transition-all duration-150 ease-out">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-4 tracking-wide uppercase">
              Q6: What unmet needs emerge consistently?
            </h3>
            {q6Data.length === 0 ? renderEmptyState() : (
              <div className="space-y-3.5">
                {q6Data.map((item, idx) => (
                  <div key={idx} className="border-l-2 border-l-[#1DB954] pl-3 py-0.5 space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-bold text-white leading-snug">
                        {item.need}
                      </span>
                      {item.mention_count !== undefined && (
                        <span className="text-[9px] bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20 font-bold px-1.5 py-0.5 rounded">
                          {item.mention_count} mentions
                        </span>
                      )}
                    </div>
                    {item.example_quote && (
                      <p className="text-[10px] text-gray-500 italic">
                        "{item.example_quote}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
