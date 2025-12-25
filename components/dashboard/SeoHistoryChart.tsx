
import React, { useMemo } from 'react';

interface SEOChartProps {
    data: { date: string; score: number }[];
}

export default function SeoHistoryChart({ data }: SEOChartProps) {
    // Sort by date ascending
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);

    if (!sortedData || sortedData.length < 2) {
        return (
            <div className="h-32 flex items-center justify-center text-xs text-gray-400 font-mono border border-dashed border-gray-200 rounded-lg">
                Not enough history yet
            </div>
        );
    }

    // Chart Dimensions
    const width = 300;
    const height = 80;
    const padding = 5;

    // Scales
    const maxScore = 100;
    const minScore = Math.min(...sortedData.map(d => d.score), 50); // Floor at 50 to emphasize diffs

    const getX = (index: number) => (index / (sortedData.length - 1)) * (width - padding * 2) + padding;
    const getY = (score: number) => height - ((score - minScore) / (maxScore - minScore)) * (height - padding * 2) - padding;

    // Generate Path
    const points = sortedData.map((d, i) => `${getX(i)},${getY(d.score)}`).join(' ');

    // Fill Area Path (for gradient)
    const areaPath = `${points} L${width - padding},${height} L${padding},${height} Z`;

    return (
        <div className="w-full">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">30-Day Health Trend</h4>
            <div className="relative h-[80px] w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Gradient Defs */}
                    <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--terracotta)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--terracotta)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area Fill */}
                    <path d={areaPath} fill="url(#scoreGradient)" stroke="none" />

                    {/* Line */}
                    <path
                        d={`M${points}`}
                        fill="none"
                        stroke="var(--terracotta)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Dots */}
                    {sortedData.map((d, i) => (
                        <circle
                            key={i}
                            cx={getX(i)}
                            cy={getY(d.score)}
                            r="3"
                            className="fill-white stroke-[var(--terracotta)] stroke-2"
                        />
                    ))}
                </svg>
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-gray-400 font-mono">
                <span>{new Date(sortedData[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <span>{new Date(sortedData[sortedData.length - 1].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
        </div>
    );
}
