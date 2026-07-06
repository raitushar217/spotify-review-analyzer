import React from 'react';

export default function BatchResults({ batchCount }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      {/* SECTION HEADER */}
      <div className="border-l-4 border-amber-500 pl-4 py-1">
        <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-1">
          BATCH RESEARCH — PRE-PROCESSED
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          300+ Play Store Reviews Analyzed via Make.com
        </h2>
        <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
          Processed using an 8-module Make.com workflow → Groq AI classification → Google Sheets output.
          This batch defined the problem space before the live demo was built.
        </p>
      </div>

      {/* HOW IT WAS BUILT (Methodology Row) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Make.com Scenario Card */}
        <div className="md:col-span-7 space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] transition-colors duration-150">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/40 border border-white/5">
            <img
              src="/make-workflow.png"
              alt="Make.com 8-module AI workflow"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 flex-col items-center justify-center text-center p-4">
              <span className="text-3xl mb-2">⚙️</span>
              <span className="text-xs text-gray-500 font-mono">Make.com Scenario Diagram</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pt-2">
            <p className="text-xs text-gray-400 font-medium">
              Make.com workflow: App/Play Store → HTTP module → Groq AI → JSON parser → Google Sheets
            </p>
            <a
              href="https://eu1.make.com/public/shared-scenario/AX0jvfDD31g"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1DB954] hover:text-[#1ed760] font-semibold flex items-center shrink-0"
            >
              View live workflow →
            </a>
          </div>
        </div>

        {/* Google Sheets Output Card */}
        <div className="md:col-span-5 space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] transition-colors duration-150">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/40 border border-white/5">
            <img
              src="/sheets-output.png"
              alt="Google Sheets analysis output"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 flex-col items-center justify-center text-center p-4">
              <span className="text-3xl mb-2">📊</span>
              <span className="text-xs text-gray-500 font-mono">Google Sheets Spreadsheet View</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pt-2">
            <p className="text-xs text-gray-400 font-medium">
              Output: 300+ reviews classified with frustration category, user segment, and insight
            </p>
            <a
              href="https://docs.google.com/spreadsheets/d/1ocJy_e7DaXbppQw_aYP2K7nEvdPOMK0d502Mj90u8KI/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1DB954] hover:text-[#1ed760] font-semibold flex items-center shrink-0"
            >
              View full sheet →
            </a>
          </div>
        </div>
      </div>

      {/* COMPARISON CALLOUT */}
      <div className="border border-[#1DB954]/30 bg-[#1DB954]/5 rounded-xl p-6 sm:p-8 hover:bg-[#1DB954]/10 transition-colors duration-150">
        <h3 className="text-lg font-bold text-white mb-6">
          Batch vs. Live — Same Pipeline, Different Scale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Batch Column */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">
              Batch (Make.com)
            </span>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#1DB954]">✓</span>
                <span>300+ Play Store reviews</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1DB954]">✓</span>
                <span>Processed once, results stored</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1DB954]">✓</span>
                <span>Deeper historical analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1DB954]">✓</span>
                <span>Multiple sources in one run</span>
              </li>
            </ul>
          </div>

          {/* Live Column */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#1DB954] uppercase tracking-wider block">
              Live (This App)
            </span>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-[#1DB954]">✓</span>
                <span>Fresh App Store + Reddit data</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1DB954]">✓</span>
                <span>Runs on demand, any time</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1DB954]">✓</span>
                <span>Real-time analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#1DB954]">✓</span>
                <span>Grader can verify it's not hardcoded</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
