// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useApp } from '../context/AppContext';
// import ProfileCard from '../components/ProfileCard';
// import OpportunityCard from '../components/OpportunityCard';
// import MatchScoreCard from '../components/MatchScoreCard';
// import GapAnalysisCard from '../components/GapAnalysisCard';
// import PathwayTimeline from '../components/PathwayTimeline';
// import {
//     LayoutDashboard, ArrowRight, Sparkles, Settings,
//     BookOpen, Heart, TrendingUp, X, Check, User
// } from 'lucide-react';
// import VoiceMicButton from '../components/VoiceMicButton';

// export default function Dashboard() {
//     const { user } = useAuth();
//     const { profile, updateProfile, opportunities, refreshOpportunities, matchResult, gapResult, pathwayResult } = useApp();
//     const [isEditing, setIsEditing] = useState(!profile.major);
//     const [isScraping, setIsScraping] = useState(false);
//     const [editForm, setEditForm] = useState({
//         name: profile.name || '',
//         major: profile.major || '',
//         skills: profile.skills ? profile.skills.join(', ') : '',
//         interests: profile.interests ? profile.interests.join(', ') : '',
//         experience_level: profile.experience_level || 'beginner',
//     });

//     const handleSaveProfile = async () => {
//         const updatedProfile = {
//             name: editForm.name.trim(),
//             major: editForm.major.trim(),
//             skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
//             interests: editForm.interests.split(',').map(s => s.trim()).filter(Boolean),
//             experience_level: editForm.experience_level,
//         };
//         updateProfile(updatedProfile);
//         setIsEditing(false);
//         setIsScraping(true);

//         try {
//             const queryStr = `${updatedProfile.major} ${updatedProfile.skills.join(', ')} ${updatedProfile.interests.join(', ')}`;
//             await fetch('http://localhost:8000/api/v1/opportunities/rag_search', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ query: queryStr })
//             });
//             refreshOpportunities();
//         } catch (error) {
//             console.error("Failed to run RAG search:", error);
//         } finally {
//             setIsScraping(false);
//         }
//     };

//     const handleVoiceInput = async (text) => {
//         try {
//             const res = await fetch('http://localhost:8000/api/v1/voice-intent', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ transcribed_text: text })
//             });
//             const data = await res.json();

//             setEditForm(prev => {
//                 const newSkills = data.current_skills || [];
//                 const newInterests = data.target_goals || [];

//                 const existingSkills = prev.skills ? prev.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
//                 const existingInterests = prev.interests ? prev.interests.split(',').map(s => s.trim()).filter(Boolean) : [];

//                 const combinedSkills = [...new Set([...existingSkills, ...newSkills])].join(', ');
//                 const combinedInterests = [...new Set([...existingInterests, ...newInterests])].join(', ');

//                 return {
//                     ...prev,
//                     name: data.name || prev.name,
//                     major: data.major || prev.major,
//                     experience_level: data.experience_level || prev.experience_level,
//                     skills: combinedSkills,
//                     interests: combinedInterests
//                 };
//             });
//         } catch (err) {
//             console.error("Voice intent error:", err);
//         }
//     };

//     const recentOpportunities = opportunities.slice(0, 3);

//     return (
//         <div className="max-w-7xl mx-auto px-6 py-10">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-8">
//                 <div>
//                     <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#E05305] mb-1">
//                         <LayoutDashboard size={12} />
//                         Dashboard
//                     </div>
//                     <h1 className="text-3xl font-bold tracking-tight">
//                         Welcome back, <span className="text-[#E05305]">{profile.name || user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
//                     </h1>
//                     <p className="text-xs text-neutral-500 mt-1">Here's your opportunity overview</p>
//                 </div>
//             </div>

