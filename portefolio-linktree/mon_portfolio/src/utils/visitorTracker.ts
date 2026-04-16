export interface VisitorData {
  id: string;
  timestamp: string;
  // Browser
  userAgent: string;
  browser: string;
  browserVersion: string;
  os: string;
  device: string;
  // Network / Geo
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  asn?: string;
  // Locale
  language: string;
  languages: string;
  timezone: string;
  // Screen
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  colorDepth: number;
  pixelRatio: number;
  // Hardware
  platform: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  touchPoints: number;
  // Navigation
  referrer: string;
  url: string;
  // Privacy signals
  cookieEnabled: boolean;
  doNotTrack: string | null;
  // Connection
  connectionType?: string;
  connectionEffectiveType?: string;
  connectionDownlink?: number;
  connectionRtt?: number;
}

const STORAGE_KEY = 'portfolio_visitors';
const MAX_VISITORS = 500;

export function parseUserAgent(ua: string): {
  browser: string;
  version: string;
  os: string;
  device: string;
} {
  // Browser
  let browser = 'Unknown';
  let version = '';

  if (/Edg\//i.test(ua)) {
    browser = 'Edge';
    version = ua.match(/Edg\/([\d.]+)/i)?.[1] ?? '';
  } else if (/OPR\//i.test(ua) || /Opera\//i.test(ua)) {
    browser = 'Opera';
    version = ua.match(/OPR\/([\d.]+)/i)?.[1] ?? '';
  } else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
    browser = 'Chrome';
    version = ua.match(/Chrome\/([\d.]+)/i)?.[1] ?? '';
  } else if (/Firefox\//i.test(ua)) {
    browser = 'Firefox';
    version = ua.match(/Firefox\/([\d.]+)/i)?.[1] ?? '';
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
    version = ua.match(/Version\/([\d.]+)/i)?.[1] ?? '';
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = 'Internet Explorer';
    version = ua.match(/(?:MSIE |rv:)([\d.]+)/i)?.[1] ?? '';
  }

  // OS
  let os = 'Unknown';
  if (/Windows NT 10\.0/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6\.1/i.test(ua)) os = 'Windows 7';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/iPhone/i.test(ua)) {
    const v = ua.match(/iPhone OS ([\d_]+)/i)?.[1]?.replace(/_/g, '.') ?? '';
    os = `iOS ${v}`;
  } else if (/iPad/i.test(ua)) {
    const v = ua.match(/(?:iPad.*OS|CPU OS) ([\d_]+)/i)?.[1]?.replace(/_/g, '.') ?? '';
    os = `iPadOS ${v}`;
  } else if (/Android/i.test(ua)) {
    const v = ua.match(/Android ([\d.]+)/i)?.[1] ?? '';
    os = `Android ${v}`;
  } else if (/Mac OS X/i.test(ua)) {
    const v = ua.match(/Mac OS X ([\d_]+)/i)?.[1]?.replace(/_/g, '.') ?? '';
    os = `macOS ${v}`;
  } else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/CrOS/i.test(ua)) os = 'ChromeOS';

  // Device type
  let device = 'Desktop';
  if (/iPhone/i.test(ua)) device = 'iPhone';
  else if (/iPad/i.test(ua)) device = 'iPad';
  else if (/Android/i.test(ua) && /Mobile/i.test(ua)) device = 'Android Phone';
  else if (/Android/i.test(ua)) device = 'Android Tablet';

  return { browser, version, os, device };
}

export async function trackVisit(): Promise<void> {
  const ua = navigator.userAgent;
  const { browser, version, os, device } = parseUserAgent(ua);

  const visitor: VisitorData = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    userAgent: ua,
    browser,
    browserVersion: version,
    os,
    device,
    language: navigator.language,
    languages: (navigator.languages ?? [navigator.language]).join(', '),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    platform: navigator.platform,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    touchPoints: navigator.maxTouchPoints,
    referrer: document.referrer || 'Direct',
    url: window.location.pathname,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
  };

  // Connection info
  const nav = navigator as Navigator & {
    connection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number };
    mozConnection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number };
    webkitConnection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number };
  };
  const conn = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
  if (conn) {
    visitor.connectionType = conn.type;
    visitor.connectionEffectiveType = conn.effectiveType;
    visitor.connectionDownlink = conn.downlink;
    visitor.connectionRtt = conn.rtt;
  }

  // IP + Geo via public free API — save immediately then update with geo
  _saveVisitor(visitor);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const geo = await res.json();
      visitor.ip = geo.ip;
      visitor.country = geo.country_name;
      visitor.countryCode = geo.country_code?.toLowerCase();
      visitor.city = geo.city;
      visitor.region = geo.region;
      visitor.latitude = geo.latitude;
      visitor.longitude = geo.longitude;
      visitor.isp = geo.org;
      visitor.asn = geo.asn;
      if (!visitor.timezone && geo.timezone) visitor.timezone = geo.timezone;

      // Update stored record with enriched geo data
      _updateVisitor(visitor);
    }
  } catch {
    // Geo lookup failed — keep the basic record that was already saved
  }
}

function _saveVisitor(visitor: VisitorData): void {
  const list = getVisitors();
  list.push(visitor);
  const trimmed = list.slice(-MAX_VISITORS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage quota exceeded
  }
}

function _updateVisitor(visitor: VisitorData): void {
  const list = getVisitors();
  const idx = list.findIndex(v => v.id === visitor.id);
  if (idx !== -1) {
    list[idx] = visitor;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // quota exceeded
    }
  }
}

export function getVisitors(): VisitorData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VisitorData[]) : [];
  } catch {
    return [];
  }
}

export function clearVisitors(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportVisitorsAsJson(): void {
  const data = getVisitors();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `visitors_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
