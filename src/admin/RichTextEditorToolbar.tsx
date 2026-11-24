import { useRef, useState, type ChangeEvent } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Table2,
  Underline,
  Youtube,
} from 'lucide-react';
import { compressImageToDataUrl } from '../lib/imageUpload';
import { sanitizePlainUrl } from '../lib/sanitize';
import { extractYoutubeId } from '../lib/youtube';

export type RichPopoverTarget = 'table' | 'image' | 'youtube' | 'link' | null;

interface RichTextEditorToolbarProps {
  activePopover: RichPopoverTarget;
  onTogglePopover: (target: Exclude<RichPopoverTarget, null>) => void;
  onClosePopover: () => void;
  onExecCommand: (command: string, val?: string) => void;
  onInsertHtml: (htmlSnippet: string) => void;
}

const BTN_CLASS =
  'inline-flex h-9 min-w-[36px] items-center justify-center rounded-[8px] border border-transparent px-2 text-xs font-semibold text-[#17262B] transition-colors hover:border-[#E3DAC3] hover:bg-[#FBF8F1] active:scale-[0.97]';

export function RichTextEditorToolbar({
  activePopover,
  onTogglePopover,
  onClosePopover,
  onExecCommand,
  onInsertHtml,
}: RichTextEditorToolbarProps) {
  const imageUploadRef = useRef<HTMLInputElement | null>(null);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [linkTextInput, setLinkTextInput] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [editorMessage, setEditorMessage] = useState<string | null>(null);

  const handleToggle = (target: Exclude<RichPopoverTarget, null>) => {
    setEditorMessage(null);
    onTogglePopover(target);
  };

  const handleInsertTable = () => {
    const rows = Math.max(1, Math.min(12, tableRows));
    const cols = Math.max(1, Math.min(8, tableCols));
    let html = '<table><thead><tr>';
    for (let c = 0; c < cols; c++) html += `<th>Tiêu đề ${c + 1}</th>`;
    html += '</tr></thead><tbody>';
    for (let r = 1; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) html += '<td>Nội dung</td>';
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    onInsertHtml(html);
    onClosePopover();
  };

  const handleInsertImageUrl = () => {
    const safeUrl = sanitizePlainUrl(imageUrlInput);
    if (!safeUrl) {
      setEditorMessage('Vui lòng dán đường dẫn ảnh hợp lệ (bắt đầu bằng https:// hoặc http://).');
      return;
    }
    onInsertHtml(`<p><img src="${safeUrl}" alt="Hình ảnh minh họa" /></p><p><br></p>`);
    setImageUrlInput('');
    setEditorMessage(null);
    onClosePopover();
  };

  const handleUploadImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingImg(true);
    setEditorMessage(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      onInsertHtml(`<p><img src="${dataUrl}" alt="${file.name.replace(/"/g, '')}" /></p><p><br></p>`);
      onClosePopover();
    } catch (err) {
      setEditorMessage(err instanceof Error ? err.message : 'Không thể tải ảnh lên.');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleInsertYoutube = () => {
    const parsed = extractYoutubeId(youtubeUrlInput);
    if (!parsed.isValid) {
      setEditorMessage('Không nhận diện được ID YouTube. Hãy dán link YouTube hoặc mã ID 11 ký tự.');
      return;
    }
    const embedSrc = `https://www.youtube-nocookie.com/embed/${parsed.videoId}?rel=0`;
    onInsertHtml(
      `<div class="cms-video-embed"><iframe src="${embedSrc}" title="Video YouTube" allowfullscreen loading="lazy"></iframe></div><p><br></p>`
    );
    setYoutubeUrlInput('');
    setEditorMessage(null);
    onClosePopover();
  };

  const handleInsertLink = () => {
    const safeUrl = sanitizePlainUrl(linkUrlInput);
    if (!safeUrl) {
      setEditorMessage('Đường dẫn liên kết phải bắt đầu bằng https:// hoặc http://');
      return;
    }
    const label = (linkTextInput.trim() || safeUrl).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    onInsertHtml(`<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`);
    setLinkUrlInput('');
    setLinkTextInput('');
    setEditorMessage(null);
    onClosePopover();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E3DAC3] bg-[#F3EDDD] p-2">
        <button type="button" title="In đậm" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('bold')} className={BTN_CLASS}>
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" title="In nghiêng" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('italic')} className={BTN_CLASS}>
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" title="Gạch chân" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('underline')} className={BTN_CLASS}>
          <Underline className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-[#E3DAC3]" />

        <button type="button" title="Tiêu đề lớn (H2)" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('formatBlock', 'h2')} className={BTN_CLASS}>
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" title="Tiêu đề vừa (H3)" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('formatBlock', 'h3')} className={BTN_CLASS}>
          <Heading3 className="h-4 w-4" />
        </button>
        <button type="button" title="Đoạn văn bản thường" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('formatBlock', 'p')} className={BTN_CLASS}>
          P
        </button>

        <span className="mx-1 h-5 w-px bg-[#E3DAC3]" />

        <button type="button" title="Danh sách chấm đầu dòng" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('insertUnorderedList')} className={BTN_CLASS}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" title="Danh sách đánh số" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('insertOrderedList')} className={BTN_CLASS}>
          <ListOrdered className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-[#E3DAC3]" />

        <button type="button" title="Căn trái" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('justifyLeft')} className={BTN_CLASS}>
          <AlignLeft className="h-4 w-4" />
        </button>
        <button type="button" title="Căn giữa" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('justifyCenter')} className={BTN_CLASS}>
          <AlignCenter className="h-4 w-4" />
        </button>
        <button type="button" title="Căn phải" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('justifyRight')} className={BTN_CLASS}>
          <AlignRight className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-[#E3DAC3]" />

        <button type="button" title="Chèn bảng" onMouseDown={(e) => e.preventDefault()} onClick={() => handleToggle('table')} className={`${BTN_CLASS} gap-1 ${activePopover === 'table' ? 'bg-[#DCEFEA] text-[#0B3D3A]' : ''}`}>
          <Table2 className="h-4 w-4 text-[#137A6F]" />
          <span className="hidden sm:inline">Bảng</span>
        </button>
        <button type="button" title="Chèn ảnh (link hoặc tải lên)" onMouseDown={(e) => e.preventDefault()} onClick={() => handleToggle('image')} className={`${BTN_CLASS} gap-1 ${activePopover === 'image' ? 'bg-[#DCEFEA] text-[#0B3D3A]' : ''}`}>
          <ImagePlus className="h-4 w-4 text-[#137A6F]" />
          <span className="hidden sm:inline">Ảnh</span>
        </button>
        <button type="button" title="Chèn video YouTube" onMouseDown={(e) => e.preventDefault()} onClick={() => handleToggle('youtube')} className={`${BTN_CLASS} gap-1 ${activePopover === 'youtube' ? 'bg-[#DCEFEA] text-[#0B3D3A]' : ''}`}>
          <Youtube className="h-4 w-4 text-[#C2553A]" />
          <span className="hidden sm:inline">YouTube</span>
        </button>
        <button type="button" title="Chèn liên kết" onMouseDown={(e) => e.preventDefault()} onClick={() => handleToggle('link')} className={`${BTN_CLASS} ${activePopover === 'link' ? 'bg-[#DCEFEA] text-[#0B3D3A]' : ''}`}>
          <Link2 className="h-4 w-4 text-[#137A6F]" />
        </button>
        <button type="button" title="Xóa định dạng" onMouseDown={(e) => e.preventDefault()} onClick={() => onExecCommand('removeFormat')} className={BTN_CLASS}>
          <Eraser className="h-4 w-4 text-[#4A5B60]" />
        </button>
      </div>

      {activePopover === 'table' && (
        <div className="flex flex-wrap items-center gap-3 border-b border-[#E3DAC3] bg-[#F6EBCB]/60 p-3 text-xs">
          <span className="font-bold text-[#8A6414]">Chèn bảng:</span>
          <label className="inline-flex items-center gap-1.5 font-semibold">
            <span>Số dòng:</span>
            <input type="number" min={1} max={12} value={tableRows} onChange={(e) => setTableRows(Number(e.target.value) || 2)} className="w-16 rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] px-2 py-1 text-center" />
          </label>
          <label className="inline-flex items-center gap-1.5 font-semibold">
            <span>Số cột:</span>
            <input type="number" min={1} max={8} value={tableCols} onChange={(e) => setTableCols(Number(e.target.value) || 2)} className="w-16 rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] px-2 py-1 text-center" />
          </label>
          <button type="button" onClick={handleInsertTable} className="rounded-[8px] bg-[#0B3D3A] px-3 py-1.5 font-bold text-[#FBF8F1] hover:bg-[#137A6F]">Chèn bảng</button>
        </div>
      )}

      {activePopover === 'image' && (
        <div className="space-y-2 border-b border-[#E3DAC3] bg-[#DCEFEA]/50 p-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Dán link ảnh (https://...)" className="min-w-[200px] flex-1 rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] px-3 py-1.5 text-sm" />
            <button type="button" onClick={handleInsertImageUrl} className="rounded-[8px] bg-[#0B3D3A] px-3 py-1.5 font-bold text-[#FBF8F1] hover:bg-[#137A6F]">Chèn từ link</button>
            <button type="button" disabled={uploadingImg} onClick={() => imageUploadRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#137A6F] bg-[#FBF8F1] px-3 py-1.5 font-semibold text-[#137A6F] hover:bg-[#DCEFEA]">
              {uploadingImg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              <span>Tải ảnh lên (&lt;300KB)</span>
            </button>
            <input ref={imageUploadRef} type="file" accept="image/*" onChange={handleUploadImageFile} className="hidden" />
          </div>
          {editorMessage && <p className="font-medium text-[#C2553A]">{editorMessage}</p>}
        </div>
      )}

      {activePopover === 'youtube' && (
        <div className="space-y-2 border-b border-[#E3DAC3] bg-[#F6EBCB]/55 p-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <input type="text" value={youtubeUrlInput} onChange={(e) => setYoutubeUrlInput(e.target.value)} placeholder="Dán link YouTube (watch?v=, youtu.be/, shorts/ hoặc ID)" className="min-w-[220px] flex-1 rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] px-3 py-1.5 text-sm" />
            <button type="button" onClick={handleInsertYoutube} className="rounded-[8px] bg-[#0B3D3A] px-3 py-1.5 font-bold text-[#FBF8F1] hover:bg-[#137A6F]">Chèn video YouTube</button>
          </div>
          {editorMessage && <p className="font-medium text-[#C2553A]">{editorMessage}</p>}
        </div>
      )}

      {activePopover === 'link' && (
        <div className="space-y-2 border-b border-[#E3DAC3] bg-[#F3EDDD]/70 p-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <input type="text" value={linkTextInput} onChange={(e) => setLinkTextInput(e.target.value)} placeholder="Chữ hiển thị" className="w-44 rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] px-3 py-1.5 text-sm" />
            <input type="text" value={linkUrlInput} onChange={(e) => setLinkUrlInput(e.target.value)} placeholder="https://..." className="min-w-[200px] flex-1 rounded-[8px] border border-[#E3DAC3] bg-[#FBF8F1] px-3 py-1.5 text-sm" />
            <button type="button" onClick={handleInsertLink} className="rounded-[8px] bg-[#0B3D3A] px-3 py-1.5 font-bold text-[#FBF8F1] hover:bg-[#137A6F]">Chèn liên kết</button>
          </div>
          {editorMessage && <p className="font-medium text-[#C2553A]">{editorMessage}</p>}
        </div>
      )}
    </>
  );
}
