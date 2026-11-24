import type { AboutPageData, CumTram, NewsPost, ProjectInfo, TramDiSan } from '../data';
import {
  deleteNewsPostFromFirestore,
  saveAboutPageToFirestore,
  saveNewsPostToFirestore,
  saveSiteConfigToFirestore,
  saveStationToFirestore,
  seedAllToFirestore,
} from '../lib/cmsService';
import { extractYoutubeId } from '../lib/youtube';
import {
  clearLocalHomeDraft,
  clearLocalStationDraft,
  createSlugFromTitle,
  formatFriendlyError,
} from './adminUtils';

export async function publishStationAction(
  draftStation: TramDiSan,
  youtubeInput: string
): Promise<
  | { ok: true; saved: TramDiSan }
  | { ok: false; error: string }
> {
  const parsed = extractYoutubeId(youtubeInput);
  if (!parsed.isValid) {
    return {
      ok: false,
      error: 'Link hoặc ID video YouTube không hợp lệ. Vui lòng dán link YouTube hoặc đúng ID 11 ký tự.',
    };
  }
  const stationToSave: TramDiSan = {
    ...draftStation,
    autoplay: Boolean(draftStation.autoplay),
    video: { ...draftStation.video, youtubeId: parsed.videoId },
  };
  try {
    await saveStationToFirestore(stationToSave);
    clearLocalStationDraft(stationToSave.id);
    return { ok: true, saved: stationToSave };
  } catch (err) {
    return { ok: false, error: formatFriendlyError(err) };
  }
}

export async function saveNewsPostAction(
  draftNews: NewsPost,
  isNewNewsPost: boolean,
  targetStatus: 'draft' | 'published'
): Promise<{ ok: true; saved: NewsPost } | { ok: false; error: string }> {
  if (!draftNews.tieuDe.trim()) {
    return { ok: false, error: 'Vui lòng nhập tiêu đề bài viết trước khi lưu.' };
  }
  const payload: NewsPost = {
    ...draftNews,
    id: isNewNewsPost ? createSlugFromTitle(draftNews.tieuDe) : draftNews.id,
    status: targetStatus,
  };
  try {
    await saveNewsPostToFirestore(payload);
    return { ok: true, saved: payload };
  } catch (err) {
    return { ok: false, error: formatFriendlyError(err) };
  }
}

export async function toggleNewsVisibilityAction(
  post: NewsPost
): Promise<{ ok: true; updated: NewsPost } | { ok: false; error: string }> {
  try {
    const updated = { ...post, visible: !post.visible };
    await saveNewsPostToFirestore(updated);
    return { ok: true, updated };
  } catch (err) {
    return { ok: false, error: formatFriendlyError(err) };
  }
}

export async function deleteNewsPostAction(
  targetId: string,
  skipRemoteDelete: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (!skipRemoteDelete) {
      await deleteNewsPostFromFirestore(targetId);
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatFriendlyError(err) };
  }
}

export async function saveAboutPageAction(
  draftAbout: AboutPageData,
  targetStatus: 'draft' | 'published'
): Promise<{ ok: true; saved: AboutPageData } | { ok: false; error: string }> {
  try {
    const nextAbout: AboutPageData = { ...draftAbout, status: targetStatus };
    await saveAboutPageToFirestore(nextAbout);
    return { ok: true, saved: nextAbout };
  } catch (err) {
    return { ok: false, error: formatFriendlyError(err) };
  }
}

export async function publishHomeAction(
  draftProject: ProjectInfo,
  draftClusters: CumTram[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await saveSiteConfigToFirestore(draftProject, draftClusters);
    clearLocalHomeDraft();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatFriendlyError(err) };
  }
}

export async function seedOrImportAllAction(
  pInfo: ProjectInfo,
  cls: CumTram[],
  sts: TramDiSan[],
  abt: AboutPageData,
  nws: NewsPost[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await seedAllToFirestore(pInfo, cls, sts, abt, nws);
    clearLocalHomeDraft();
    sts.forEach((s) => clearLocalStationDraft(s.id));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: formatFriendlyError(err) };
  }
}
