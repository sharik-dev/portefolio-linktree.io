import { useEffect } from 'react';
import { trackVisit } from '../utils/visitorTracker';

const SESSION_FLAG = '_v_tracked';

/**
 * Tracks one visit per browser session.
 * Call this hook inside any layout/page you want to monitor.
 * The dashboard page is excluded from tracking by design.
 */
export function useVisitorTracker(): void {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, '1');
    trackVisit();
  }, []);
}
