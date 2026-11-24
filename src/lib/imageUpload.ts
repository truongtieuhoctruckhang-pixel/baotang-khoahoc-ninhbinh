const MAX_DATA_URL_LENGTH = 295_000; // Dưới 300KB để lưu trực tiếp an toàn trong Firestore

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Không thể đọc dữ liệu hình ảnh này.'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Lỗi đọc tệp ảnh từ thiết bị.'));
    reader.readAsDataURL(file);
  });
}

function renderCompressedDataUrl(
  img: HTMLImageElement,
  maxWidth: number,
  quality: number
): string {
  const scale = img.width > maxWidth ? maxWidth / img.width : 1;
  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.');
  }

  ctx.fillStyle = '#FBF8F1';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL('image/jpeg', quality);
}

export async function compressImageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Vui lòng chọn tệp hình ảnh (JPG, PNG hoặc WebP).');
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Ảnh gốc quá lớn (vượt quá 15MB). Vui lòng chọn ảnh nhẹ hơn.');
  }

  const img = await loadImageFromFile(file);

  const attempts: Array<{ maxWidth: number; quality: number }> = [
    { maxWidth: 1000, quality: 0.78 },
    { maxWidth: 840, quality: 0.7 },
    { maxWidth: 720, quality: 0.62 },
    { maxWidth: 600, quality: 0.54 },
    { maxWidth: 480, quality: 0.48 },
    { maxWidth: 380, quality: 0.42 },
  ];

  for (const attempt of attempts) {
    const dataUrl = renderCompressedDataUrl(img, attempt.maxWidth, attempt.quality);
    if (dataUrl.length <= MAX_DATA_URL_LENGTH) {
      return dataUrl;
    }
  }

  throw new Error(
    'Ảnh vẫn vượt giới hạn 300KB sau khi nén. Vui lòng chọn ảnh khác hoặc dán link ảnh.'
  );
}
