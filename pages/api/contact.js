export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, type, message } = req.body;

  if (!name || !email || !type || !message) {
    return res.status(400).json({ message: '必須項目を入力してください' });
  }

  // TODO: nodemailer などでメール送信を設定する
  // 現状は受信確認のみ返す

  return res.status(200).json({ message: 'ok' });
}
