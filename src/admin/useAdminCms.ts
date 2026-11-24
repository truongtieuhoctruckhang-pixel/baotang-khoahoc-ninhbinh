import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import type { AboutPageData, CumTram, NewsPost, ProjectInfo, TramDiSan } from '../data';
import { buildCmsExportObject, parseImportedCmsJson } from '../lib/cmsBackup';
import { ADMIN_EMAIL, auth } from '../lib/firebase';
import type { AdminTab } from '../lib/routes';
import { extractYoutubeId } from '../lib/youtube';
import {
  deleteNewsPostAction,
  publishHomeAction,
  publishStationAction,
  saveAboutPageAction,
  saveNewsPostAction,
  seedOrImportAllAction,
  toggleNewsVisibilityAction,
} from './adminSaveActions';
import {
  clearLocalHomeDraft,
  clearLocalStationDraft,
  clearLoginGuard,
  formatFriendlyError,
  readLocalHomeDraft,
  readLocalStationDraft,
  writeLocalHomeDraft,
} from './adminUtils';

interface UseAdminCmsParams {
  projectInfo: ProjectInfo;
  clusters: CumTram[];
  stations: TramDiSan[];
  aboutPage: AboutPageData;
  newsPosts: NewsPost[];
  initialTab: AdminTab;
  initialTargetId?: string;
}

