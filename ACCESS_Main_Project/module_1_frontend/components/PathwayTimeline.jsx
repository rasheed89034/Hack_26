import React, { useState } from 'react';
import { Map, ChevronDown, ChevronUp, BookOpen, Wrench, ExternalLink } from 'lucide-react';

export default function PathwayTimeline({ result }) {
    if (!result) return null;

    const weeks = result.timeline || [];
    const [expandedWeek, setExpandedWeek] = useState(0);

    return (
        <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                    <Map size={12} />
                    Learning Pathway
                </div>
                <span className="text-[10px] font-medium text-neutral-400">
                    {weeks.length} week{weeks.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Learning Tone */}
            {result.learning_tone && (
                <p className="text-[11px] text-neutral-500 italic">"{result.learning_tone}"</p>
            )}

            {/* Timeline */}
            <div className="relative space-y-0">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-neutral-800" />

                {weeks.map((week, i) => {
                    const isExpanded = expandedWeek === i;
                    return (
                        <div key={i} className="relative pl-10">
                            {/* Dot */}
                            <div className={`absolute left-[10px] top-3 w-3 h-3 rounded-full border-2 transition-colors ${
                                isExpanded
                                    ? 'bg-[#E05305] border-[#E05305]'
                                    : 'bg-[#0A0706] border-neutral-700'
                            }`} />

                            <button
                                onClick={() => setExpandedWeek(isExpanded ? -1 : i)}
                                className="w-full text-left py-3 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-[#E05305] uppercase tracking-widest">
                                            Week {week.week}
                                        </span>
                                        <h4 className="text-xs font-semibold text-white mt-0.5 group-hover:text-[#E05305] transition-colors">
                                            {week.focus}
                                        </h4>
                                    </div>
                                    {isExpanded
                                        ? <ChevronUp size={14} className="text-neutral-500" />
                                        : <ChevronDown size={14} className="text-neutral-500" />
                                    }
                                </div>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="pb-4 space-y-3 animate-in slide-in-from-top-1">
                                    {/* Objectives */}
                                    {week.objectives?.length > 0 && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-neutral-600">
                                                <BookOpen size={10} />
                                                Objectives
                                            </div>
                                            <ul className="space-y-1">
                                                {week.objectives.map((obj, j) => (
                                                    <li key={j} className="flex items-start gap-2 text-[11px] text-neutral-400">
                                                        <span className="w-1 h-1 rounded-full bg-[#E05305] mt-1.5 flex-shrink-0" />
                                                        {obj}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {week.actions?.length > 0 && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-neutral-600">
                                                <Wrench size={10} />
                                                Actions
                                            </div>
                                            <ul className="space-y-1">
                                                {week.actions.map((action, j) => (
                                                    <li key={j} className="flex items-start gap-2 text-[11px] text-neutral-300">
                                                        <span className="text-[#E05305] flex-shrink-0">→</span>
                                                        {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Resources */}
                                    {week.resources?.length > 0 && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-neutral-600">
                                                <ExternalLink size={10} />
                                                Resources
                                            </div>
                                            <ul className="space-y-1">
                                                {week.resources.map((res, j) => (
                                                    <li key={j} className="text-[11px] text-blue-400">
                                                        {res}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
