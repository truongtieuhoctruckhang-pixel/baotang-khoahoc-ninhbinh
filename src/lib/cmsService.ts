import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  CLUSTERS,
  DEFAULT_ABOUT_PAGE,
  DEFAULT_NEWS_POSTS,
  PROJECT_INFO,
  STATIONS,
  type AboutPageData,
  type CumTram,
  type NewsPost,
  type ProjectInfo,
  type TramDiSan,
} from '../data';
import {
  normalizeAboutPage,
  normalizeClusters,
  normalizeNewsPost,
  normalizeProjectInfo,
  normalizeStation,
  sanitizePostId,
  sortNewsDescending,
  toAboutPagePayload,
  toNewsPostPayload,
  toSiteConfigPayload,
  toStationPayload,
} from './cmsNormalizers';
import { db, handleFirestoreError, OperationType } from './firebase';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_HOME_DOC = 'home';
const SETTINGS_ABOUT_DOC = 'about';
const STATIONS_COLLECTION = 'stations';
const NEWS_COLLECTION = 'news';

export interface SiteCmsState {
  projectInfo: ProjectInfo;
  clusters: CumTram[];
  stations: TramDiSan[];
  aboutPage: AboutPageData;
  newsPosts: NewsPost[];
  hasFirestoreStations: boolean;
  hasFirestoreSiteConfig: boolean;
  hasFirestoreAbout: boolean;
  hasFirestoreNews: boolean;
  firestorePermissionDenied: boolean;
  loading: boolean;
}

function isPermissionError(error: unknown): boolean {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code ?? '')
      : '';
  const msg = error instanceof Error ? error.message : String(error);
  return code === 'permission-denied' || msg.includes('permission') || msg.includes('PERMISSION_DENIED');
}

export function subscribeToCmsData(onUpdate: (state: SiteCmsState) => void): Unsubscribe {
  let latestStations: TramDiSan[] = STATIONS;
  let latestProjectInfo: ProjectInfo = PROJECT_INFO;
  let latestClusters: CumTram[] = CLUSTERS;
  let latestAboutPage: AboutPageData = DEFAULT_ABOUT_PAGE;
  let latestNewsPosts: NewsPost[] = DEFAULT_NEWS_POSTS;
  let hasFirestoreStations = false, hasFirestoreSiteConfig = false, hasFirestoreAbout = false, hasFirestoreNews = false;
  let stationsDenied = false, configDenied = false, aboutDenied = false, newsDenied = false;
  let stationsReady = false, configReady = false, aboutReady = false, newsReady = false, timedOut = false;

  const emit = () => {
    onUpdate({
      projectInfo: latestProjectInfo, clusters: latestClusters, stations: latestStations,
      aboutPage: latestAboutPage, newsPosts: latestNewsPosts,
      hasFirestoreStations, hasFirestoreSiteConfig, hasFirestoreAbout, hasFirestoreNews,
      firestorePermissionDenied: stationsDenied || configDenied || aboutDenied || newsDenied,
      loading: !timedOut && !(stationsReady && configReady && aboutReady && newsReady),
    });
  };

  const fallbackTimer = window.setTimeout(() => {
    if (!(stationsReady && configReady && aboutReady && newsReady)) {
      timedOut = true;
      emit();
    }
  }, 1800);

  const unsubStations = onSnapshot(
    collection(db, STATIONS_COLLECTION),
    (snapshot) => {
      stationsReady = true;
      stationsDenied = false;
      if (snapshot.empty) {
        hasFirestoreStations = false;
        latestStations = STATIONS;
      } else {
        hasFirestoreStations = true;
        const mapById = new Map<string, Partial<TramDiSan>>();
        snapshot.forEach((docSnap) => {
          const rawId = docSnap.id;
          const normalizedId = /^\d$/.test(rawId) ? rawId.padStart(2, '0') : rawId;
          mapById.set(normalizedId, docSnap.data() as Partial<TramDiSan>);
        });
        latestStations = STATIONS.map((fallback) => {
          const remote = mapById.get(fallback.id);
          return remote ? normalizeStation(remote, fallback) : fallback;
        }).sort((a, b) => a.soThuTu - b.soThuTu);
      }
      emit();
    },
    (error) => {
      stationsDenied = isPermissionError(error);
      stationsReady = true;
      hasFirestoreStations = false;
      latestStations = STATIONS;
      emit();
    }
  );

  const unsubSiteConfig = onSnapshot(
    doc(db, SETTINGS_COLLECTION, SETTINGS_HOME_DOC),
    (docSnap) => {
      configReady = true;
      configDenied = false;
      if (!docSnap.exists()) {
        hasFirestoreSiteConfig = false;
        latestProjectInfo = PROJECT_INFO;
        latestClusters = CLUSTERS;
      } else {
        hasFirestoreSiteConfig = true;
        const data = docSnap.data() as Partial<ProjectInfo> & { clusters?: CumTram[] };
        latestProjectInfo = normalizeProjectInfo(data);
        latestClusters = normalizeClusters(data.clusters);
      }
      emit();
    },
    (error) => {
      configDenied = isPermissionError(error);
      configReady = true;
      hasFirestoreSiteConfig = false;
      latestProjectInfo = PROJECT_INFO;
      latestClusters = CLUSTERS;
      emit();
    }
  );

  const unsubAbout = onSnapshot(
    doc(db, SETTINGS_COLLECTION, SETTINGS_ABOUT_DOC),
    (docSnap) => {
      aboutReady = true;
      aboutDenied = false;
      if (!docSnap.exists()) {
        hasFirestoreAbout = false;
        latestAboutPage = DEFAULT_ABOUT_PAGE;
      } else {
        hasFirestoreAbout = true;
        latestAboutPage = normalizeAboutPage(docSnap.data() as Partial<AboutPageData>);
      }
      emit();
    },
    (error) => {
      aboutDenied = isPermissionError(error);
      aboutReady = true;
      hasFirestoreAbout = false;
      latestAboutPage = DEFAULT_ABOUT_PAGE;
      emit();
    }
  );

  const unsubNews = onSnapshot(
    collection(db, NEWS_COLLECTION),
    (snapshot) => {
      newsReady = true;
      newsDenied = false;
      if (snapshot.empty) {
        hasFirestoreNews = false;
        latestNewsPosts = DEFAULT_NEWS_POSTS;
      } else {
        hasFirestoreNews = true;
        const list: NewsPost[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Partial<NewsPost>;
          list.push(normalizeNewsPost({ ...data, id: docSnap.id }, docSnap.id));
        });
        latestNewsPosts = sortNewsDescending(list);
      }
      emit();
    },
    (error) => {
      newsDenied = isPermissionError(error);
      newsReady = true;
      hasFirestoreNews = false;
      latestNewsPosts = DEFAULT_NEWS_POSTS;
      emit();
    }
  );

  return () => {
    window.clearTimeout(fallbackTimer);
    unsubStations();
    unsubSiteConfig();
    unsubAbout();
    unsubNews();
  };
}

