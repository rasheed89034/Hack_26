import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

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
        <footer className="border-t border-neutral-900/60 py-8 px-6 text-xs text-neutral-500 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-3">
                    <Logo className="w-5 h-5 opacity-70" />
                    <div>
                        <span className="font-bold text-neutral-300">ACCESS</span>
                        <span className="mx-2">·</span>
                        <span className="text-[10px]">AI Opportunity Navigator</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6 text-[11px]">
                    <button onClick={() => scrollToSection('how-it-works')} className="hover:text-neutral-300 transition-colors">How It Works</button>
                    <Link to="/opportunities" className="hover:text-neutral-300 transition-colors">Opportunities</Link>
                    <button onClick={() => scrollToSection('about')} className="hover:text-neutral-300 transition-colors">About</button>
                </div>

                <div className="text-[10px] text-neutral-600">
                    © 2026 ACCESS · AI Opportunity Navigator
                </div>
            </div>
        </footer>
    );
}