import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d0d0d] border-t border-white/5 py-12 px-6 mt-12">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        
        {/* Three buttons row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          {/* Button 1 */}
          <a
            href="https://docs.google.com/spreadsheets/d/1ocJy_e7DaXbppQw_aYP2K7nEvdPOMK0d502Mj90u8KI/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#1DB954] text-white text-xs sm:text-sm font-semibold text-center hover:bg-[#1DB954]/10 transition-colors duration-150"
          >
            📊 View Full Research Sheet (300+ reviews)
          </a>

          {/* Button 2 */}
          <a
            href="https://spotify-nudge.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs sm:text-sm font-bold text-center transition-colors duration-150"
          >
            🎵 See the Music Discovery MVP
          </a>

          {/* Button 3 */}
          <a
            href="https://eu1.make.com/public/shared-scenario/AX0jvfDD31g"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-700 text-gray-400 hover:text-gray-300 hover:border-gray-600 text-xs sm:text-sm font-semibold text-center transition-colors duration-150"
          >
            ⚙️ View Make.com Workflow
          </a>
        </div>

        {/* Small gray text below */}
        <p className="text-center text-[10px] sm:text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
          Research Engine fetches fresh data on every run &nbsp;·&nbsp;
          Powered by Groq llama-3.1-8b-instant &nbsp;·&nbsp;
          Part of Spotify Discovery PM Research
        </p>

      </div>
    </footer>
  );
}
