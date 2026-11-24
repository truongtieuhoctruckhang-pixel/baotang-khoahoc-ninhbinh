import { Eye, FileText, Home, LayoutGrid, Loader2, Newspaper, Save, Send } from 'lucide-react';
import type { AdminTab } from '../lib/routes';

interface AdminTabBarProps {
  activeTab: AdminTab;
  newsCount: number;
  hasDraftStation: boolean;
  hasDraftNews: boolean;
  saving: boolean;
  onSelectTab: (tab: AdminTab) => void;
  onPreview: () => void;
  onSaveStation: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function AdminTabBar({
  activeTab,
  newsCount,
  hasDraftStation,
  hasDraftNews,
  saving,
  onSelectTab,
  onPreview,
  onSaveStation,
  onSaveDraft,
  onPublish,
}: AdminTabBarProps) {
  const tabs: { id: AdminTab; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'stations', label: '12 Trạm di sản', icon: LayoutGrid },
    { id: 'news', label: `Tin tức (${newsCount})`, icon: Newspaper },
    { id: 'about', label: 'Giới thiệu', icon: FileText },
    { id: 'home', label: 'Trang chủ & 3 Cụm', icon: Home },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div
        className="inline-flex flex-wrap gap-1 rounded-[14px] border border-[#E3DAC3] bg-[#F3EDDD] p-1"
        role="tablist"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-[10px] px-3.5 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0B3D3A] text-[#FBF8F1] shadow-[0_4px_12px_rgba(11,61,58,0.12)]'
                  : 'text-[#4A5B60] hover:text-[#0B3D3A]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(activeTab !== 'news' || hasDraftNews) && (
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-[12px] border-[1.5px] border-[#137A6F] bg-[#FBF8F1] px-3.5 py-2 text-sm font-semibold text-[#137A6F] hover:bg-[#DCEFEA]"
          >
            <Eye className="h-4 w-4" />
            <span>Xem trước</span>
          </button>
        )}

        {activeTab === 'stations' && hasDraftStation && (
          <button
            type="button"
            onClick={onSaveStation}
            disabled={saving}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-2 text-sm font-bold text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.12)] hover:bg-[#137A6F] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-[#E2B857]" />}
            <span>Lưu</span>
          </button>
        )}

        {activeTab !== 'stations' && (activeTab !== 'news' || hasDraftNews) && (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={onSaveDraft}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-[12px] border border-[#C9962E] bg-[#F6EBCB] px-3.5 py-2 text-sm font-semibold text-[#8A6414] hover:bg-[#E2B857]/40 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              <span>Lưu nháp</span>
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onPublish}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-[12px] bg-[#0B3D3A] px-5 py-2 text-sm font-bold text-[#FBF8F1] shadow-[0_8px_24px_rgba(11,61,58,0.12)] hover:bg-[#137A6F] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-[#E2B857]" />}
              <span>Đăng</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
