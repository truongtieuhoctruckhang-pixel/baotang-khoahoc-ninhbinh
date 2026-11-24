import { signOut } from 'firebase/auth';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
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
import { ADMIN_EMAIL, auth } from '../lib/firebase';
import type { AdminTab } from '../lib/routes';
import type { PassportProgress } from '../lib/storage';
import { extractYoutubeId } from '../lib/youtube';
import { AboutEditorTab } from './AboutEditorTab';
import { AdminHeader } from './AdminHeader';
import { AdminLoginView } from './AdminLoginView';
import { AdminModals } from './AdminModals';
import { AdminTabBar } from './AdminTabBar';
import { HomeEditorTab } from './HomeEditorTab';
import { NewsManagerTab } from './NewsManagerTab';
import { StationEditorTab } from './StationEditorTab';
import { formatFriendlyError } from './adminUtils';
import { useAdminCms } from './useAdminCms';

export interface AdminPageProps {
  projectInfo: ProjectInfo;
  clusters: CumTram[];
  stations: TramDiSan[];
  aboutPage: AboutPageData;
  newsPosts: NewsPost[];
  hasFirestoreStations: boolean;
  hasFirestoreSiteConfig: boolean;
  hasFirestoreAbout: boolean;
  hasFirestoreNews: boolean;
  firestorePermissionDenied?: boolean;
  progress: PassportProgress;
  initialTab?: AdminTab;
  initialTargetId?: string;
  onNavigate: (hash: string) => void;
}

