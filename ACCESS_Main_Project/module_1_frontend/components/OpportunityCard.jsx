import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ExternalLink } from 'lucide-react';

const CATEGORY_COLORS = {
    Internship: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Fellowship: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Hackathon: 'bg-green-500/10 text-green-400 border-green-500/20',
    Scholarship: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function OpportunityCard({ opportunity }) {
    const colorClass = CATEGORY_COLORS[opportunity.category] || 'bg-neutral-800 text-neutral-300 border-neutral-700';

    return (
        <Link
            to={`/opportunity/${opportunity.id}`}
            className="group block bg-[#120E0C] border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-black/20"
        >
            <div className="flex items-start justify-between mb-3">
                {/* Category Badge */}
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}>
                    {opportunity.category}
                </span>

                {/* Duration */}
                {opportunity.duration_weeks && (
                    <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                        <Clock size={10} />
                        {opportunity.duration_weeks}w
                    </div>
                )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm text-white mb-2 group-hover:text-[#E05305] transition-colors">
                {opportunity.title}
            </h3>

            {/* Company */}
            {opportunity.company && (
                <p className="text-[10px] text-neutral-600 mb-1 font-medium">{opportunity.company}</p>
            )}

            {/* Description */}
            <p className="text-[11px] text-neutral-500 leading-relaxed mb-4 line-clamp-2">
                {opportunity.description}
            </p>

            {/* Requirements */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {opportunity.requirements.slice(0, 3).map((req) => (
                    <span
                        key={req}
                        className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-[9px] font-medium px-2 py-0.5 rounded-full"
                    >
                        {req}
                    </span>
                ))}
                {opportunity.requirements.length > 3 && (
                    <span className="text-[9px] text-neutral-600 px-1">
                        +{opportunity.requirements.length - 3} more
                    </span>
                )}
            </div>

            {/* Footer: View Details + Apply */}
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#E05305]">
                    View Details
                    <ArrowRight size={12} />
                </div>

                {/* Apply button — stops card navigation, opens URL directly */}
                {opportunity.apply_url && (
                    <a
                        href={opportunity.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 bg-[#E05305]/10 hover:bg-[#E05305] border border-[#E05305]/30 hover:border-[#E05305] text-[#E05305] hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-all"
                        title={opportunity.apply_url}
                    >
                        <ExternalLink size={10} />
                        Apply
                    </a>
                )}
            </div>
        </Link>
    );
}
