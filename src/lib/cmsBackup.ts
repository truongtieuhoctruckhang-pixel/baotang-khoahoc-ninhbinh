import {
  DEFAULT_ABOUT_PAGE,
  DEFAULT_NEWS_POSTS,
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
  sortNewsDescending,
} from './cmsNormalizers';

export interface CmsBackupPayload {
  version: 1 | 2;
  exportedAt: string;
  projectInfo: ProjectInfo;
  clusters: CumTram[];
  stations: TramDiSan[];
  aboutPage?: AboutPageData;
  newsPosts?: NewsPost[];
}

export function buildCmsExportObject(
  projectInfo: ProjectInfo,
  clusters: CumTram[],
  stations: TramDiSan[],
  aboutPage: AboutPageData = DEFAULT_ABOUT_PAGE,
  newsPosts: NewsPost[] = DEFAULT_NEWS_POSTS
): CmsBackupPayload {
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    projectInfo: normalizeProjectInfo(projectInfo),
    clusters: normalizeClusters(clusters),
    stations: stations.map((s) => normalizeStation(s, s)),
    aboutPage: normalizeAboutPage(aboutPage),
    newsPosts: sortNewsDescending(newsPosts.map((p) => normalizeNewsPost(p, p.id))),
  };
}

export function parseImportedCmsJson(rawText: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error('Tệp JSON không hợp lệ. Vui lòng kiểm tra lại định dạng.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Cấu trúc dữ liệu nhập vào không đúng.');
  }

  const obj = parsed as Partial<CmsBackupPayload>;
  if (!Array.isArray(obj.stations) || obj.stations.length === 0) {
    throw new Error('Tệp sao lưu thiếu danh sách trạm (stations).');
  }

  const stations = STATIONS.map((fallback) => {
    const match = obj.stations?.find((s) => s?.id === fallback.id);
    return match ? normalizeStation(match, fallback) : fallback;
  }).sort((a, b) => a.soThuTu - b.soThuTu);

  return {
    projectInfo: normalizeProjectInfo(obj.projectInfo),
    clusters: normalizeClusters(obj.clusters),
    stations,
    aboutPage: normalizeAboutPage(obj.aboutPage),
    newsPosts:
      Array.isArray(obj.newsPosts) && obj.newsPosts.length > 0
        ? sortNewsDescending(
            obj.newsPosts.map((p, idx) => normalizeNewsPost(p, p.id || `tin-${idx + 1}`))
          )
        : DEFAULT_NEWS_POSTS,
  };
}
