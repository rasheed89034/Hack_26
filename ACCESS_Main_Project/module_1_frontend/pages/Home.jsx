import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OpportunityCard from '../components/OpportunityCard';
import {
    Search, Target, Lightbulb, TrendingUp, Trophy,
    ArrowRight, Sparkles
} from 'lucide-react';

export default function Home() {
    const { opportunities } = useApp();
    const previewOpportunities = opportunities.slice(0, 3);

    return (
        <div>
            {/* HERO SECTION */}
            <section id="home" className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 border border-[#E05305]/30 bg-[#E05305]/10 text-[#E05305] text-[11px] font-semibold px-3 py-1 rounded-full">
                        <Sparkles size={12} />
                        AI-powered opportunity matching
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
                        Find the <br />
                        opportunity. <br />
                        Build the <span className="italic font-serif font-normal text-[#E05305]">path</span> <br />
                        to reach it.
                    </h1>

                    <p className="text-sm md:text-base text-neutral-400 max-w-md font-normal leading-relaxed">
                        ACCESS uses AI to discover opportunities that fit you, explain where you stand, and show you what to do next.
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                        <Link to="/signup" className="bg-[#E05305] hover:bg-[#c84803] text-white text-xs font-semibold px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-[#E05305]/25">
                            Get Started
                            <ArrowRight size={14} />
                        </Link>
                        <a href="#how-it-works" className="border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-semibold px-6 py-3.5 rounded-full transition-all">
                            See How It Works
                        </a>
                    </div>
                </div>

                <div className="lg:col-span-5 relative flex justify-center py-8">
                    <div className="relative flex flex-col items-center gap-12">
                        <div className="absolute top-4 bottom-4 w-px bg-dashed border-r border-dashed border-neutral-800" />

                        <div className="relative flex items-center gap-4 z-10 w-full justify-start">
                            <div className="w-10 h-10 rounded-full border border-neutral-800 bg-[#0A0706] text-neutral-500 flex items-center justify-center font-mono text-xs">P</div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">PROFILE</span>
                            <div className="ml-auto bg-[#120E0C] border border-neutral-800 rounded-full px-3 py-1 text-[11px] text-neutral-200">94% Match</div>
                        </div>

                        <div className="relative flex items-center gap-4 z-10 w-full justify-start">
                            <div className="w-10 h-10 rounded-full border border-[#E05305] bg-[#0A0706] text-[#E05305] flex items-center justify-center font-mono text-xs font-bold">M</div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E05305]">MATCH</span>
                        </div>

                        <div className="relative flex items-center gap-4 z-10 w-full justify-start">
                            <div className="w-10 h-10 rounded-full border border-neutral-800 bg-[#0A0706] text-neutral-500 flex items-center justify-center font-mono text-xs">G</div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">GAP</span>
                            <div className="ml-auto bg-[#120E0C] border border-neutral-800 rounded-full px-3 py-1 text-[11px] text-neutral-200">3 gaps to close</div>
                        </div>

                        <div className="relative flex items-center gap-4 z-10 w-full justify-start">
                            <div className="w-10 h-10 rounded-full border border-neutral-800 bg-[#0A0706] text-neutral-500 flex items-center justify-center font-mono text-xs">P</div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">PATHWAY</span>
                        </div>

                        <div className="relative flex items-center gap-4 z-10 w-full justify-start">
                            <div className="w-10 h-10 rounded-full border border-[#E05305] bg-[#0A0706] text-[#E05305] flex items-center justify-center font-mono text-xs font-bold">O</div>
                            <div className="bg-[#120E0C] border border-neutral-800 rounded-full px-3 py-1 text-[11px] text-neutral-200">Pathway ready</div>
                        </div>

                        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 bg-[#120E0C] border border-neutral-800 rounded-full px-3 py-1 text-[10px] font-medium text-neutral-300">
                            AI powered
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-neutral-900">
                <div className="mb-12">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#E05305]">HOW IT WORKS</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
                        Opportunity is everywhere. <br />
                        <span className="text-[#E05305]">ACCESS</span> helps you <br />
                        <span className="text-[#E05305]">discover it.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-8 border-t border-neutral-900">
                    <div className="space-y-4">
                        <span className="text-4xl font-bold text-neutral-800">01</span>
                        <div className="w-8 h-8 rounded-full bg-[#E05305]/10 text-[#E05305] flex items-center justify-center"><Search size={14} /></div>
                        <h3 className="font-semibold text-sm">Discover</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">Find opportunities that match your goals and skills.</p>
                    </div>
                    <div className="space-y-4">
                        <span className="text-4xl font-bold text-neutral-800">02</span>
                        <div className="w-8 h-8 rounded-full bg-[#E05305]/10 text-[#E05305] flex items-center justify-center"><Target size={14} /></div>
                        <h3 className="font-semibold text-sm">Match</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">See how strongly your profile aligns — scored in real time.</p>
                    </div>
                    <div className="space-y-4">
                        <span className="text-4xl font-bold text-neutral-800">03</span>
                        <div className="w-8 h-8 rounded-full bg-[#E05305]/10 text-[#E05305] flex items-center justify-center"><Lightbulb size={14} /></div>
                        <h3 className="font-semibold text-sm">Understand</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">Learn exactly why you match and where your gaps are.</p>
                    </div>
                    <div className="space-y-4">
                        <span className="text-4xl font-bold text-neutral-800">04</span>
                        <div className="w-8 h-8 rounded-full bg-[#E05305]/10 text-[#E05305] flex items-center justify-center"><TrendingUp size={14} /></div>
                        <h3 className="font-semibold text-sm">Improve</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">Identify and close your highest-priority skill gaps.</p>
                    </div>
                    <div className="space-y-4">
                        <span className="text-4xl font-bold text-neutral-800">05</span>
                        <div className="w-8 h-8 rounded-full bg-[#E05305]/10 text-[#E05305] flex items-center justify-center"><Trophy size={14} /></div>
                        <h3 className="font-semibold text-sm">Access</h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">Follow your personalized pathway to the opportunity.</p>
                    </div>
                </div>
            </section>

            {/* OPPORTUNITIES PREVIEW SECTION */}
            <section id="opportunities" className="max-w-7xl mx-auto px-6 py-20 border-t border-neutral-900">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#E05305]">OPPORTUNITIES</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
                            Featured opportunities
                        </h2>
                        <p className="text-xs text-neutral-500 mt-2">Discover what's waiting for you</p>
                    </div>
                    <Link
                        to="/opportunities"
                        className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#E05305] hover:underline"
                    >
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {previewOpportunities.map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                </div>

                <div className="text-center mt-8 md:hidden">
                    <Link
                        to="/opportunities"
                        className="inline-flex items-center gap-2 bg-[#E05305] hover:bg-[#c84803] text-white text-xs font-semibold px-6 py-3 rounded-full transition-all"
                    >
                        View All Opportunities <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            {/* ABOUT & CTA SECTION */}
            <section id="about" className="max-w-7xl mx-auto px-6 py-20 border-t border-neutral-900">
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#E05305]/10 text-[#E05305] mb-6">
                        <Sparkles size={16} />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Your next opportunity <br />
                        starts with <span className="italic font-serif font-normal text-[#E05305]">access.</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-4 max-w-sm mx-auto">
                        Join thousands using ACCESS to discover, match, and reach opportunities they actually qualify for.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <Link to="/signup" className="bg-[#E05305] hover:bg-[#c84803] text-white text-xs font-semibold px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-[#E05305]/25">
                            Get Started
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}