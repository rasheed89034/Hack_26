import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';

export default function GapAnalysisCard({ result }) {
    if (!result) return null;

    const skills = result.missing_skills || [];

    return (
        <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                    <AlertTriangle size={12} />
                    Gap Analysis
                </div>
                <span className="text-[10px] font-semibold text-[#E05305] bg-[#E05305]/10 px-2.5 py-1 rounded-full">
                    {skills.length} gap{skills.length !== 1 ? 's' : ''} found
                </span>
            </div>

            {/* Priority Gaps */}
            {result.priority_gaps && result.priority_gaps.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {result.priority_gaps.map((gap, i) => (
                        <span key={i} className="bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-semibold px-2.5 py-1 rounded-full">
                            ⚡ {gap}
                        </span>
                    ))}
                </div>
            )}

            {/* Missing Skills List */}
            <div className="space-y-2">
                {skills.map((item, i) => (
                    <div
                        key={i}
                        className="group bg-neutral-900/50 border border-neutral-800/60 rounded-xl p-3.5 hover:border-neutral-700 transition-colors"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <ChevronRight size={12} className="text-[#E05305] flex-shrink-0" />
                            <span className="text-xs font-semibold text-white">{item.skill}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-relaxed pl-5">
                            {item.explanation}
                        </p>
                    </div>
                ))}
            </div>

            {/* Confidence */}
            {result.confidence && (
                <p className="text-[10px] text-neutral-600 text-right">
                    Confidence: <span className="text-neutral-400">{result.confidence}</span>
                </p>
            )}
        </div>
    );
}
