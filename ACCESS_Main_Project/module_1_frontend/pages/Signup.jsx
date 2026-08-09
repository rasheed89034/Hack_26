import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import VoiceMicButton from '../components/VoiceMicButton';

export default function Signup() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, { full_name: fullName });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-sm text-center">
                <div className="inline-flex items-center gap-2 bg-[#E05305] text-white text-xs font-semibold px-3 py-1 rounded-md mb-6">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ACCESS
                </div>

                <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                <p className="text-xs text-neutral-400 mb-8">Start finding opportunities that match you</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 mb-6 text-left">
                        <p className="text-[11px] text-red-400">{error}</p>
                    </div>
                )}

                <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-neutral-300">Full name</label>
                            <VoiceMicButton onTranscript={setFullName} />
                        </div>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Alex Chen" className="w-full bg-[#120E0C] border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors" required />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-neutral-300">Email</label>
                            <VoiceMicButton onTranscript={setEmail} />
                        </div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.edu" className="w-full bg-[#120E0C] border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1.5">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full bg-[#120E0C] border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E05305] transition-colors pr-10" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#E05305] hover:bg-[#c84803] disabled:opacity-50 text-white font-medium text-xs py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 shadow-md shadow-[#E05305]/20"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <>Create Account <ArrowRight size={14} /></>}
                    </button>
                </form>

                <p className="text-[11px] text-neutral-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#E05305] font-medium hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}