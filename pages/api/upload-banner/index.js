import fs from 'fs';
import path from 'path';

const BANNER_DIR = path.join(process.cwd(), 'public', 'images', 'banner');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, type, data } = req.body;

  if (!filename || !type || !data) {
    return res.status(400).json({ error: 'filename, type, data が必要です' });
  }

  if (!ALLOWED_TYPES.includes(type)) {
    return res.status(400).json({ error: '画像ファイル（JPEG/PNG/WebP/GIF/SVG）のみアップロード可能です' });
  }

  // base64 → Buffer
  const base64Data = data.replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  if (buffer.length > MAX_SIZE_BYTES) {
    return res.status(400).json({ error: 'ファイルサイズは5MB以下にしてください' });
  }

  // ファイル名をサニタイズ（英数字・ハイフン・アンダースコア・ドットのみ）
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = `${basename}${ext}`;
  const savePath = path.join(BANNER_DIR, safeName);

  fs.mkdirSync(BANNER_DIR, { recursive: true });
  fs.writeFileSync(savePath, buffer);

  return res.status(200).json({ path: `/images/banner/${safeName}` });
}