//             <div className="grid lg:grid-cols-12 gap-6">
//                 {/* Left Column — Profile */}
//                 <div className="lg:col-span-4 space-y-6">
//                     {isEditing ? (
//                         /* Profile Edit Form */
//                         <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-6 space-y-4">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <h3 className="text-sm font-semibold text-white flex items-center gap-2">
//                                         <Settings size={14} />
//                                         Setup Your Profile
//                                     </h3>
//                                     <VoiceMicButton onTranscript={handleVoiceInput} />
//                                 </div>
//                                 {profile.major && (
//                                     <button onClick={() => setIsEditing(false)} className="text-neutral-500 hover:text-white">
//                                         <X size={16} />
//                                     </button>
//                                 )}
//                             </div>

//                             <div className="space-y-3">
//                                 <div>
//                                     <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
//                                         <User size={10} className="inline mr-1" />
//                                         Full Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={editForm.name}
//                                         onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                                         placeholder="e.g. John Doe"
//                                         className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
//                                         <BookOpen size={10} className="inline mr-1" />
//                                         Major / Field
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={editForm.major}
//                                         onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
//                                         placeholder="e.g. Computer Science"
//                                         className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
//                                         <TrendingUp size={10} className="inline mr-1" />
//                                         Skills (comma separated)
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={editForm.skills}
//                                         onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
//                                         placeholder="e.g. Python, React, SQL"
//                                         className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
//                                         <Heart size={10} className="inline mr-1" />
//                                         Interests (comma separated)
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={editForm.interests}
//                                         onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
//                                         placeholder="e.g. AI, Web Dev, Cloud"
//                                         className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
//                                         Experience Level
//                                     </label>
//                                     <select
//                                         value={editForm.experience_level}
//                                         onChange={(e) => setEditForm({ ...editForm, experience_level: e.target.value })}
//                                         className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E05305] transition-colors"
//                                     >
//                                         <option value="beginner">Beginner</option>
//                                         <option value="intermediate">Intermediate</option>
//                                         <option value="advanced">Advanced</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleSaveProfile}
//                                 className="w-full bg-[#ff5a1f] hover:bg-[#e04814] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                                 disabled={isScraping}
//                             >
//                                 {isScraping ? (
//                                     <>
//                                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                                         🤖 AI is hunting for jobs...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                                         </svg>
//                                         Save Profile & Search
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     ) : (
//                         <ProfileCard profile={profile} user={user} onEdit={() => setIsEditing(true)} />
//                     )}

//                     {/* Quick Tip */}
//                     <div className="bg-[#E05305]/5 border border-[#E05305]/20 rounded-2xl p-4">
//                         <div className="flex items-start gap-3">
//                             <Sparkles size={16} className="text-[#E05305] mt-0.5 flex-shrink-0" />
//                             <div>
//                                 <h4 className="text-xs font-semibold text-white mb-1">Tip</h4>
//                                 <p className="text-[11px] text-neutral-400 leading-relaxed">
//                                     Complete your profile to get better AI matching results. Add your skills and interests for personalized recommendations.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Column — Opportunities & Results */}
//                 <div className="lg:col-span-8 space-y-6">
//                     {/* Recent Opportunities */}
//                     <div>
//                         <div className="flex items-center justify-between mb-4">
//                             <h2 className="text-sm font-semibold text-white">Recommended Opportunities</h2>
//                             <Link
//                                 to="/opportunities"
//                                 className="flex items-center gap-1 text-[11px] font-medium text-[#E05305] hover:underline"
//                             >
//                                 View All <ArrowRight size={12} />
//                             </Link>
//                         </div>
//                         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
//                             {recentOpportunities.map((opp) => (
//                                 <OpportunityCard key={opp.id} opportunity={opp} />
//                             ))}
//                         </div>
//                     </div>

//                     {/* AI Results */}
//                     {(matchResult || gapResult || pathwayResult) && (
//                         <div className="space-y-4">
//                             <h2 className="text-sm font-semibold text-white">Latest AI Analysis</h2>
//                             {matchResult && <MatchScoreCard result={matchResult} />}
//                             {gapResult && <GapAnalysisCard result={gapResult} />}
//                             {pathwayResult && <PathwayTimeline result={pathwayResult} />}
//                         </div>
//                     )}

//                     {/* Empty state when no results */}
//                     {!matchResult && !gapResult && !pathwayResult && (
//                         <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-8 text-center">
//                             <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4">
//                                 <Sparkles size={20} className="text-neutral-600" />
//                             </div>
//                             <h3 className="text-sm font-semibold text-white mb-1">No AI results yet</h3>
//                             <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
//                                 Click on an opportunity and run Match, Gap Analysis, or Pathway to see your AI-powered insights here.
//                             </p>
//                             <Link
//                                 to="/opportunities"
//                                 className="inline-flex items-center gap-2 mt-4 bg-[#E05305] hover:bg-[#c84803] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all"
//                             >
//                                 Browse Opportunities <ArrowRight size={14} />
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }





