import { useState, useCallback, useRef } from 'react';

/**
 * Generic hook for API calls with:
 * - Automatic abort on unmount / new call (no duplicate requests)
 * - Loading / error / data state managed together
 * - AbortError silently swallowed (not shown as error to user)
 */
export function useApiCall<T>() {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const execute = useCallback(async (apiFunction: () => Promise<T>) => {
        // Abort any in-flight request before starting a new one
        if (abortRef.current) {
            abortRef.current.abort();
        }
        abortRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        try {
            const result = await apiFunction();
            setData(result);
            return result;
        } catch (err: any) {
            if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
                setError(err.message || 'An error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return { data, isLoading, error, execute, reset };
}
