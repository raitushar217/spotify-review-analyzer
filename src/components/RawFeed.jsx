import { useState } from 'react';

// Single expandable item card
function FeedCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  const isAppStore = item.source === 'appstore';
  const rating = parseInt(item.rating, 10);

  // Star display for app store
  function Stars({ rating }) {
    return (
      <div className="flex gap-0.5 items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          let color;
          if (star <= rating) {
            color = rating >= 4 ? 'text-[#1DB954]' : rating === 3 ? 'text-amber-400' : 'text-red-400';
          } else {
            color = 'text-gray-700';
          }
          return (
            <span key={star} className={`text-xs ${color}`}>●</span>
          );
        })}
      </div>
    );
  }

  const formattedDate = (() => {
    try {
      return new Date(item.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return item.date || '';
    }
  })();

  const content = item.content || item.title || '';

  return (
    <div className="rounded-xl bg-[#282828] border border-white/[0.06] p-4 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between gap-3">
        {/* Left: badge + rating */}
        <div className="flex flex-col gap-2 shrink-0">
          {isAppStore ? (
            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              App Store
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              Reddit
            </span>
          )}

          {isAppStore ? (
            <Stars rating={rating} />
          ) : (
            <span className="text-xs text-orange-400 font-medium">
              ↑ {item.score ?? '–'}
            </span>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-snug truncate mb-1">
            {item.title || '(no title)'}
          </p>
          <p className={`text-gray-400 text-xs leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
            {content}
          </p>
          {content.length > 180 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[#1DB954] text-xs mt-1 hover:underline"
            >
              {expanded ? 'Show less ←' : 'Read more →'}
            </button>
          )}
        </div>

        {/* Right: author + date */}
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-gray-500 text-[11px] leading-snug">{item.author || 'Anonymous'}</p>
          <p className="text-gray-600 text-[11px] mt-0.5">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}

export default function RawFeed({ items = [] }) {
  const [filter, setFilter] = useState('all');

  const filtered = items.filter((item) => {
    if (filter === 'appstore') return item.source === 'appstore';
    if (filter === 'reddit') return item.source === 'reddit';
    return true;
  });

  const pills = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'appstore', label: 'App Store', count: items.filter((i) => i.source === 'appstore').length },
    { key: 'reddit', label: 'Reddit', count: items.filter((i) => i.source === 'reddit').length },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      {/* Title row */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">
          Raw Feed — Real User Voices
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({items.length} items)
          </span>
        </h2>

        {/* Filter pills */}
        <div className="flex gap-2">
          {pills.map((pill) => (
            <button
              key={pill.key}
              id={`filter-${pill.key}`}
              onClick={() => setFilter(pill.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 ${
                filter === pill.key
                  ? 'bg-[#1DB954] border-[#1DB954] text-black'
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
              }`}
            >
              {pill.label}
              <span className="ml-1 opacity-60">{pill.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable feed */}
      <div
        className="space-y-3 overflow-y-auto pr-1"
        style={{
          maxHeight: '500px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#1DB954 #1a1a1a',
        }}
      >
        {filtered.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-10">
            No items for this filter.
          </p>
        ) : (
          filtered.map((item, idx) => (
            <FeedCard key={item.id || idx} item={item} />
          ))
        )}
      </div>
    </section>
  );
}
