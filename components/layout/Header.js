import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Header.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'トップ' },

  { href: '/reason', label: '選ばれる理由' },
  { href: '/course', label: 'コース・料金' },
  { href: '/facility', label: '施設紹介' },
  { href: '/coaches', label: '指導者紹介' },
  { href: '/news', label: 'お知らせ' },
  { href: '/column', label: 'コラム' },
  { href: '/access', label: 'アクセス' },
];

export default function Header({ isHome }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWhiteHeader, setShowWhiteHeader] = useState(!isHome);
  const [logoScale, setLogoScale] = useState(null);

  useEffect(() => {
    // セカンドページ（index以外）は常に白ヘッダー
    if (!isHome) {
      setShowWhiteHeader(true);
      return;
    }

    // トップページに戻ったらスクロール位置に応じてリセット
    setShowWhiteHeader(false);

    const isSP = window.innerWidth <= 960;
    const maxScale = isSP ? 2 : 4;
    const minScale = isSP ? 2 : 4;
    setLogoScale(maxScale);

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowWhiteHeader(false);
        return;
      }
      const proSection = document.getElementById('pro-support');
      if (proSection) {
        const rect = proSection.getBoundingClientRect();
        setShowWhiteHeader(rect.top <= 0);
      }

      const vh = window.innerHeight;
      const progress = Math.min(1, window.scrollY / (vh * 0.7));
      const newScale = maxScale - (maxScale - minScale) * progress;
      setLogoScale(newScale);
    };

    const handleResize = () => {
      const nowSP = window.innerWidth <= 960;
      const newMax = nowSP ? 2 : 4;
      const newMin = nowSP ? 2 : 4;
      const vh = window.innerHeight;
      const progress = Math.min(1, window.scrollY / (vh * 0.7));
      setLogoScale(newMax - (newMax - newMin) * progress);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isHome]);

  // PCで白ヘッダーに切り替わったらメニューを自動で閉じる
  useEffect(() => {
    if (showWhiteHeader && window.innerWidth > 960) {
      setMenuOpen(false);
    }
  }, [showWhiteHeader]);

  return (
    <>
      <header
        className={`${styles.header} ${showWhiteHeader ? styles.headerWhite : ''}`}
        style={{
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <div className={styles.headerInner}>
          {/* ロゴ */}
          <Link
            href="/"
            className={styles.logo}
            style={!showWhiteHeader && logoScale !== null ? { transform: `scale(${logoScale})` } : undefined}
          >
            <Image
              src={showWhiteHeader ? '/images/logo_after.png' : '/images/logo_before.png'}
              alt="SSBA - Shootingstar Baseball Academy"
              width={200}
              height={60}
              priority
            />
          </Link>

          {/* PC用ナビゲーション（白ヘッダー時のみ表示） */}
          {showWhiteHeader && (
            <nav className={styles.desktopNav}>
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={styles.desktopNavLink}>
                  {item.label}
                </Link>
              ))}
              <Link href="/contact" className={styles.desktopNavContact}>お問い合わせ</Link>
            </nav>
          )}
        </div>
      </header>

      {/* ハンバーガー（ヘッダー外で独立したz-index） */}
      <button
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''} ${showWhiteHeader ? styles.hamburgerWhiteHeader : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="メニュー"
      >
        <span />
        <span />
        <span />
      </button>

      {/* オーバーレイ + スライドナビ（ヘッダー外で独立したz-index） */}
      <div
        className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayVisible : ''}`}
        onClick={() => setMenuOpen(false)}
      />
      <nav className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ''}`}>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={styles.mobileNavLink} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href="/contact" className={styles.mobileNavContact} onClick={() => setMenuOpen(false)}>お問い合わせ</Link>
      </nav>
    </>
  );
}
