export default function Header() {
  return (
    <header className="relative overflow-hidden py-16 px-6 text-center bg-gradient-to-b from-[#0d0d0d] via-[#111] to-[#0a0a0a]">
      {/* Subtle radial glow behind title */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#1DB954]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Top label */}
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 font-medium mb-6">
          AI-Powered Research Engine &nbsp;·&nbsp; Spotify Discovery Study
        </p>

        {/* Main title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-5 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              Spotify Discovery
            </span>
            <span className="text-[10px] tracking-wider uppercase font-bold text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-[pulse_2s_infinite]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
              Live
            </span>
          </div>
          <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
            Research Engine
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Fetches real App Store reviews + Reddit discussions &nbsp;·&nbsp;
          Analyzed live by Groq AI &nbsp;·&nbsp;
          Answers 6 discovery research questions
        </p>
      </div>
    </header>
  );
}
