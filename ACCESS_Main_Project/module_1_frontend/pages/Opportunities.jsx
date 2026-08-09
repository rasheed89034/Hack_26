import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import OpportunityCard from '../components/OpportunityCard';
import { Search, Filter, RefreshCw, Loader2, Zap } from 'lucide-react';

const CATEGORIES = ['All', 'Internship', 'Fellowship', 'Hackathon', 'Scholarship'];

export default function Opportunities() {
    const { opportunities, isLoading, isScraping, scrapeAndRefresh, refreshOpportunities } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [scrapeMsg, setScrapeMsg] = useState('');

    const filtered = opportunities.filter((opp) => {
        const matchesSearch =
            opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleFetchFresh = async () => {
        setScrapeMsg('');
        try {
            const result = await scrapeAndRefresh();
            setScrapeMsg(result?.message || 'Opportunities refreshed!');
        } catch {
            setScrapeMsg('Could not fetch new opportunities. Is the backend running?');
        }
        setTimeout(() => setScrapeMsg(''), 5000);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
                <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#E05305]">DISCOVER</span>
                    <h1 className="text-3xl font-bold tracking-tight mt-1">Opportunities</h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        {isLoading
                            ? 'Loading...'
                            : `Showing ${filtered.length} of ${opportunities.length} opportunities`}
                    </p>
                </div>

                {/* Fetch Fresh Button */}
                <div className="flex flex-col items-end gap-2">
                    <button
                        id="fetch-fresh-btn"
                        onClick={handleFetchFresh}
                        disabled={isScraping || isLoading}
                        className="flex items-center gap-2 bg-[#E05305] hover:bg-[#c84803] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-3 rounded-full transition-all shadow-lg shadow-[#E05305]/20 hover:shadow-[#E05305]/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isScraping ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Fetching from web...
                            </>
                        ) : (
                            <>
                                <Zap size={14} />
                                Fetch Fresh Opportunities
                            </>
                        )}
                    </button>
                    <button
                        id="refresh-btn"
                        onClick={refreshOpportunities}
                        disabled={isLoading || isScraping}
                        className="flex items-center gap-1.5 text-[10px] text-neutral-500 hover:text-white transition-colors disabled:opacity-40"
                    >
                        <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} />
                        Refresh list
                    </button>
                    {scrapeMsg && (
                        <p className="text-[10px] text-[#E05305] max-w-[220px] text-right">{scrapeMsg}</p>
                    )}
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, skill, or keyword..."
                        className="w-full bg-[#120E0C] border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-neutral-500 flex-shrink-0" />
                    <div className="flex gap-1.5 overflow-x-auto">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`text-[10px] font-semibold px-3.5 py-2 rounded-full border whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-[#E05305] border-[#E05305] text-white'
                                        : 'border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scraping banner */}
            {isScraping && (
                <div className="mb-6 bg-[#E05305]/5 border border-[#E05305]/20 rounded-xl px-5 py-3.5 flex items-center gap-3">
                    <Loader2 size={14} className="animate-spin text-[#E05305] flex-shrink-0" />
                    <p className="text-xs text-[#E05305] font-medium">
                        🤖 AI is scraping real-time opportunities from LinkedIn, Internshala, Devpost &amp; more...
                    </p>
                </div>
            )}

            {/* Results */}
            {isLoading && !isScraping ? (
                /* Loading skeleton */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-5 space-y-3 animate-pulse">
                            <div className="h-3 bg-neutral-800 rounded w-1/3" />
                            <div className="h-5 bg-neutral-800 rounded w-3/4" />
                            <div className="h-3 bg-neutral-800 rounded w-full" />
                            <div className="h-3 bg-neutral-800 rounded w-5/6" />
                            <div className="flex gap-2 pt-1">
                                <div className="h-5 bg-neutral-800 rounded-full w-14" />
                                <div className="h-5 bg-neutral-800 rounded-full w-14" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4">
                        <Search size={20} className="text-neutral-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">No opportunities found</h3>
                    <p className="text-[11px] text-neutral-500 mb-5">
                        {searchQuery || selectedCategory !== 'All'
                            ? 'Try adjusting your search or filters'
                            : 'Click "Fetch Fresh Opportunities" to load real-time data'}
                    </p>
                    {!searchQuery && selectedCategory === 'All' && (
                        <button
                            onClick={handleFetchFresh}
                            disabled={isScraping}
                            className="inline-flex items-center gap-2 bg-[#E05305] hover:bg-[#c84803] disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all"
                        >
                            <Zap size={13} />
                            Fetch Fresh Opportunities
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
