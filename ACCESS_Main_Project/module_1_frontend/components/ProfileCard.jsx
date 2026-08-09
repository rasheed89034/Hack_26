import React from 'react';
import { User, BookOpen, Heart, TrendingUp } from 'lucide-react';

export default function ProfileCard({ profile, user, onEdit }) {
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    return (
        <div className="bg-[#120E0C] border border-neutral-800 rounded-2xl p-6 space-y-5">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E05305]/15 border border-[#E05305]/30 flex items-center justify-center">
                    <User size={20} className="text-[#E05305]" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-white">{displayName}</h3>
                    <p className="text-[11px] text-neutral-500">{user?.email}</p>
                </div>
            </div>

            {/* Major */}
            {profile.major && (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                        <BookOpen size={12} />
                        Major
                    </div>
                    <p className="text-xs text-neutral-300">{profile.major}</p>
                </div>
            )}

            {/* Skills */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                    <TrendingUp size={12} />
                    Skills
                </div>
                {profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {profile.skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-[#E05305]/10 border border-[#E05305]/20 text-[#E05305] text-[10px] font-medium px-2.5 py-1 rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-[11px] text-neutral-600 italic">No skills added yet</p>
                )}
            </div>

            {/* Interests */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                    <Heart size={12} />
                    Interests
                </div>
                {profile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {profile.interests.map((interest) => (
                            <span
                                key={interest}
                                className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-medium px-2.5 py-1 rounded-full"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-[11px] text-neutral-600 italic">No interests added yet</p>
                )}
            </div>

            {/* Edit Button */}
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="w-full border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-[11px] font-medium py-2.5 rounded-lg transition-colors"
                >
                    Edit Profile
                </button>
            )}
        </div>
    );
}
