import { useState } from 'react';
import Link from 'next/link';

const ADMIN_MENU = [
  { href: '/admin/availability', label: '空き状況管理' },
  { href: '/admin/news', label: 'お知らせ管理' },
  { href: '/admin/column', label: 'コラム管理' },
  { href: '/', label: 'サイトを表示' },
];

const WP_API = process.env.NEXT_PUBLIC_WP_API || 'https://ssba1223.com/wp/wp-json/ssba/v1';

export default function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  const sendTestMail = async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch(`${WP_API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テスト送信',
          email: 'ssba1223dn@gmail.com',
          type: 'その他',
          message: 'これは管理画面からのテストメールです。',
        }),
      });
      if (res.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch {
      setTestStatus('error');
    } finally {
      setTesting(false);
      setTimeout(() => setTestStatus(null), 4000);
    }
  };

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--color-black, #1a1a1a)', color: '#fff',
        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>SSBA 管理</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="管理メニュー"
          style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 2, background: '#fff', transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: '#fff', transition: 'opacity 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: '#fff', transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </header>

      {/* オーバーレイ */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
        />
      )}

      {/* スライドメニュー */}
      <nav style={{
        position: 'fixed', top: 0, right: menuOpen ? 0 : -280, width: 280, height: '100vh',
        background: '#fff', zIndex: 300, padding: '60px 24px 24px',
        transition: 'right 0.3s ease', boxShadow: menuOpen ? '-4px 0 12px rgba(0,0,0,0.1)' : 'none',
      }}>
        {ADMIN_MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', padding: '14px 0', fontSize: 15, fontWeight: 500,
              color: 'var(--color-black, #1a1a1a)', borderBottom: '1px solid #f0f0f0',
            }}
          >
            {item.label}
          </Link>
        ))}

        <div style={{ marginTop: 24 }}>
          <button
            onClick={sendTestMail}
            disabled={testing}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 6, border: 'none',
              background: testStatus === 'success' ? '#16a34a' : testStatus === 'error' ? '#dc2626' : '#2563eb',
              color: '#fff', fontSize: 14, fontWeight: 600, cursor: testing ? 'wait' : 'pointer',
              transition: 'background 0.3s',
            }}
          >
            {testing ? '送信中...' : testStatus === 'success' ? '送信成功 ✓' : testStatus === 'error' ? '送信失敗 ✗' : 'テストメール送信'}
          </button>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, textAlign: 'center' }}>
            ssba1223dn@gmail.com 宛に送信
          </p>
        </div>
      </nav>
    </>
  );
}
