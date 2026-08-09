import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getOpportunities } from '../services/api';

const AppContext = createContext(null);

/* Sample opportunities for demo — replace with Supabase data later */
const SAMPLE_OPPORTUNITIES = [
    {
        id: '1',
        title: 'Google STEP Internship',
        description: 'A developmental internship for first and second-year undergraduate students with a passion for technology — particularly computer science and engineering.',
        requirements: ['Python', 'Data Structures', 'Algorithms', 'Problem Solving'],
        category: 'Internship',
        duration_weeks: 12,
        apply_url: 'https://careers.google.com/jobs/results/?category=INTERNSHIP',
    },
    {
        id: '2',
        title: 'MLH Fellowship — Software Engineering',
        description: 'A 12-week internship alternative where you contribute to real open-source projects under the guidance of mentors from top companies.',
        requirements: ['Git', 'JavaScript', 'Open Source', 'Collaboration', 'React'],
        category: 'Fellowship',
        duration_weeks: 12,
        apply_url: 'https://fellowship.mlh.io/',
    },
    {
        id: '3',
        title: 'Harvard CS50x Certificate',
        description: 'Complete Harvard\'s renowned introduction to computer science course and earn a verified certificate.',
        requirements: ['C', 'Python', 'SQL', 'Web Development', 'Problem Solving'],
        category: 'Scholarship',
        duration_weeks: 11,
        apply_url: 'https://cs50.harvard.edu/x/',
    },
    {
        id: '4',
        title: 'HackMIT 2026',
        description: 'MIT\'s flagship annual hackathon. Build innovative projects in 24 hours with 1000+ hackers from around the world.',
        requirements: ['Full-Stack Development', 'Teamwork', 'Rapid Prototyping', 'APIs'],
        category: 'Hackathon',
        duration_weeks: 1,
        apply_url: 'https://hackmit.org/',
    },
    {
        id: '5',
        title: 'AWS Cloud Practitioner Certification',
        description: 'Industry-recognized certification validating cloud fluency and foundational AWS knowledge.',
        requirements: ['Cloud Computing', 'Networking Basics', 'Security Fundamentals'],
        category: 'Scholarship',
        duration_weeks: 6,
        apply_url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    },
    {
        id: '6',
        title: 'Microsoft Imagine Cup',
        description: 'A global technology startup competition where students develop innovative solutions addressing real-world challenges using Microsoft Azure.',
        requirements: ['Azure', 'AI/ML', 'Presentation Skills', 'Project Management'],
        category: 'Hackathon',
        duration_weeks: 16,
        apply_url: 'https://imaginecup.microsoft.com/',
    },
];