export function AdminPage({
  projectInfo,
  clusters,
  stations,
  aboutPage,
  newsPosts,
  hasFirestoreStations,
  hasFirestoreSiteConfig,
  hasFirestoreAbout,
  hasFirestoreNews,
  firestorePermissionDenied = false,
  progress,
  initialTab = 'stations',
  initialTargetId,
  onNavigate,
}: AdminPageProps) {
  const cms = useAdminCms({
    projectInfo,
    clusters,
    stations,
    aboutPage,
    newsPosts,
    initialTab,
    initialTargetId,
  });

  const isAuthorizedAdmin =
    Boolean(cms.user?.email) && cms.user!.email!.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!cms.authReady || !cms.user || !isAuthorizedAdmin) {
    return (
      <AdminLoginView
        authReady={cms.authReady}
        user={cms.user}
        deniedEmail={cms.deniedEmail}
        onClearDenied={() => cms.setDeniedEmail(null)}
        onResetLoginGuardState={() => cms.setDeniedEmail(null)}
        onNavigate={onNavigate}
      />
    );
  }

  const parsedYoutube = extractYoutubeId(cms.youtubeInput);
  const previewStation: TramDiSan | null = cms.draftStation
    ? {
        ...cms.draftStation,
        video: {
          ...cms.draftStation.video,
          youtubeId: parsedYoutube.isValid ? parsedYoutube.videoId : cms.draftStation.video.youtubeId,
        },
      }
    : null;
  const isSyncedToFirebase =
    hasFirestoreStations && hasFirestoreSiteConfig && hasFirestoreAbout && hasFirestoreNews;

  return (
    <div className="min-h-screen pb-16">
      <AdminHeader
        userEmail={cms.user.email ?? ''}
        isSyncedToFirebase={isSyncedToFirebase}
        seeding={cms.seeding}
        onRequestSeed={() => cms.setConfirmSeedOpen(true)}
        onExportJson={cms.handleExportJson}
        onImportJson={cms.handleImportJson}
        onNavigateHome={() => onNavigate('#/')}
        onSignOut={() =>
          void signOut(auth).then(
            () => cms.showToast('success', 'Đã đăng xuất tài khoản.'),
            (err) => cms.showToast('error', formatFriendlyError(err))
          )
        }
      />

      {cms.toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm">
          <div
            role="status"
            className={`flex items-center gap-2.5 rounded-[14px] border px-4 py-3 text-sm font-semibold shadow-[0_8px_24px_rgba(11,61,58,0.20)] ${
              cms.toast.type === 'success'
                ? 'border-[#2E8B57] bg-[#E4F4EA] text-[#2E8B57]'
                : 'border-[#C2553A] bg-[#FBE9E3] text-[#C2553A]'
            }`}
          >
            {cms.toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{cms.toast.text}</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {firestorePermissionDenied && (
          <div className="flex items-start gap-3 rounded-[14px] border border-[#C9962E] bg-[#F6EBCB] p-4 text-xs leading-relaxed text-[#17262B] sm:text-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#8A6414]" />
            <div>
              <strong className="font-bold text-[#8A6414]">
                Firestore chưa mở quyền đọc/ghi cho dự án duanstemhoa:
              </strong>{' '}
              Hiện app đang tự động hiển thị dữ liệu mặc định từ <code>src/data.ts</code>. Hãy cập nhật{' '}
              <code>firestore.rules</code> trong Firebase Console để lưu thay đổi.
            </div>
          </div>
        )}

        <AdminTabBar
          activeTab={cms.activeTab}
          newsCount={newsPosts.length}
          hasDraftStation={Boolean(cms.draftStation)}
          hasDraftNews={Boolean(cms.draftNews)}
          saving={cms.saving}
          onSelectTab={cms.setActiveTab}
          onPreview={() => cms.setPreviewKind(cms.activeTab)}
          onSaveStation={() => void cms.handleSaveStation()}
          onSaveDraft={() => {
            if (cms.activeTab === 'news') void cms.handleSaveNewsPost('draft');
            else if (cms.activeTab === 'about') void cms.handleSaveAboutPage('draft');
            else cms.saveHomeDraftLocally();
          }}
          onPublish={() => {
            if (cms.activeTab === 'news') void cms.handleSaveNewsPost('published');
            else if (cms.activeTab === 'about') void cms.handleSaveAboutPage('published');
            else void cms.handlePublishHome();
          }}
        />

        {cms.activeTab === 'stations' && cms.draftStation && (
          <StationEditorTab
            stations={stations}
            clusters={clusters}
            selectedStationId={cms.selectedStationId}
            draftStation={cms.draftStation}
            youtubeInput={cms.youtubeInput}
            stationDirty={cms.stationDirty}
            hasLocalStationDraft={cms.hasLocalStationDraft}
            saving={cms.saving}
            onSelectStation={cms.selectStation}
            onUpdateStation={cms.updateStation}
            onYoutubeInputChange={cms.changeYoutubeInput}
            onDiscardDraft={cms.discardStationDraft}
            onPreview={() => cms.setPreviewKind('stations')}
            onSave={() => void cms.handleSaveStation()}
            onNotify={cms.showToast}
          />
        )}

        {cms.activeTab === 'news' && (
          <NewsManagerTab
            newsPosts={newsPosts}
            selectedNewsId={cms.selectedNewsId}
            draftNews={cms.draftNews}
            isNewNewsPost={cms.isNewNewsPost}
            newsDirty={cms.newsDirty}
            saving={cms.saving}
            onSelectPost={(post) => {
              cms.setSelectedNewsId(post.id);
              cms.setDraftNews(structuredClone(post));
              cms.setIsNewNewsPost(false);
              cms.setNewsDirty(false);
            }}
            onCreatePost={cms.createNewNewsPost}
            onToggleVisibility={(p) => void cms.handleToggleNewsVisibility(p)}
            onRequestDelete={cms.setDeleteNewsTarget}
            onChangeDraftNews={(updater) => {
              cms.setNewsDirty(true);
              cms.setDraftNews(updater);
            }}
            onPreview={() => cms.setPreviewKind('news')}
            onSavePost={(s) => void cms.handleSaveNewsPost(s)}
            onNotify={cms.showToast}
          />
        )}

        {cms.activeTab === 'about' && (
          <AboutEditorTab
            draftAbout={cms.draftAbout}
            aboutDirty={cms.aboutDirty}
            saving={cms.saving}
            onChangeDraftAbout={(updater) => {
              cms.setAboutDirty(true);
              cms.setDraftAbout(updater);
            }}
            onPreview={() => cms.setPreviewKind('about')}
            onSaveAbout={(s) => void cms.handleSaveAboutPage(s)}
            onNotify={cms.showToast}
          />
        )}

        {cms.activeTab === 'home' && (
          <HomeEditorTab
            draftProject={cms.draftProject}
            draftClusters={cms.draftClusters}
            homeDirty={cms.homeDirty}
            hasLocalHomeDraft={cms.hasLocalHomeDraft}
            saving={cms.saving}
            onChangeProject={(updater) => {
              cms.setHomeDirty(true);
              cms.setDraftProject(updater);
            }}
            onChangeClusters={(next) => {
              cms.setHomeDirty(true);
              cms.setDraftClusters(next);
            }}
            onDiscardDraft={cms.discardHomeDraft}
            onSaveDraft={cms.saveHomeDraftLocally}
            onPublish={() => void cms.handlePublishHome()}
            onPreview={() => cms.setPreviewKind('home')}
            onNotify={cms.showToast}
          />
        )}
      </div>

      <AdminModals
        confirmSeedOpen={cms.confirmSeedOpen}
        onCancelSeed={() => cms.setConfirmSeedOpen(false)}
        onConfirmSeed={() => {
          cms.setConfirmSeedOpen(false);
          void cms.runSeedOrImport(
            PROJECT_INFO,
            CLUSTERS,
            STATIONS,
            DEFAULT_ABOUT_PAGE,
            DEFAULT_NEWS_POSTS,
            'Đã nạp toàn bộ dữ liệu mẫu lên Firebase thành công!'
          );
        }}
        deleteNewsTarget={cms.deleteNewsTarget}
        onCancelDeleteNews={() => cms.setDeleteNewsTarget(null)}
        onConfirmDeleteNews={() => void cms.executeDeleteNewsPost()}
        previewKind={cms.previewKind}
        onClosePreview={() => cms.setPreviewKind(null)}
        previewStation={previewStation}
        stations={stations}
        draftClusters={cms.draftClusters}
        draftProject={cms.draftProject}
        draftAbout={cms.draftAbout}
        draftNews={cms.draftNews}
        newsPosts={newsPosts}
        progress={progress}
      />
    </div>
  );
}

export default AdminPage;
