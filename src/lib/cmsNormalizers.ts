import { serverTimestamp } from 'firebase/firestore';
import {
  CLUSTERS,
  DEFAULT_ABOUT_PAGE,
  PROJECT_INFO,
  type AboutPageData,
  type CauHoi,
  type CumTram,
  type NewsPost,
  type ProjectInfo,
  type TramDiSan,
} from '../data';
import { sanitizePlainUrl, sanitizeRichHtml } from './sanitize';
import { extractYoutubeId } from './youtube';

function pickNonEmptyString(
  remoteValue: unknown,
  fallbackValue: string,
  maxLen: number
): string {
  if (typeof remoteValue === 'string' && remoteValue.trim().length > 0) {
    return remoteValue.slice(0, maxLen);
  }
  return fallbackValue.slice(0, maxLen);
}

export function sanitizePostId(rawId: string, fallback = 'tin-moi'): string {
  const cleaned = rawId
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return cleaned || fallback;
}

export function sortNewsDescending(posts: NewsPost[]): NewsPost[] {
  return [...posts].sort((a, b) => b.ngayDang.localeCompare(a.ngayDang));
}

export function normalizeStation(raw: Partial<TramDiSan>, fallback: TramDiSan): TramDiSan {
  const cumId =
    raw.cumId === 'cum-1' || raw.cumId === 'cum-2' || raw.cumId === 'cum-3'
      ? raw.cumId
      : fallback.cumId;

  const rawCauHoi =
    Array.isArray(raw.cauHoi) && raw.cauHoi.length > 0 ? raw.cauHoi : fallback.cauHoi;
  const cauHoi: CauHoi[] = rawCauHoi.slice(0, 20).map((q, idx) => {
    const fbQ = fallback.cauHoi[idx] ?? fallback.cauHoi[0];
    const qTypeStr = String(q?.type ?? '');
    const type = (['single', 'multi', 'truefalse', 'short', 'match', 'order', 'balance'].includes(qTypeStr)
      ? qTypeStr
      : fbQ.type ?? 'single') as CauHoi['type'];

    const opts = Array.isArray(q?.dapAn)
      ? q.dapAn.map((o: unknown) => String(o ?? '').slice(0, 300))
      : (fbQ.dapAn ?? ['', '', '', '']);
    const rawCorrect = typeof q?.dapAnDung === 'number' ? Math.round(q.dapAnDung) : (fbQ.dapAnDung ?? 0);
    const rawMulti = Array.isArray(q?.dapAnDungMulti) ? q.dapAnDungMulti.map(Number) : (fbQ.dapAnDungMulti ?? []);

    const statements = Array.isArray(q?.statements)
      ? q.statements.map((st: any) => ({ text: String(st?.text ?? '').slice(0, 300), isTrue: Boolean(st?.isTrue) }))
      : (fbQ.statements ?? []);

    const shortAnswers = Array.isArray(q?.shortAnswers)
      ? q.shortAnswers.map((sa: any) => String(sa ?? '').slice(0, 100)).filter(Boolean)
      : (fbQ.shortAnswers ?? []);

    const pairs = Array.isArray(q?.pairs)
      ? q.pairs.map((p: any) => ({ a: String(p?.a ?? '').slice(0, 200), b: String(p?.b ?? '').slice(0, 200) }))
      : (fbQ.pairs ?? []);

    const orderSteps = Array.isArray(q?.orderSteps)
      ? q.orderSteps.map((os: any) => String(os ?? '').slice(0, 300)).filter(Boolean)
      : (fbQ.orderSteps ?? []);

    const balanceEquation = String(q?.balanceEquation ?? fbQ.balanceEquation ?? '').slice(0, 300);
    const balanceCoefficients = Array.isArray(q?.balanceCoefficients)
      ? q.balanceCoefficients.map(Number)
      : (fbQ.balanceCoefficients ?? []);

    return {
      type,
      cauHoi: String(q?.cauHoi ?? fbQ.cauHoi ?? 'Câu hỏi trắc nghiệm').slice(0, 500),
      imageUrl: sanitizePlainUrl(String(q?.imageUrl ?? '')).slice(0, 450000) || undefined,
      shuffleOptions: typeof q?.shuffleOptions === 'boolean' ? q.shuffleOptions : Boolean(fbQ.shuffleOptions),
      dapAn: opts,
      dapAnDung: rawCorrect >= 0 && rawCorrect < opts.length ? rawCorrect : 0,
      dapAnDungMulti: rawMulti,
      statements,
      shortAnswers,
      pairs,
      orderSteps,
      balanceEquation,
      balanceCoefficients,
      giaiThich: String(q?.giaiThich ?? fbQ.giaiThich ?? '').slice(0, 1000),
    };
  });

  const k = raw.kienThuc ?? fallback.kienThuc;
  const v = raw.video ?? fallback.video;
  const rawYoutube = typeof v?.youtubeId === 'string' ? v.youtubeId.trim() : '';
  let resolvedYoutubeId = fallback.video.youtubeId;
  if (rawYoutube) {
    const parsed = extractYoutubeId(rawYoutube);
    resolvedYoutubeId = parsed.isValid ? parsed.videoId : rawYoutube.slice(0, 32);
  }

  return {
    id: pickNonEmptyString(raw.id, fallback.id, 16),
    soThuTu:
      typeof raw.soThuTu === 'number' && Number.isFinite(raw.soThuTu)
        ? Math.max(1, Math.min(20, Math.round(raw.soThuTu)))
        : fallback.soThuTu,
    cumId,
    cum: pickNonEmptyString(raw.cum, fallback.cum, 160),
    ten: pickNonEmptyString(raw.ten, fallback.ten, 180),
    diaPhuong: pickNonEmptyString(raw.diaPhuong, fallback.diaPhuong, 160),
    anh: sanitizePlainUrl(String(raw.anh ?? fallback.anh)).slice(0, 450000) || fallback.anh,
    moTaNgan: pickNonEmptyString(raw.moTaNgan, fallback.moTaNgan, 600),
    kienThuc: {
      linhVuc: pickNonEmptyString(k?.linhVuc, fallback.kienThuc.linhVuc, 160),
      tomTat: pickNonEmptyString(k?.tomTat, fallback.kienThuc.tomTat, 3000),
      diemNhan:
        Array.isArray(k?.diemNhan) && k.diemNhan.length > 0
          ? k.diemNhan.map((item) => String(item).trim()).filter(Boolean).slice(0, 12)
          : [...fallback.kienThuc.diemNhan],
      phuongTrinh: pickNonEmptyString(k?.phuongTrinh, fallback.kienThuc.phuongTrinh, 400),
      giaiThichPhuongTrinh: pickNonEmptyString(
        k?.giaiThichPhuongTrinh,
        fallback.kienThuc.giaiThichPhuongTrinh,
        800
      ),
    },
    video: {
      youtubeId: resolvedYoutubeId,
      tieuDe: pickNonEmptyString(v?.tieuDe, fallback.video.tieuDe, 200),
      thoiLuong: pickNonEmptyString(v?.thoiLuong, fallback.video.thoiLuong, 32),
    },
    autoplay: typeof raw.autoplay === 'boolean' ? raw.autoplay : Boolean(fallback.autoplay),
    cauHoi,
  };
}

