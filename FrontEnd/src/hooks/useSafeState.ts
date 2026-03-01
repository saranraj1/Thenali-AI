import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Drop-in replacement for useState that prevents setState calls
 * after component unmount (prevents "Can't perform state update on
 * an unmounted component" memory leaks).
 */
export function useSafeState<T>(initialValue: T) {
    const [state, setState] = useState<T>(initialValue);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
        if (isMounted.current) {
            setState(value);
        }
    }, []);

    return [state, safeSetState] as const;
}
