const ALLOCATIONS = [
  { name: 'Community', percent: 40, tokens: '400,000', color: '#f59e0b' },
  { name: 'Co-founders', percent: 30, tokens: '300,000', color: '#3b82f6' },
  { name: 'Liquidity & Pre-sale', percent: 20, tokens: '200,000', color: '#22c55e' },
  { name: 'Early Supporters', percent: 5, tokens: '50,000', color: '#8b5cf6' },
  { name: 'Reserve', percent: 5, tokens: '50,000', color: '#ef4444' },
];

function DonutChart() {
  const total = ALLOCATIONS.reduce((sum, a) => sum + a.percent, 0);
  let cumulative = 0;

  const segments = ALLOCATIONS.map((alloc) => {
    const start = (cumulative / total) * 360;
    cumulative += alloc.percent;
    const end = (cumulative / total) * 360;
    const startRad = ((start - 90) * Math.PI) / 180;
    const endRad = ((end - 90) * Math.PI) / 180;
    const largeArc = end - start > 180 ? 1 : 0;

    const outerR = 45;
    const innerR = 28;

    const ox1 = 50 + outerR * Math.cos(startRad);
    const oy1 = 50 + outerR * Math.sin(startRad);
    const ox2 = 50 + outerR * Math.cos(endRad);
    const oy2 = 50 + outerR * Math.sin(endRad);
    const ix1 = 50 + innerR * Math.cos(endRad);
    const iy1 = 50 + innerR * Math.sin(endRad);
    const ix2 = 50 + innerR * Math.cos(startRad);
    const iy2 = 50 + innerR * Math.sin(startRad);

    return (
      <path
        key={alloc.name}
        d={`M ${ox1} ${oy1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`}
        fill={alloc.color}
        stroke="#0a0a0a"
        strokeWidth="0.5"
      />
    );
  });

  return (
    <svg viewBox="0 0 100 100" className="w-48 h-48 sm:w-56 sm:h-56">
      {segments}
      <text
        x="50"
        y="48"
        textAnchor="middle"
        className="fill-white text-[7px] font-bold"
      >
        1M
      </text>
      <text
        x="50"
        y="56"
        textAnchor="middle"
        className="fill-zinc-500 text-[4px]"
      >
        $MIND
      </text>
    </svg>
  );
}

function HorizontalBar() {
  return (
    <div className="w-full h-4 rounded-full overflow-hidden flex">
      {ALLOCATIONS.map((alloc) => (
        <div
          key={alloc.name}
          className="h-full transition-all duration-500"
          style={{
            width: `${alloc.percent}%`,
            backgroundColor: alloc.color,
          }}
          title={`${alloc.name}: ${alloc.percent}%`}
        />
      ))}
    </div>
  );
}

export default function SupplyBreakdown() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-6">
        Token Allocation
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Donut chart */}
        <div className="flex-shrink-0">
          <DonutChart />
        </div>

        {/* Legend + horizontal bar */}
        <div className="flex-1 w-full space-y-5">
          <HorizontalBar />

          <div className="space-y-3">
            {ALLOCATIONS.map((alloc) => (
              <div
                key={alloc.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: alloc.color }}
                  />
                  <span className="text-white text-sm">{alloc.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-xs font-mono">
                    {alloc.tokens}
                  </span>
                  <span className="text-amber-500 font-semibold text-sm font-mono w-12 text-right">
                    {alloc.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
