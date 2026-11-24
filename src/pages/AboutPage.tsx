import { ArrowRight, Award, Compass, Users } from 'lucide-react';
import {
  DEFAULT_ABOUT_PAGE,
  type AboutPageData,
  type ProjectInfo,
} from '../data';
import { ChemText, RichHtmlWithChem } from '../lib/chem';
import { StationImage } from '../components/StationImage';

interface AboutPageProps {
  aboutPage: AboutPageData;
  projectInfo: ProjectInfo;
  previewMode?: boolean;
  onNavigate: (hash: string) => void;
}

export function AboutPage({
  aboutPage,
  projectInfo,
  previewMode = false,
  onNavigate,
}: AboutPageProps) {
  const effectiveAbout =
    !previewMode && aboutPage.status === 'draft' ? DEFAULT_ABOUT_PAGE : aboutPage;

  return (
    <div className="space-y-8 pb-14">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#0B3D3A] text-[#FBF8F1]">
        {effectiveAbout.anhBia && (
          <StationImage
            src={effectiveAbout.anhBia}
            alt={effectiveAbout.tieuDe}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div
          aria-hidden="true"
          className="heritage-pattern-overlay pointer-events-none absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B3D3A]/75 via-[#0B3D3A]/85 to-[#0B3D3A]" />

        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#E2B857]/40 bg-[#0B3D3A]/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#E2B857]">
            <Compass className="h-3.5 w-3.5" />
            <span>Giới thiệu dự án</span>
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold leading-tight text-[#FBF8F1] sm:text-4xl">
            <ChemText text={effectiveAbout.tieuDe} />
          </h1>
          {effectiveAbout.phuDe && (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#DCEFEA] sm:text-base">
              <ChemText text={effectiveAbout.phuDe} />
            </p>
          )}
        </div>
      </section>

      {/* Main Rich Content Card */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <article className="passport-frame rounded-[16px] bg-[#FBF8F1] p-6 sm:p-9">
          <RichHtmlWithChem html={effectiveAbout.noiDungHtml} />
        </article>
      </section>

      {/* Team Section synced with Home config */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="passport-frame rounded-[16px] bg-[#F3EDDD] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3DAC3] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#0B3D3A] text-[#E2B857]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A6414]">
                  {projectInfo.nhomThucHien.donVi}
                </p>
                <h2 className="font-serif text-xl font-bold text-[#17262B]">
                  {projectInfo.nhomThucHien.tenNhom}
                </h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6EBCB] px-3 py-1 text-xs font-bold text-[#8A6414]">
              <Award className="h-3.5 w-3.5" />
              <span>12 Trạm Di Sản</span>
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#4A5B60]">
            {projectInfo.nhomThucHien.gioiThieu}
          </p>

          {projectInfo.nhomThucHien.thanhVien.length > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projectInfo.nhomThucHien.thanhVien.map((member, idx) => (
                <div
                  key={idx}
                  className="rounded-[12px] border border-[#E3DAC3] bg-[#FBF8F1] p-3.5"
                >
                  <p className="text-sm font-bold text-[#17262B]">{member.hoTen}</p>
                  <p className="mt-1 text-xs text-[#4A5B60]">{member.vaiTro}</p>
                </div>
              ))}
            </div>
          )}

          {!previewMode && (
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#E3DAC3] pt-5">
              <button
                type="button"
                onClick={() => onNavigate('#/')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-2.5 text-sm font-bold text-[#FBF8F1] transition-colors hover:bg-[#137A6F]"
              >
                <span>Khám phá 12 trạm di sản</span>
                <ArrowRight className="h-4 w-4 text-[#E2B857]" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('#/tin-tuc')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border-[1.5px] border-[#137A6F] bg-[#FBF8F1] px-4 py-2.5 text-sm font-semibold text-[#137A6F] transition-colors hover:bg-[#DCEFEA]"
              >
                <span>Xem tin tức dự án</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