export async function saveStationToFirestore(station: TramDiSan): Promise<void> {
  const path = `${STATIONS_COLLECTION}/${station.id}`;
  const payload = toStationPayload(station);
  try {
    await setDoc(doc(db, STATIONS_COLLECTION, station.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveSiteConfigToFirestore(
  projectInfo: ProjectInfo,
  clusters: CumTram[]
): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/${SETTINGS_HOME_DOC}`;
  const payload = toSiteConfigPayload(projectInfo, clusters);
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_HOME_DOC), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveAboutPageToFirestore(about: AboutPageData): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/${SETTINGS_ABOUT_DOC}`;
  const payload = toAboutPagePayload(about);
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_ABOUT_DOC), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveNewsPostToFirestore(post: NewsPost): Promise<void> {
  const cleanId = sanitizePostId(post.id, `tin-${Date.now()}`);
  const path = `${NEWS_COLLECTION}/${cleanId}`;
  const payload = toNewsPostPayload({ ...post, id: cleanId });
  try {
    await setDoc(doc(db, NEWS_COLLECTION, cleanId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteNewsPostFromFirestore(postId: string): Promise<void> {
  const cleanId = sanitizePostId(postId);
  const path = `${NEWS_COLLECTION}/${cleanId}`;
  try {
    await deleteDoc(doc(db, NEWS_COLLECTION, cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedAllToFirestore(
  projectInfo: ProjectInfo,
  clusters: CumTram[],
  stations: TramDiSan[],
  aboutPage: AboutPageData = DEFAULT_ABOUT_PAGE,
  newsPosts: NewsPost[] = DEFAULT_NEWS_POSTS
): Promise<void> {
  const batch = writeBatch(db);
  batch.set(doc(db, SETTINGS_COLLECTION, SETTINGS_HOME_DOC), toSiteConfigPayload(projectInfo, clusters));
  batch.set(doc(db, SETTINGS_COLLECTION, SETTINGS_ABOUT_DOC), toAboutPagePayload(aboutPage));
  for (const station of stations) {
    batch.set(doc(db, STATIONS_COLLECTION, station.id), toStationPayload(station));
  }
  for (const post of newsPosts) {
    const cleanId = sanitizePostId(post.id, `tin-${Date.now()}`);
    batch.set(doc(db, NEWS_COLLECTION, cleanId), toNewsPostPayload({ ...post, id: cleanId }));
  }
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `${STATIONS_COLLECTION}, ${SETTINGS_COLLECTION}, & ${NEWS_COLLECTION}`
    );
  }
}
