import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the given value.
 * Use to avoid firing API calls on every keystroke.
 *
 * @param value  The value to debounce
 * @param delay  Milliseconds to wait (default 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timer);   // cleanup prevents memory leak
    }, [value, delay]);

    return debouncedValue;
}