export function AppProvider({ children }) {
    const [profile, setProfile] = useState({
        name: '',
        major: '',
        skills: [],
        interests: [],
        experience_level: 'beginner',
    });

    const [opportunities, setOpportunities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isScraping, setIsScraping] = useState(false);

    const fetchOpps = useCallback(() => {
        setIsLoading(true);
        getOpportunities()
            .then((data) => {
                const mappedData = data.map(opp => {
                    // ── 1. Try to extract embedded 🔗 Apply: URL from description ──
                    const applyMatch = opp.description?.match(/🔗 Apply:\s*(https?:\/\/\S+)/);
                    let apply_url = applyMatch ? applyMatch[1] : null;

                    // ── 2. Also check old "Apply here:" format ──
                    if (!apply_url) {
                        const oldMatch = opp.description?.match(/Apply here:\s*(https?:\/\/\S+)/);
                        apply_url = oldMatch ? oldMatch[1] : null;
                    }

                    // ── 3. Smart platform-based URL generation if no embedded link ──
                    if (!apply_url) {
                        const company = (opp.company || '').toLowerCase();
                        const title = opp.title || '';
                        const titleSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        const searchQ = encodeURIComponent(`${title} ${opp.company || ''} apply`);

                        if (company.includes('devpost')) {
                            apply_url = `https://devpost.com/hackathons?search=${encodeURIComponent(title)}`;
                        } else if (company.includes('linkedin')) {
                            apply_url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title)}`;
                        } else if (company.includes('internshala')) {
                            apply_url = `https://internshala.com/internships/keywords-${titleSlug}`;
                        } else if (company.includes('mlh') || company.includes('major league')) {
                            apply_url = `https://mlh.io/seasons/2026/events`;
                        } else if (company.includes('lablab')) {
                            apply_url = `https://lablab.ai/event`;
                        } else if (company.includes('indeed')) {
                            apply_url = `https://www.indeed.com/jobs?q=${encodeURIComponent(title)}`;
                        } else if (company.includes('google')) {
                            apply_url = `https://careers.google.com/jobs/results/?q=${encodeURIComponent(title)}`;
                        } else if (company.includes('microsoft')) {
                            apply_url = `https://careers.microsoft.com/us/en/search-results?keywords=${encodeURIComponent(title)}`;
                        } else if (company.includes('amazon') || company.includes('aws')) {
                            apply_url = `https://www.amazon.jobs/en/search?base_query=${encodeURIComponent(title)}`;
                        } else if (company.includes('meta') || company.includes('facebook')) {
                            apply_url = `https://www.metacareers.com/jobs?q=${encodeURIComponent(title)}`;
                        } else {
                            // ── 4. Universal Google search fallback — always works ──
                            apply_url = `https://www.google.com/search?q=${searchQ}`;
                        }
                    }

                    // Strip any embedded URL tags from the visible description
                    const cleanDesc = (opp.description || '')
                        .replace(/\s*🔗 Apply:\s*https?:\/\/\S+/g, '')
                        .replace(/\s*Apply here:\s*https?:\/\/\S+/g, '')
                        .trim();

                    return {
                        ...opp,
                        description: cleanDesc,
                        requirements: opp.required_skills
                            ? opp.required_skills.split(',').map(s => s.trim()).filter(Boolean)
                            : [],
                        category: opp.category || 'Internship',
                        duration_weeks: opp.duration_weeks || 12,
                        apply_url,
                    };
                });
                setOpportunities(mappedData.length > 0 ? mappedData : SAMPLE_OPPORTUNITIES);
            })
            .catch((err) => {
                console.error("Failed to fetch opportunities:", err);
                setOpportunities(SAMPLE_OPPORTUNITIES);
            })
            .finally(() => setIsLoading(false));
    }, []);

    // Trigger real-time scraping then refresh the list
    const scrapeAndRefresh = useCallback(async (keywords) => {
        setIsScraping(true);
        try {
            const kw = keywords ||
                `${profile.major} ${profile.skills.join(' ')} ${profile.interests.join(' ')}`.trim() ||
                'internship hackathon fellowship';
            const res = await fetch(
                `/api/v1/opportunities/scrape-realtime?profile_keywords=${encodeURIComponent(kw)}`,
                { method: 'POST' }
            );
            const json = await res.json();
            // Wait a beat then refresh
            await new Promise(r => setTimeout(r, 600));
            fetchOpps();
            return json;
        } catch (err) {
            console.error('Scrape failed:', err);
            throw err;
        } finally {
            setIsScraping(false);
        }
    }, [profile, fetchOpps]);

    useEffect(() => {
        fetchOpps();
    }, [fetchOpps]);
    const [matchResult, setMatchResult] = useState(null);
    const [gapResult, setGapResult] = useState(null);
    const [pathwayResult, setPathwayResult] = useState(null);

    const updateProfile = useCallback((updates) => {
        setProfile((prev) => ({ ...prev, ...updates }));
    }, []);

    const clearResults = useCallback(() => {
        setMatchResult(null);
        setGapResult(null);
        setPathwayResult(null);
    }, []);

    const getOpportunityById = useCallback(
        (id) => opportunities.find((o) => String(o.id) === String(id)) || null,
        [opportunities]
    );

    const value = {
        profile,
        updateProfile,
        opportunities,
        isLoading,
        isScraping,
        getOpportunityById,
        matchResult,
        setMatchResult,
        gapResult,
        setGapResult,
        pathwayResult,
        setPathwayResult,
        clearResults,
        refreshOpportunities: fetchOpps,
        scrapeAndRefresh,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
