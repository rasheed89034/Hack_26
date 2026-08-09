import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { matchOpportunity, analyzeGap, generatePathway } from '../services/api';
import useApi from '../hooks/useApi';
import MatchScoreCard from '../components/MatchScoreCard';
import GapAnalysisCard from '../components/GapAnalysisCard';
import PathwayTimeline from '../components/PathwayTimeline';
import {
    ArrowLeft, Clock, Tag, Target, AlertTriangle,
    Map, Loader2, Sparkles, ExternalLink
} from 'lucide-react';

export default function OpportunityDetail() {
    const { id } = useParams();
    const { getOpportunityById, profile, setMatchResult, setGapResult, setPathwayResult } = useApp();

    const opportunity = getOpportunityById(id);

    const matchApi = useApi(matchOpportunity);
    const gapApi = useApi(analyzeGap);
    const pathwayApi = useApi(generatePathway);

    if (!opportunity) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-xl font-bold mb-2">Opportunity not found</h2>
                <p className="text-xs text-neutral-500 mb-6">The opportunity you're looking for doesn't exist.</p>
                <Link to="/opportunities" className="text-[#E05305] text-xs font-medium hover:underline">
                    ← Back to Opportunities
                </Link>
            </div>
        );
    }

    const userProfile = {
        major: profile.major,
        skills: profile.skills,
        interests: profile.interests,
        experience_level: profile.experience_level,
    };

    const oppDetails = {
        title: opportunity.title,
        description: opportunity.description,
        requirements: opportunity.requirements,
        category: opportunity.category,
        duration_weeks: opportunity.duration_weeks,
    };

    const handleMatch = async () => {
        try {
            const result = await matchApi.execute(userProfile, oppDetails);
            setMatchResult(result);
        } catch (err) {
            console.error('Match failed:', err);
        }
    };

    const handleGap = async () => {
        try {
            const result = await gapApi.execute(userProfile, oppDetails);
            setGapResult(result);
        } catch (err) {
            console.error('Gap analysis failed:', err);
        }
    };

    const handlePathway = async () => {
        if (!gapApi.data?.missing_skills?.length) {
            alert('Run Gap Analysis first to identify missing skills.');
            return;
        }
        try {
            const result = await pathwayApi.execute(
                gapApi.data.missing_skills,
                opportunity.duration_weeks || 4
            );
            setPathwayResult(result);
        } catch (err) {
            console.error('Pathway generation failed:', err);
        }
    };

    const profileIncomplete = !profile.major || profile.skills.length === 0;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Back Link */}
            <Link
                to="/opportunities"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={14} />
                Back to Opportunities
            </Link>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left — Details */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Category & Duration */}
                    <div className="flex items-center gap-3">
                        <span className="bg-[#E05305]/10 border border-[#E05305]/20 text-[#E05305] text-[10px] font-semibold px-3 py-1 rounded-full">
                            {opportunity.category}
                        </span>
                        {opportunity.duration_weeks && (
                            <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                                <Clock size={12} />
                                {opportunity.duration_weeks} weeks
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{opportunity.title}</h1>

                    {/* Description */}
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        {opportunity.description}
                    </p>

                    {/* Requirements */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Requirements</h3>
                        <div className="flex flex-wrap gap-2">
                            {opportunity.requirements.map((req) => (
                                <span
                                    key={req}
                                    className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px] font-medium px-3 py-1.5 rounded-full"
                                >
                                    {req}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Profile Warning */}
                    {profileIncomplete && (
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                            <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-xs font-semibold text-amber-400 mb-1">Complete your profile first</h4>
                                <p className="text-[11px] text-neutral-400">
                                    Add your major and skills in the{' '}
                                    <Link to="/dashboard" className="text-[#E05305] hover:underline">Dashboard</Link>
                                    {' '}to get accurate AI analysis.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Apply Button */}
                    <div className="pt-2">
                        {opportunity.apply_url ? (
                            <a
                                href={opportunity.apply_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E05305] to-[#f06a1a] hover:from-[#c84803] hover:to-[#d95e10] text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-[#E05305]/30 hover:shadow-[#E05305]/50 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <ExternalLink size={15} />
                                Apply Now
                            </a>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-xs text-neutral-500 border border-neutral-800 px-5 py-3 rounded-full">
                                No apply link available
                            </span>
                        )}
                    </div>

                    {/* AI Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleMatch}
                            disabled={matchApi.loading || profileIncomplete}
                            className="bg-[#E05305] hover:bg-[#c84803] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-3 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-[#E05305]/20"
                        >
                            {matchApi.loading ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
                            Run Match
                        </button>
                        <button
                            onClick={handleGap}
                            disabled={gapApi.loading || profileIncomplete}
                            className="border border-neutral-800 hover:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 hover:text-white text-xs font-semibold px-5 py-3 rounded-full transition-all flex items-center gap-2"
                        >
                            {gapApi.loading ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                            Analyze Gaps
                        </button>
                        <button
                            onClick={handlePathway}
                            disabled={pathwayApi.loading || !gapApi.data?.missing_skills?.length}
                            className="border border-neutral-800 hover:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 hover:text-white text-xs font-semibold px-5 py-3 rounded-full transition-all flex items-center gap-2"
                        >
                            {pathwayApi.loading ? <Loader2 size={14} className="animate-spin" /> : <Map size={14} />}
                            Generate Pathway
                        </button>
                    </div>

                    {/* Error Messages */}
                    {(matchApi.error || gapApi.error || pathwayApi.error) && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                            <p className="text-[11px] text-red-400">
                                {matchApi.error || gapApi.error || pathwayApi.error}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right — AI Results */}
                <div className="lg:col-span-5 space-y-4">
                    {matchApi.data && <MatchScoreCard result={matchApi.data} />}
                    {gapApi.data && <GapAnalysisCard result={gapApi.data} />}
                    {pathwayApi.data && <PathwayTimeline result={pathwayApi.data} />}

                    {!matchApi.data && !gapApi.data && !pathwayApi.data && (
                        <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={20} className="text-neutral-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-1">AI Analysis</h3>
                            <p className="text-[11px] text-neutral-500">
                                Click the buttons on the left to run AI-powered analysis on this opportunity.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
