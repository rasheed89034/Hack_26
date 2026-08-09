import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

function getScoreColor(score) {
    if (score >= 80) return { ring: '#22c55e', bg: 'bg-green-500/10', text: 'text-green-400', label: 'Strong Match' };
    if (score >= 60) return { ring: '#eab308', bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Good Match' };
    if (score >= 40) return { ring: '#E05305', bg: 'bg-[#E05305]/10', text: 'text-[#E05305]', label: 'Development Opportunity' };
    return { ring: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400', label: 'Low Match' };
}

export default function MatchScoreCard({ result }) {
    if (!result) return null;

    const score = result.match_score;
    const style = getScoreColor(score);

    /* SVG circular gauge */
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                <TrendingUp size={12} />
                Match Score
            </div>

            {/* Circular Gauge */}
            <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                        {/* Background ring */}
                        <circle cx="60" cy="60" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="8" />
                        {/* Score ring */}
                        <circle
                            cx="60" cy="60" r={radius}
                            fill="none"
                            stroke={style.ring}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{score}</span>
                        <span className="text-[9px] text-neutral-500 font-medium">/ 100</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                        <Sparkles size={10} />
                        {style.label}
                    </span>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                        {result.match_summary}
                    </p>
                </div>
            </div>

            {/* Key Drivers */}
            {result.key_drivers && result.key_drivers.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-800/60">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-600">Key Drivers</span>
                    <ul className="space-y-1">
                        {result.key_drivers.map((driver, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-neutral-400">
                                <span className="w-1 h-1 rounded-full bg-[#E05305] mt-1.5 flex-shrink-0" />
                                {driver}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
