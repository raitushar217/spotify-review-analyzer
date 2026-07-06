export default function SourceSummary({ sourceStats, sourceErrors, analysis }) {
  const timestamp = new Date().toLocaleTimeString();
  const bothFailed = sourceStats.total === 0 && !sourceErrors?.appstore && !sourceErrors?.reddit;
  const usingFallback = sourceStats.total <= 6 && !sourceErrors?.appstore && !sourceErrors?.reddit;

  const tiles = [
    {
      label: 'Total Items Analyzed',
      value: sourceStats.total ?? 0,
      color: 'text-[#1DB954]',
      bg: 'bg-[#1DB954]/5 border-[#1DB954]/20',
    },
    {
      label: 'App Store Reviews',
      value: sourceStats.appstore ?? 0,
      color: 'text-blue-400',
      bg: 'bg-blue-500/5 border-blue-500/20',
    },
    {
      label: 'Reddit Posts',
      value: sourceStats.reddit ?? 0,
      color: 'text-orange-400',
      bg: 'bg-orange-500/5 border-orange-500/20',
    },
    {
      label: 'Analyzed at',
      value: timestamp,
      color: 'text-gray-400',
      bg: 'bg-white/[0.03] border-white/10',
      isTime: true,
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 pt-10">
      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={`rounded-xl border px-5 py-4 ${tile.bg} flex flex-col gap-1 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-150 ease-out cursor-default`}
          >
            <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
              {tile.label}
            </span>
            <span
              className={`font-bold leading-none ${tile.color} ${
                tile.isTime ? 'text-base mt-1' : 'text-4xl'
              }`}
            >
              {tile.value}
            </span>
          </div>
        ))}
      </div>

      {/* Error banners */}

      {!usingFallback && sourceErrors?.appstore && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-sm text-amber-400 mb-3">
          ⚠&nbsp; App Store unavailable — Reddit data only
        </div>
      )}
      {!usingFallback && sourceErrors?.reddit && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-sm text-amber-400 mb-3">
          ⚠&nbsp; Reddit unavailable — App Store data only
        </div>
      )}
    </section>
  );
}
