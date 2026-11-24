import { STATIONS, type TramDiSan } from '../data';

export type AdminTab = 'stations' | 'news' | 'about' | 'home';

export type ActiveRoute =
  | { view: 'home' }
  | { view: 'about' }
  | { view: 'news'; postId?: string }
  | { view: 'passport' }
  | { view: 'map' }
  | { view: 'station'; stationId: string }
  | { view: 'admin'; initialTab?: AdminTab; targetId?: string }
  | { view: 'notfound'; attempted: string };

export function parseHashRoute(hashValue: string, stations: TramDiSan[] = STATIONS): ActiveRoute {
  const clean = hashValue.replace(/^#/, '').trim();
  if (!clean || clean === '/') return { view: 'home' };
  if (clean === '/gioi-thieu' || clean === '/gioi-thieu/') return { view: 'about' };
  if (clean === '/tin-tuc' || clean === '/tin-tuc/') return { view: 'news' };

  const newsDetailMatch = clean.match(/^\/tin-tuc\/([^/]+)\/?$/);
  if (newsDetailMatch) {
    return { view: 'news', postId: decodeURIComponent(newsDetailMatch[1]) };
  }
  if (clean === '/ho-chieu' || clean === '/ho-chieu/') return { view: 'passport' };
  if (clean === '/ban-do' || clean === '/ban-do/') return { view: 'map' };

  if (clean === '/admin' || clean === '/admin/') return { view: 'admin' };
  const adminSubMatch = clean.match(/^\/admin\/(stations|news|about|home)(?:\/([^/]+))?\/?$/);
  if (adminSubMatch) {
    return {
      view: 'admin',
      initialTab: adminSubMatch[1] as AdminTab,
      targetId: adminSubMatch[2] ? decodeURIComponent(adminSubMatch[2]) : undefined,
    };
  }

  const stationMatch = clean.match(/^\/tram\/([^/]+)\/?$/);
  if (stationMatch) {
    const rawId = stationMatch[1];
    const normalizedId = /^\d$/.test(rawId) ? rawId.padStart(2, '0') : rawId;
    const found = stations.find((s) => s.id === normalizedId);
    return found
      ? { view: 'station', stationId: found.id }
      : { view: 'notfound', attempted: hashValue };
  }
  return { view: 'notfound', attempted: hashValue };
}

export function getAdminEditHashForRoute(route: ActiveRoute): string {
  switch (route.view) {
    case 'home':
      return '#/admin/home';
    case 'about':
      return '#/admin/about';
    case 'news':
      return route.postId ? `#/admin/news/${encodeURIComponent(route.postId)}` : '#/admin/news';
    case 'station':
      return `#/admin/stations/${route.stationId}`;
    default:
      return '#/admin/stations';
  }
}

export function getRouteKey(route: ActiveRoute): string {
  if (route.view === 'station') return `station-${route.stationId}`;
  if (route.view === 'news') return `news-${route.postId ?? 'list'}`;
  if (route.view === 'notfound') return `404-${route.attempted}`;
  return route.view;
}
