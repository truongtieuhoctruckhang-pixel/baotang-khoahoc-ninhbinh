import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Pencil } from 'lucide-react';
import { CLUSTERS, DEFAULT_ABOUT_PAGE, DEFAULT_NEWS_POSTS, PROJECT_INFO, STATIONS } from './data';
import { subscribeToCmsData, type SiteCmsState } from './lib/cmsService';
import { ADMIN_EMAIL, auth } from './lib/firebase';
import { getAdminEditHashForRoute, getRouteKey, parseHashRoute, type ActiveRoute } from './lib/routes';
import { getCompletedCount, loadPassportProgress, recordStationQuizResult, resetPassportProgress, type PassportProgress } from './lib/storage';
import { BottomNav } from './components/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { TopBar } from './components/TopBar';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { NewsPage } from './pages/NewsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PassportPage } from './pages/PassportPage';
import { StationPage } from './pages/StationPage';

const AdminPage = lazy(() => import('./admin/AdminPage'));

function ViewerLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-10 pb-12" aria-busy="true" aria-label="Đang tải dữ liệu">
      <div className="h-[430px] w-full bg-[#0B3D3A]/85 sm:h-[500px]" />
      <div className="mx-auto -mt-14 max-w-6xl px-4 sm:-mt-16 sm:px-6"><div className="h-36 rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] p-6" /></div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="h-8 w-56 rounded-[10px] bg-[#E3DAC3]/70" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => <div key={n} className="h-72 rounded-[16px] border border-[#E3DAC3] bg-[#F3EDDD]" />)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [cmsState, setCmsState] = useState<SiteCmsState>({
    projectInfo: PROJECT_INFO, clusters: CLUSTERS, stations: STATIONS,
    aboutPage: DEFAULT_ABOUT_PAGE, newsPosts: DEFAULT_NEWS_POSTS,
    hasFirestoreStations: false, hasFirestoreSiteConfig: false, hasFirestoreAbout: false,
    hasFirestoreNews: false, firestorePermissionDenied: false, loading: true,
  });
  const [isAdminSignedIn, setIsAdminSignedIn] = useState(false);
  const [isStationQuizActive, setIsStationQuizActive] = useState(false);
  const [route, setRoute] = useState<ActiveRoute>(() => parseHashRoute(typeof window !== 'undefined' ? window.location.hash : '#/', STATIONS));
  const [progress, setProgress] = useState<PassportProgress>(() => loadPassportProgress());

  useEffect(() => subscribeToCmsData(setCmsState), []);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setIsAdminSignedIn(Boolean(user?.email) && user!.email!.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  }), []);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(parseHashRoute(window.location.hash || '#/', cmsState.stations));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [cmsState.stations]);

  const navigate = useCallback((targetHash: string) => {
    if (window.location.hash === targetHash) {
      setRoute(parseHashRoute(targetHash, cmsState.stations));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = targetHash;
  }, [cmsState.stations]);

  const handleCompleteQuiz = useCallback((stationId: string, correctCount: number, totalQuestions: number) => {
    const result = recordStationQuizResult(progress, stationId, correctCount, totalQuestions);
    setProgress(result.updated);
    return {
      passed: result.passed,
      newlyStamped: result.newlyStamped,
      allCompleted: getCompletedCount(result.updated, cmsState.stations) === cmsState.stations.length,
    };
  }, [progress, cmsState.stations]);

  const handleResetPassport = useCallback(() => setProgress(resetPassportProgress()), []);
  const completedCount = getCompletedCount(progress, cmsState.stations);
  const activeStation = route.view === 'station' ? cmsState.stations.find((s) => s.id === route.stationId) : undefined;
  const isAdminRoute = route.view === 'admin';
  const showFooter = !isAdminRoute && !(route.view === 'station' && isStationQuizActive);

  return (
    <div className="passport-paper-bg flex min-h-screen flex-col text-[#17262B]">
      {!isAdminRoute && route.view !== 'station' && (
        <TopBar route={route} completedCount={completedCount} onNavigate={navigate} />
      )}

      <main className={`flex-1 ${!isAdminRoute && !showFooter ? 'pb-20 md:pb-0' : ''}`}>
        {!isAdminRoute && cmsState.loading ? (
          <ViewerLoadingSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={getRouteKey(route)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              {route.view === 'home' && <HomePage progress={progress} projectInfo={cmsState.projectInfo} clusters={cmsState.clusters} stations={cmsState.stations} onNavigate={navigate} />}
              {route.view === 'about' && <AboutPage aboutPage={cmsState.aboutPage} projectInfo={cmsState.projectInfo} onNavigate={navigate} />}
              {route.view === 'news' && <NewsPage posts={cmsState.newsPosts} postId={route.postId} onNavigate={navigate} />}
              {route.view === 'passport' && <PassportPage progress={progress} stations={cmsState.stations} onNavigate={navigate} onResetPassport={handleResetPassport} />}
              {route.view === 'map' && <MapPage progress={progress} stations={cmsState.stations} clusters={cmsState.clusters} onNavigate={navigate} />}
              {route.view === 'station' && activeStation && <StationPage station={activeStation} stations={cmsState.stations} clusters={cmsState.clusters} progress={progress} onNavigate={navigate} onCompleteQuiz={handleCompleteQuiz} onQuizActiveChange={setIsStationQuizActive} />}
              {route.view === 'admin' && (
                <ErrorBoundary>
                  <Suspense fallback={<div className="flex min-h-[75vh] items-center justify-center px-4"><div className="flex items-center gap-3 rounded-[16px] border border-[#E3DAC3] bg-[#FBF8F1] px-6 py-4 text-sm font-semibold text-[#17262B] shadow-[0_8px_24px_rgba(11,61,58,0.10)]"><Loader2 className="h-5 w-5 animate-spin text-[#137A6F]" /><span>Đang tải trang Quản trị...</span></div></div>}>
                    <AdminPage
                      projectInfo={cmsState.projectInfo} clusters={cmsState.clusters} stations={cmsState.stations} aboutPage={cmsState.aboutPage} newsPosts={cmsState.newsPosts}
                      hasFirestoreStations={cmsState.hasFirestoreStations} hasFirestoreSiteConfig={cmsState.hasFirestoreSiteConfig} hasFirestoreAbout={cmsState.hasFirestoreAbout} hasFirestoreNews={cmsState.hasFirestoreNews}
                      firestorePermissionDenied={cmsState.firestorePermissionDenied} progress={progress} initialTab={route.initialTab} initialTargetId={route.targetId} onNavigate={navigate}
                    />
                  </Suspense>
                </ErrorBoundary>
              )}
              {route.view === 'notfound' && <NotFoundPage attemptedPath={route.attempted} onNavigate={navigate} />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {isAdminSignedIn && !isAdminRoute && (
        <button type="button" onClick={() => navigate(getAdminEditHashForRoute(route))} className="fixed bottom-20 right-4 z-40 inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#E2B857] bg-[#0B3D3A] px-4 py-2 text-xs font-bold text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.28)] transition-all hover:bg-[#137A6F] active:scale-[0.97] md:bottom-6 md:right-6" title="Chỉnh sửa nội dung trang đang xem">
          <Pencil className="h-3.5 w-3.5 text-[#E2B857]" />
          <span>Sửa trang này</span>
        </button>
      )}

      {showFooter && (
        <Footer
          teamName={cmsState.projectInfo.nhomThucHien.tenNhom}
          isAdminSignedIn={isAdminSignedIn}
          onNavigate={navigate}
        />
      )}

      {!isAdminRoute && <BottomNav route={route} completedCount={completedCount} onNavigate={navigate} />}
    </div>
  );
}
