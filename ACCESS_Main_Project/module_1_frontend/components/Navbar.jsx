import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const isHome = location.pathname === '/';

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const scrollToSection = (id) => {
        if (!isHome) {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0706]/80 border-b border-neutral-900/60 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                <Link to="/" className="flex items-center gap-3 text-left group">
                    <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
                    <div>
                        <div className="font-bold tracking-wider text-sm text-white">ACCESS</div>
                        <div className="text-[10px] text-neutral-500 font-medium tracking-tight">AI Opportunity Navigator</div>
                    </div>
                </Link>

                {isHome && (
                    <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
                        <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
                        <button onClick={() => scrollToSection('opportunities')} className="hover:text-white transition-colors">Opportunities</button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button>
                    </nav>
                )}

                <div className="flex items-center gap-4 text-xs font-medium">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={`flex items-center gap-1.5 transition-colors ${location.pathname === '/dashboard' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <LayoutDashboard size={14} />
                                Dashboard
                            </Link>
                            <Link
                                to="/opportunities"
                                className={`transition-colors ${location.pathname.startsWith('/opportunit') ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                            >
                                Opportunities
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                            >
                                <LogOut size={14} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={`hover:text-white transition-colors ${location.pathname === '/login' ? 'text-white' : 'text-neutral-400'}`}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-[#E05305] hover:bg-[#c84803] text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-[#E05305]/20"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}