import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import ProfileCard from '../components/ProfileCard';
import OpportunityCard from '../components/OpportunityCard';
import MatchScoreCard from '../components/MatchScoreCard';
import GapAnalysisCard from '../components/GapAnalysisCard';
import PathwayTimeline from '../components/PathwayTimeline';
import {
    LayoutDashboard, ArrowRight, Sparkles, Settings,
    BookOpen, Heart, TrendingUp, X, User
} from 'lucide-react';
import VoiceMicButton from '../components/VoiceMicButton';

export default function Dashboard() {
    const { user } = useAuth();
    const { profile, updateProfile, opportunities, refreshOpportunities, scrapeAndRefresh, matchResult, gapResult, pathwayResult } = useApp();
    const [isEditing, setIsEditing] = useState(!profile.major);
    const [isScraping, setIsScraping] = useState(false);
    const [editForm, setEditForm] = useState({
        name: profile.name || '',
        major: profile.major || '',
        skills: profile.skills ? profile.skills.join(', ') : '',
        interests: profile.interests ? profile.interests.join(', ') : '',
        experience_level: profile.experience_level || 'beginner',
    });

    const handleSaveProfile = async () => {
        const updatedProfile = {
            name: editForm.name.trim(),
            major: editForm.major.trim(),
            skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
            interests: editForm.interests.split(',').map(s => s.trim()).filter(Boolean),
            experience_level: editForm.experience_level,
        };
        updateProfile(updatedProfile);
        setIsEditing(false);
        setIsScraping(true);

        try {
            const queryStr = `${updatedProfile.major} ${updatedProfile.skills.join(' ')} ${updatedProfile.interests.join(' ')}`;
            await scrapeAndRefresh(queryStr);
        } catch (error) {
            console.error("Failed to run scrape:", error);
            refreshOpportunities();
        } finally {
            setIsScraping(false);
        }
    };

    const handleVoiceInput = async (text) => {
        try {
            const res = await fetch('/api/v1/voice-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcribed_text: text })
            });
            const data = await res.json();

            setEditForm(prev => {
                const newSkills = data.current_skills || [];
                const newInterests = data.target_goals || [];

                const existingSkills = prev.skills ? prev.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
                const existingInterests = prev.interests ? prev.interests.split(',').map(s => s.trim()).filter(Boolean) : [];

                const combinedSkills = [...new Set([...existingSkills, ...newSkills])].join(', ');
                const combinedInterests = [...new Set([...existingInterests, ...newInterests])].join(', ');

                return {
                    ...prev,
                    name: data.name || prev.name,
                    major: data.major || prev.major,
                    experience_level: data.experience_level || prev.experience_level,
                    skills: combinedSkills,
                    interests: combinedInterests
                };
            });
        } catch (err) {
            console.error("Voice intent error:", err);
        }
    };

    // YAHAN NAYA REAL-TIME SCRAPING FUNCTION ADD KIYA GAYA HAI
    const handleBrowseOpportunities = async () => {
        setIsScraping(true);
        try {
            await scrapeAndRefresh();
        } catch (error) {
            console.error("Error triggering scraper:", error);
        } finally {
            setIsScraping(false);
        }
    };

    // const recentOpportunities = opportunities.slice(0, 3);
    const recentOpportunities = [...opportunities].reverse().slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#E05305] mb-1">
                        <LayoutDashboard size={12} />
                        Dashboard
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, <span className="text-[#E05305]">{profile.name || user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">Here's your opportunity overview</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Column — Profile */}
                <div className="lg:col-span-4 space-y-6">
                    {isEditing ? (
                        /* Profile Edit Form */
                        <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Settings size={14} />
                                        Setup Your Profile
                                    </h3>
                                    <VoiceMicButton onTranscript={handleVoiceInput} />
                                </div>
                                {profile.major && (
                                    <button onClick={() => setIsEditing(false)} className="text-neutral-500 hover:text-white">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                                        <User size={10} className="inline mr-1" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                                        <BookOpen size={10} className="inline mr-1" />
                                        Major / Field
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.major}
                                        onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                                        placeholder="e.g. Computer Science"
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                                        <TrendingUp size={10} className="inline mr-1" />
                                        Skills (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.skills}
                                        onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                                        placeholder="e.g. Python, React, SQL"
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                                        <Heart size={10} className="inline mr-1" />
                                        Interests (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.interests}
                                        onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                                        placeholder="e.g. AI, Web Dev, Cloud"
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
                                        Experience Level
                                    </label>
                                    <select
                                        value={editForm.experience_level}
                                        onChange={(e) => setEditForm({ ...editForm, experience_level: e.target.value })}
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E05305] transition-colors"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                className="w-full bg-[#ff5a1f] hover:bg-[#e04814] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={isScraping}
                            >
                                {isScraping ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        🤖 AI is hunting for jobs...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Profile & Search
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <ProfileCard profile={profile} user={user} onEdit={() => setIsEditing(true)} />
                    )}

                    {/* Quick Tip */}
                    <div className="bg-[#E05305]/5 border border-[#E05305]/20 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles size={16} className="text-[#E05305] mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-xs font-semibold text-white mb-1">Tip</h4>
                                <p className="text-[11px] text-neutral-400 leading-relaxed">
                                    Complete your profile to get better AI matching results. Add your skills and interests for personalized recommendations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column — Opportunities & Results */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Recent Opportunities */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-white">Recommended Opportunities</h2>
                            <Link
                                to="/opportunities"
                                className="flex items-center gap-1 text-[11px] font-medium text-[#E05305] hover:underline"
                            >
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {recentOpportunities.map((opp) => (
                                <OpportunityCard key={opp.id} opportunity={opp} />
                            ))}
                        </div>
                    </div>

                    {/* AI Results */}
                    {(matchResult || gapResult || pathwayResult) && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold text-white">Latest AI Analysis</h2>
                            {matchResult && <MatchScoreCard result={matchResult} />}
                            {gapResult && <GapAnalysisCard result={gapResult} />}
                            {pathwayResult && <PathwayTimeline result={pathwayResult} />}
                        </div>
                    )}

                    {/* Empty state when no results WITH NEW BUTTON */}
                    {!matchResult && !gapResult && !pathwayResult && (
                        <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={20} className="text-neutral-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-1">No AI results yet</h3>
                            <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                                Click on an opportunity and run Match, Gap Analysis, or Pathway to see your AI-powered insights here.
                            </p>
                            <button
                                onClick={handleBrowseOpportunities}
                                disabled={isScraping}
                                className="inline-flex items-center justify-center gap-2 mt-4 bg-[#E05305] hover:bg-[#c84803] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all"
                            >
                                {isScraping ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Searching Real-Time...
                                    </>
                                ) : (
                                    <>
                                        Browse Real-Time Opportunities <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