export function normalizeClusters(rawClusters: unknown): CumTram[] {
  if (!Array.isArray(rawClusters) || rawClusters.length !== 3) {
    return CLUSTERS.map((c) => ({ ...c }));
  }
  return CLUSTERS.map((fallback, idx) => {
    const candidate = (rawClusters.find((item) => item?.id === fallback.id) ??
      rawClusters[idx] ??
      fallback) as Partial<CumTram>;
    return {
      id: fallback.id,
      soThuTu: String(candidate.soThuTu ?? fallback.soThuTu).slice(0, 40),
      ten: String(candidate.ten ?? fallback.ten).slice(0, 120) || fallback.ten,
      chuDe: String(candidate.chuDe ?? fallback.chuDe).slice(0, 160),
      moTa: String(candidate.moTa ?? fallback.moTa).slice(0, 600),
      mauDau: String(candidate.mauDau ?? fallback.mauDau).slice(0, 20) || fallback.mauDau,
    };
  });
}

export function normalizeProjectInfo(raw: Partial<ProjectInfo> | undefined): ProjectInfo {
  const nhom = raw?.nhomThucHien;
  const members = Array.isArray(nhom?.thanhVien)
    ? nhom.thanhVien
        .slice(0, 15)
        .map((m) => ({
          hoTen: String(m?.hoTen ?? '').slice(0, 120),
          vaiTro: String(m?.vaiTro ?? '').slice(0, 160),
        }))
        .filter((m) => m.hoTen || m.vaiTro)
    : PROJECT_INFO.nhomThucHien.thanhVien.map((m) => ({ ...m }));

  const rawCover = String(raw?.anhBia ?? PROJECT_INFO.anhBia);

  return {
    tenDuAn: String(raw?.tenDuAn ?? PROJECT_INFO.tenDuAn).slice(0, 180) || PROJECT_INFO.tenDuAn,
    tenPhu: String(raw?.tenPhu ?? PROJECT_INFO.tenPhu).slice(0, 200),
    khauHieu: String(raw?.khauHieu ?? PROJECT_INFO.khauHieu).slice(0, 500),
    anhBia: sanitizePlainUrl(rawCover).slice(0, 450000) || PROJECT_INFO.anhBia,
    nhomThucHien: {
      tenNhom: String(nhom?.tenNhom ?? PROJECT_INFO.nhomThucHien.tenNhom).slice(0, 200),
      donVi: String(nhom?.donVi ?? PROJECT_INFO.nhomThucHien.donVi).slice(0, 200),
      gioiThieu: String(nhom?.gioiThieu ?? PROJECT_INFO.nhomThucHien.gioiThieu).slice(0, 1500),
      thanhVien: members,
    },
  };
}

