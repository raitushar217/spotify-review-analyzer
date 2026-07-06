import React from 'react';

export default function LoadingSequence({ loadingStage, loadingProgress }) {
  const stages = [
    { id: 1, label: '📱 Fetching latest Spotify App Store reviews...' },
    { id: 2, label: '💬 Fetching Reddit r/spotify discussions...' },
    { id: 3, label: '🤖 Sending combined feed to Groq AI for analysis...' },
    { id: 4, label: '📊 Structuring answers to 6 research questions...' },
  ];

  return (
    <div className="w-full relative py-12 px-6 max-w-2xl mx-auto">
      {/* Smooth Progress Bar at top of the loading box */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-10">
        <div
          className="h-full bg-[#1DB954] transition-all duration-700 ease-out"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>

      {/* Stage Rows */}
      <div className="space-y-6">
        {stages.map((stage) => {
          const isActive = loadingStage === stage.id;
          const isDone = loadingStage > stage.id;
          const isPending = loadingStage < stage.id;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-4 transition-all duration-300 ${
                isActive ? 'scale-[1.02]' : ''
              }`}
            >
              {/* Stage Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border transition-all duration-500 ${
                  isDone
                    ? 'bg-[#1DB954] border-[#1DB954] text-black'
                    : isActive
                    ? 'border-[#1DB954] text-[#1DB954] bg-[#1DB954]/10 shadow-[0_0_15px_rgba(29,185,84,0.2)]'
                    : 'border-gray-800 text-gray-500 bg-transparent'
                }`}
              >
                {isDone ? '✓' : stage.id}
              </div>

              {/* Stage Label */}
              <div className="flex-1">
                <p
                  className={`text-sm sm:text-base font-medium transition-colors duration-500 ${
                    isActive ? 'text-white' : isDone ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {stage.label}
                </p>
              </div>

              {/* Status Indicator (Spinner / Done Check) */}
              {isActive && (
                <div className="w-4 h-4 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
              )}
              {isDone && (
                <span className="text-[#1DB954] text-sm font-semibold">Ready</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Animated helper text below */}
      <div className="text-center mt-12 animate-pulse">
        <p className="text-[#1DB954] italic text-xs sm:text-sm">
          This takes 10-15 seconds — real AI, real reviews
        </p>
      </div>
    </div>
  );
}
