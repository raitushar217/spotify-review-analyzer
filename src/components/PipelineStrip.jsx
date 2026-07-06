const NODES = [
  { icon: '📱', label: 'App Store RSS' },
  { icon: '💬', label: 'Reddit r/spotify' },
  { icon: '🤖', label: 'Groq AI (llama-3.1-8b)' },
  { icon: '❓', label: '6 Research Questions' },
  { icon: '📊', label: 'Live Insights' },
];

export default function PipelineStrip({ analysisState, loadingStage }) {
  return (
    <section className="py-8 px-6 bg-[#0d0d0d] border-y border-white/5">
      {/* Pipeline nodes row */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
        {NODES.map((node, idx) => {
          // Determine node state
          let isActive = false;
          let isDone = false;

          if (analysisState === 'loading') {
            // Map loadingStage to node indices
            if (loadingStage === 1 && idx === 0) isActive = true;
            if (loadingStage === 2 && idx === 1) isActive = true;
            if (loadingStage === 3 && idx === 2) isActive = true;
            if (loadingStage === 4 && idx >= 3) isActive = true;
            // Nodes before active are done
            if (
              (loadingStage === 2 && idx === 0) ||
              (loadingStage === 3 && idx <= 1) ||
              (loadingStage === 4 && idx <= 2)
            ) isDone = true;
          }

          if (analysisState === 'complete') {
            isDone = true;
          }

          const nodeColor = isDone
            ? 'border-[#1DB954]/60 bg-[#1DB954]/10'
            : isActive
              ? 'border-[#1DB954]/40 bg-[#1DB954]/5 animate-pulse'
              : 'border-white/10 bg-white/[0.03]';

          const textColor = isDone || isActive ? 'text-white' : 'text-gray-600';

          return (
            <div key={idx} className="flex flex-col md:flex-row items-center gap-3 md:gap-2 w-full md:w-auto">
              {/* Node card */}
              <div
                className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg border ${nodeColor} transition-all duration-500 w-full md:w-[120px] hover:bg-white/[0.05]`}
              >
                <span className="text-xl mb-1">{node.icon}</span>
                <span className={`text-xs font-semibold leading-tight text-center ${textColor} transition-colors duration-500`}>
                  {node.label}
                </span>
              </div>

              {/* Arrow between nodes (not after last) */}
              {idx < NODES.length - 1 && (
                <div className="flex items-center justify-center">
                  {/* Down arrow on mobile, Right arrow on desktop */}
                  <span className={`text-base transition-colors duration-500 ${isDone ? 'text-[#1DB954]' : 'text-gray-700'} block md:hidden`}>
                    ↓
                  </span>
                  <span className={`text-sm transition-colors duration-500 ${isDone ? 'text-[#1DB954]' : 'text-gray-700'} hidden md:block`}>
                    →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer text */}
      <p className="text-center text-[11px] text-gray-600 mt-5 max-w-lg mx-auto leading-relaxed">
        No API key required for data sources &nbsp;·&nbsp;
        Live analysis runs every time &nbsp;·&nbsp;
        Same pipeline as Make.com batch workflow
      </p>
    </section>
  );
}