export function normalizeAboutPage(raw: Partial<AboutPageData> | undefined): AboutPageData {
  const status = raw?.status === 'draft' ? 'draft' : 'published';
  const cleanHtml = sanitizeRichHtml(String(raw?.noiDungHtml ?? DEFAULT_ABOUT_PAGE.noiDungHtml));
  const rawCover = String(raw?.anhBia ?? DEFAULT_ABOUT_PAGE.anhBia);

  return {
    tieuDe:
      String(raw?.tieuDe ?? DEFAULT_ABOUT_PAGE.tieuDe).slice(0, 200) ||
      DEFAULT_ABOUT_PAGE.tieuDe,
    phuDe: String(raw?.phuDe ?? DEFAULT_ABOUT_PAGE.phuDe).slice(0, 300),
    anhBia: sanitizePlainUrl(rawCover).slice(0, 450000) || DEFAULT_ABOUT_PAGE.anhBia,
    noiDungHtml: cleanHtml.slice(0, 450000) || DEFAULT_ABOUT_PAGE.noiDungHtml,
    status,
  };
}

export function normalizeNewsPost(raw: Partial<NewsPost>, fallbackId = 'tin-01'): NewsPost {
  const id = sanitizePostId(String(raw.id ?? fallbackId), fallbackId);
  const rawCover = String(raw.anhBia ?? DEFAULT_ABOUT_PAGE.anhBia);

  return {
    id,
    tieuDe: String(raw.tieuDe ?? 'Bài viết mới').slice(0, 220) || 'Bài viết mới',
    tomTat: String(raw.tomTat ?? '').slice(0, 600),
    danhMuc: String(raw.danhMuc ?? 'Tin tức').slice(0, 80) || 'Tin tức',
    tacGia: String(raw.tacGia ?? 'Ban Biên Tập STEM').slice(0, 120),
    ngayDang: String(raw.ngayDang ?? new Date().toISOString().slice(0, 10)).slice(0, 40),
    anhBia: sanitizePlainUrl(rawCover).slice(0, 450000),
    noiDungHtml: sanitizeRichHtml(String(raw.noiDungHtml ?? '')).slice(0, 450000),
    status: raw.status === 'draft' ? 'draft' : 'published',
    visible: typeof raw.visible === 'boolean' ? raw.visible : true,
  };
}