export function useAdminCms({
  projectInfo,
  clusters,
  stations,
  aboutPage,
  newsPosts,
  initialTab,
  initialTargetId,
}: UseAdminCmsParams) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [deniedEmail, setDeniedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const [selectedStationId, setSelectedStationId] = useState<string>(() =>
    initialTab === 'stations' && initialTargetId && stations.some((s) => s.id === initialTargetId)
      ? initialTargetId
      : stations[0]?.id ?? '01'
  );
  const [draftStation, setDraftStation] = useState<TramDiSan | null>(() => {
    const startId = initialTab === 'stations' && initialTargetId ? initialTargetId : stations[0]?.id ?? '01';
    return readLocalStationDraft(startId) ?? stations.find((s) => s.id === startId) ?? stations[0] ?? null;
  });
  const [youtubeInput, setYoutubeInput] = useState<string>(() => draftStation?.video.youtubeId ?? '');
  const [stationDirty, setStationDirty] = useState(false);
  const [hasLocalStationDraft, setHasLocalStationDraft] = useState<boolean>(() => Boolean(readLocalStationDraft(selectedStationId)));

  const [draftProject, setDraftProject] = useState<ProjectInfo>(() => readLocalHomeDraft()?.projectInfo ?? projectInfo);
  const [draftClusters, setDraftClusters] = useState<CumTram[]>(() => readLocalHomeDraft()?.clusters ?? clusters);
  const [homeDirty, setHomeDirty] = useState(false);
  const [hasLocalHomeDraft, setHasLocalHomeDraft] = useState<boolean>(() => Boolean(readLocalHomeDraft()));

  const [draftAbout, setDraftAbout] = useState<AboutPageData>(() => structuredClone(aboutPage));
  const [aboutDirty, setAboutDirty] = useState(false);

  const [selectedNewsId, setSelectedNewsId] = useState<string>(() =>
    initialTab === 'news' && initialTargetId ? initialTargetId : newsPosts[0]?.id ?? ''
  );
  const [draftNews, setDraftNews] = useState<NewsPost | null>(() => {
    const startId = initialTab === 'news' && initialTargetId ? initialTargetId : newsPosts[0]?.id;
    const found = newsPosts.find((p) => p.id === startId) ?? newsPosts[0];
    return found ? structuredClone(found) : null;
  });
  const [isNewNewsPost, setIsNewNewsPost] = useState(false);
  const [newsDirty, setNewsDirty] = useState(false);
  const [deleteNewsTarget, setDeleteNewsTarget] = useState<NewsPost | null>(null);

  const [previewKind, setPreviewKind] = useState<AdminTab | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [confirmSeedOpen, setConfirmSeedOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const stationsRef = useRef(stations);
  stationsRef.current = stations;
  const newsPostsRef = useRef(newsPosts);
  newsPostsRef.current = newsPosts;

  useEffect(() => {
    setActiveTab(initialTab);
    if (initialTab === 'stations' && initialTargetId) {
      const target = stationsRef.current.find((s) => s.id === initialTargetId);
      if (target) {
        const local = readLocalStationDraft(target.id);
        const chosen = local ?? target;
        setSelectedStationId(target.id);
        setDraftStation(structuredClone(chosen));
        setYoutubeInput(chosen.video.youtubeId);
        setHasLocalStationDraft(Boolean(local));
        setStationDirty(false);
      }
    }
    if (initialTab === 'news' && initialTargetId) {
      const targetPost = newsPostsRef.current.find((p) => p.id === initialTargetId);
      if (targetPost) {
        setSelectedNewsId(targetPost.id);
        setDraftNews(structuredClone(targetPost));
        setIsNewNewsPost(false);
        setNewsDirty(false);
      }
    }
  }, [initialTab, initialTargetId]);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      if (nextUser) {
        const isAllowed = Boolean(nextUser.email) && nextUser.email!.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        if (!isAllowed) {
          setDeniedEmail(nextUser.email ?? 'tài khoản này');
          setUser(null);
          setAuthReady(true);
          void signOut(auth);
          return;
        }
        setDeniedEmail(null);
        clearLoginGuard();
      }
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!stationDirty && !readLocalStationDraft(selectedStationId)) {
      const target = stations.find((s) => s.id === selectedStationId) ?? stations[0];
      if (target) {
        setDraftStation(structuredClone(target));
        setYoutubeInput(target.video.youtubeId);
      }
    }
  }, [stations, selectedStationId, stationDirty]);

  useEffect(() => {
    if (!homeDirty && !readLocalHomeDraft()) {
      setDraftProject(structuredClone(projectInfo));
      setDraftClusters(structuredClone(clusters));
    }
  }, [projectInfo, clusters, homeDirty]);

  useEffect(() => {
    if (!aboutDirty) setDraftAbout(structuredClone(aboutPage));
  }, [aboutPage, aboutDirty]);

  useEffect(() => {
    if (!newsDirty && !isNewNewsPost) {
      const target = newsPosts.find((p) => p.id === selectedNewsId) ?? newsPosts[0];
      setSelectedNewsId(target?.id ?? '');
      setDraftNews(target ? structuredClone(target) : null);
    }
  }, [newsPosts, selectedNewsId, newsDirty, isNewNewsPost]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: 'success' | 'error', text: string) => setToast({ type, text });

  const selectStation = (id: string) => {
    const next = stations.find((s) => s.id === id);
    if (!next) return;
    const local = readLocalStationDraft(id);
    const chosen = local ?? next;
    setSelectedStationId(id);
    setDraftStation(structuredClone(chosen));
    setYoutubeInput(chosen.video.youtubeId);
    setHasLocalStationDraft(Boolean(local));
    setStationDirty(false);
  };

  const updateStation = (updater: (prev: TramDiSan) => TramDiSan) =>
    setDraftStation((prev) => {
      if (!prev) return prev;
      setStationDirty(true);
      return updater(prev);
    });

  const changeYoutubeInput = (val: string) => {
    setYoutubeInput(val);
    const parsed = extractYoutubeId(val);
    setDraftStation((prev) => {
      if (!prev) return prev;
      setStationDirty(true);
      return { ...prev, video: { ...prev.video, youtubeId: parsed.isValid ? parsed.videoId : val.trim() } };
    });
  };

  const discardStationDraft = () => {
    const live = stations.find((s) => s.id === selectedStationId);
    clearLocalStationDraft(selectedStationId);
    setHasLocalStationDraft(false);
    setStationDirty(false);
    if (live) {
      setDraftStation(structuredClone(live));
      setYoutubeInput(live.video.youtubeId);
    }
    showToast('success', 'Đã khôi phục nội dung đang lưu trên Firebase của trạm.');
  };

  const createNewNewsPost = () => {
    const fresh: NewsPost = {
      id: `tin-${Date.now().toString().slice(-6)}`,
      tieuDe: '',
      tomTat: '',
      danhMuc: 'Hoạt động dự án',
      tacGia: 'Nhóm Nghiên Cứu STEM',
      ngayDang: new Date().toISOString().slice(0, 10),
      anhBia: '/src/assets/images/hero_trangan_sunrise_1795513151468.jpg',
      noiDungHtml: '<p>Nhập nội dung chi tiết bài viết tại đây...</p>',
      status: 'draft',
      visible: true,
    };
    setSelectedNewsId(fresh.id);
    setDraftNews(fresh);
    setIsNewNewsPost(true);
    setNewsDirty(true);
  };

  const saveHomeDraftLocally = () => {
    writeLocalHomeDraft(draftProject, draftClusters);
    setHasLocalHomeDraft(true);
    setHomeDirty(false);
    showToast('success', 'Đã lưu nháp Trang chủ & 3 Cụm cục bộ.');
  };

  const discardHomeDraft = () => {
    clearLocalHomeDraft();
    setHasLocalHomeDraft(false);
    setHomeDirty(false);
    setDraftProject(structuredClone(projectInfo));
    setDraftClusters(structuredClone(clusters));
    showToast('success', 'Đã khôi phục cấu hình Trang chủ đang xuất bản.');
  };

  const handleSaveStation = async () => {
    if (!draftStation) return;
    setSaving(true);
    const res = await publishStationAction(draftStation, youtubeInput);
    setSaving(false);
    if (!res.ok) return showToast('error', res.error);
    setHasLocalStationDraft(false);
    setDraftStation(structuredClone(res.saved));
    setYoutubeInput(res.saved.video.youtubeId);
    setStationDirty(false);
    showToast('success', 'Đã lưu thành công');
  };

  const handleSaveNewsPost = async (targetStatus: 'draft' | 'published') => {
    if (!draftNews) return;
    setSaving(true);
    const res = await saveNewsPostAction(draftNews, isNewNewsPost, targetStatus);
    setSaving(false);
    if (!res.ok) return showToast('error', res.error);
    setDraftNews(res.saved);
    setSelectedNewsId(res.saved.id);
    setIsNewNewsPost(false);
    setNewsDirty(false);
    showToast('success', targetStatus === 'published' ? 'Đã đăng bài viết Tin tức thành công!' : 'Đã lưu bản nháp bài viết lên Firebase!');
  };

  const handleToggleNewsVisibility = async (post: NewsPost) => {
    setSaving(true);
    const res = await toggleNewsVisibilityAction(post);
    setSaving(false);
    if (!res.ok) return showToast('error', res.error);
    if (draftNews?.id === post.id) setDraftNews(res.updated);
    showToast('success', res.updated.visible ? 'Đã bật hiển thị bài viết.' : 'Đã ẩn bài viết khỏi người xem.');
  };

  const executeDeleteNewsPost = async () => {
    if (!deleteNewsTarget) return;
    const targetId = deleteNewsTarget.id;
    setDeleteNewsTarget(null);
    setSaving(true);
    const res = await deleteNewsPostAction(targetId, isNewNewsPost && targetId === draftNews?.id);
    setSaving(false);
    if (!res.ok) return showToast('error', res.error);
    const nextFirst = newsPosts.find((p) => p.id !== targetId) ?? null;
    setSelectedNewsId(nextFirst?.id ?? '');
    setDraftNews(nextFirst ? structuredClone(nextFirst) : null);
    setIsNewNewsPost(false);
    setNewsDirty(false);
    showToast('success', 'Đã xóa bài viết thành công.');
  };

  const handleSaveAboutPage = async (targetStatus: 'draft' | 'published') => {
    setSaving(true);
    const res = await saveAboutPageAction(draftAbout, targetStatus);
    setSaving(false);
    if (!res.ok) return showToast('error', res.error);
    setDraftAbout(res.saved);
    setAboutDirty(false);
    showToast('success', targetStatus === 'published' ? 'Đã đăng nội dung trang Giới thiệu!' : 'Đã lưu bản nháp trang Giới thiệu!');
  };

  const handlePublishHome = async () => {
    setSaving(true);
    const res = await publishHomeAction(draftProject, draftClusters);
    setSaving(false);
    if (!res.ok) return showToast('error', res.error);
    setHasLocalHomeDraft(false);
    setHomeDirty(false);
    showToast('success', 'Đã đăng cấu hình Trang chủ & 3 Cụm!');
  };

  const runSeedOrImport = async (pInfo: ProjectInfo, cls: CumTram[], sts: TramDiSan[], abt: AboutPageData, nws: NewsPost[], msg: string) => {
    setSeeding(true);
    const res = await seedOrImportAllAction(pInfo, cls, sts, abt, nws);
    setSeeding(false);
    if (!res.ok) return showToast('error', res.error);
    setHasLocalHomeDraft(false);
    setHasLocalStationDraft(false);
    setStationDirty(false);
    setHomeDirty(false);
    setAboutDirty(false);
    setNewsDirty(false);
    const updatedCurrent = sts.find((s) => s.id === selectedStationId) ?? sts[0];
    if (updatedCurrent) {
      setDraftStation(structuredClone(updatedCurrent));
      setYoutubeInput(updatedCurrent.video.youtubeId);
    }
    setDraftProject(structuredClone(pInfo));
    setDraftClusters(structuredClone(cls));
    setDraftAbout(structuredClone(abt));
    if (nws[0]) {
      setSelectedNewsId(nws[0].id);
      setDraftNews(structuredClone(nws[0]));
    }
    showToast('success', msg);
  };

  const handleExportJson = () => {
    const payload = buildCmsExportObject(projectInfo, clusters, stations, aboutPage, newsPosts);
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ho-chieu-khoa-hoc-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'Đã xuất tệp sao lưu JSON đầy đủ.');
  };

  const handleImportJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const imp = parseImportedCmsJson(await file.text());
      await runSeedOrImport(imp.projectInfo, imp.clusters, imp.stations, imp.aboutPage, imp.newsPosts, 'Đã khôi phục dữ liệu từ JSON và lưu lên Firebase!');
    } catch (err) {
      showToast('error', formatFriendlyError(err));
    }
  };

  return {
    user, authReady, deniedEmail, setDeniedEmail, activeTab, setActiveTab,
    selectedStationId, draftStation, youtubeInput, stationDirty, hasLocalStationDraft,
    selectStation, updateStation, changeYoutubeInput, discardStationDraft,
    draftProject, setDraftProject, draftClusters, setDraftClusters, homeDirty, setHomeDirty, hasLocalHomeDraft,
    saveHomeDraftLocally, discardHomeDraft,
    draftAbout, setDraftAbout, aboutDirty, setAboutDirty,
    selectedNewsId, setSelectedNewsId, draftNews, setDraftNews, isNewNewsPost, setIsNewNewsPost, newsDirty, setNewsDirty,
    createNewNewsPost, deleteNewsTarget, setDeleteNewsTarget, previewKind, setPreviewKind,
    saving, seeding, confirmSeedOpen, setConfirmSeedOpen, toast, showToast,
    handleSaveStation, handleSaveNewsPost, handleToggleNewsVisibility, executeDeleteNewsPost,
    handleSaveAboutPage, handlePublishHome, runSeedOrImport, handleExportJson, handleImportJson,
  };
}
