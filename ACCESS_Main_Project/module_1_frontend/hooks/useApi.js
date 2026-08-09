import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls with loading/error states.
 * Usage:
 *   const { data, loading, error, execute } = useApi(matchOpportunity);
 *   execute(userProfile, opportunity);
 */
export default function useApi(apiFunction) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(...args);
            setData(result);
            return result;
        } catch (err) {
            // TypeError with "fetch" / "Load failed" / "Failed to fetch" = backend not running
            const isNetworkError =
                err instanceof TypeError ||
                err.message?.toLowerCase().includes('load failed') ||
                err.message?.toLowerCase().includes('failed to fetch') ||
                err.message?.toLowerCase().includes('networkerror');
            const message = isNetworkError
                ? 'Cannot reach the server. Make sure the backend is running (cd module_3_backend && python main.py).'
                : err.message || 'Something went wrong';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
}