export function toStationPayload(station: TramDiSan) {
  const parsedVideo = extractYoutubeId(station.video?.youtubeId ?? '');
  if (!parsedVideo.isValid) {
    throw new Error('Link hoặc ID video YouTube không hợp lệ (cần đúng 11 ký tự).');
  }

  const clean = normalizeStation(
    { ...station, video: { ...station.video, youtubeId: parsedVideo.videoId } },
    station
  );
  if (!clean.ten.trim()) throw new Error('Tên trạm không được để trống.');
  if (clean.anh.length > 450000) throw new Error('Dung lượng ảnh bìa vượt quá giới hạn lưu trữ (300KB).');
  if (clean.cauHoi.length === 0) throw new Error('Mỗi trạm cần có ít nhất 1 câu hỏi trắc nghiệm.');

  return {
    id: clean.id,
    soThuTu: clean.soThuTu,
    cumId: clean.cumId,
    cum: clean.cum,
    ten: clean.ten.trim(),
    diaPhuong: clean.diaPhuong,
    anh: clean.anh,
    moTaNgan: clean.moTaNgan,
    kienThuc: { ...clean.kienThuc },
    video: {
      youtubeId: parsedVideo.videoId,
      tieuDe: clean.video.tieuDe,
      thoiLuong: clean.video.thoiLuong,
    },
    autoplay: Boolean(clean.autoplay),
    cauHoi: clean.cauHoi.map((q) => ({
      type: q.type ?? 'single',
      cauHoi: q.cauHoi.trim() || 'Câu hỏi trắc nghiệm',
      imageUrl: q.imageUrl || '',
      shuffleOptions: Boolean(q.shuffleOptions),
      dapAn: q.dapAn ?? [],
      dapAnDung: q.dapAnDung ?? 0,
      dapAnDungMulti: q.dapAnDungMulti ?? [],
      statements: q.statements ?? [],
      shortAnswers: q.shortAnswers ?? [],
      pairs: q.pairs ?? [],
      orderSteps: q.orderSteps ?? [],
      balanceEquation: q.balanceEquation ?? '',
      balanceCoefficients: q.balanceCoefficients ?? [],
      giaiThich: q.giaiThich,
    })),
    updatedAt: serverTimestamp(),
  };
}

export function toSiteConfigPayload(projectInfo: ProjectInfo, clusters: CumTram[]) {
  const cleanProject = normalizeProjectInfo(projectInfo);
  const cleanClusters = normalizeClusters(clusters);
  if (cleanProject.anhBia.length > 450000) {
    throw new Error('Ảnh bìa trang chủ vượt quá giới hạn lưu trữ (300KB).');
  }

  return {
    tenDuAn: cleanProject.tenDuAn.trim(),
    tenPhu: cleanProject.tenPhu,
    khauHieu: cleanProject.khauHieu,
    anhBia: cleanProject.anhBia,
    nhomThucHien: {
      tenNhom: cleanProject.nhomThucHien.tenNhom,
      donVi: cleanProject.nhomThucHien.donVi,
      gioiThieu: cleanProject.nhomThucHien.gioiThieu,
      thanhVien: cleanProject.nhomThucHien.thanhVien.map((m) => ({
        hoTen: m.hoTen,
        vaiTro: m.vaiTro,
      })),
    },
    clusters: cleanClusters.map((c) => ({
      id: c.id,
      soThuTu: c.soThuTu,
      ten: c.ten.trim() || c.soThuTu,
      chuDe: c.chuDe,
      moTa: c.moTa,
      mauDau: c.mauDau,
    })),
    updatedAt: serverTimestamp(),
  };
}

export function toAboutPagePayload(about: AboutPageData) {
  const clean = normalizeAboutPage(about);
  if (!clean.tieuDe.trim()) throw new Error('Tiêu đề trang Giới thiệu không được để trống.');
  if (clean.anhBia.length > 450000 || clean.noiDungHtml.length > 450000) {
    throw new Error('Nội dung hoặc ảnh trang Giới thiệu vượt quá giới hạn lưu trữ.');
  }
  return {
    tieuDe: clean.tieuDe.trim(),
    phuDe: clean.phuDe,
    anhBia: clean.anhBia,
    noiDungHtml: clean.noiDungHtml,
    status: clean.status,
    updatedAt: serverTimestamp(),
  };
}

export function toNewsPostPayload(post: NewsPost) {
  const clean = normalizeNewsPost(post, post.id);
  if (!clean.tieuDe.trim()) throw new Error('Tiêu đề bài viết không được để trống.');
  if (clean.anhBia.length > 450000 || clean.noiDungHtml.length > 450000) {
    throw new Error('Ảnh hoặc nội dung bài viết vượt quá giới hạn lưu trữ.');
  }
  return {
    id: clean.id,
    tieuDe: clean.tieuDe.trim(),
    tomTat: clean.tomTat,
    danhMuc: clean.danhMuc,
    tacGia: clean.tacGia,
    ngayDang: clean.ngayDang,
    anhBia: clean.anhBia,
    noiDungHtml: clean.noiDungHtml,
    status: clean.status,
    visible: clean.visible,
    updatedAt: serverTimestamp(),
  };
}
