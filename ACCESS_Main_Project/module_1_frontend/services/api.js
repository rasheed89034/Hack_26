// In development, use empty base so Vite's proxy handles /api/* → localhost:8000
// In production, VITE_API_BASE_URL should be set to your deployed backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const { headers, ...restOptions } = options; // Extract headers safely

    const res = await fetch(url, {
        headers: { 
            'Content-Type': 'application/json', 
            ...headers 
        },
        ...restOptions, // Spread the rest without overwriting headers
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error.detail || `API error ${res.status}`);
    }

    return res.json();
}

/* ─── Opportunity Endpoints ─── */
export async function getOpportunities() {
    return request('/api/v1/opportunities/');
}

/* ─── AI Intelligence Endpoints ─── */

export async function matchOpportunity(userProfile, opportunityDetails) {
    return request('/api/v1/match', {
        method: 'POST',
        body: JSON.stringify({ user_profile: userProfile, opportunity_details: opportunityDetails }),
    });
}

export async function analyzeGap(userProfile, opportunityDetails) {
    return request('/api/v1/gap-analysis', {
        method: 'POST',
        body: JSON.stringify({ user_profile: userProfile, opportunity_details: opportunityDetails }),
    });
}

export async function generatePathway(missingSkills, availableTimeWeeks) {
    return request('/api/v1/generate-pathway', {
        method: 'POST',
        body: JSON.stringify({ missing_skills: missingSkills, available_time_weeks: availableTimeWeeks }),
    });
}

export async function parseVoiceIntent(transcribedText) {
    return request('/api/v1/voice-intent', {
        method: 'POST',
        body: JSON.stringify({ transcribed_text: transcribedText }),
    });
}

export async function getSpeechmaticsToken() {
    return request('/api/v1/speechmatics-token', { method: 'POST' });
}

export async function healthCheck() {
    return request('/api/v1/health');
}
