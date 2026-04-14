import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Footer.module.css';

const FOOTER_LINKS = [
  { label: '選ばれる理由', href: '/reason' },
  { label: 'コース・料金', href: '/course' },
  { label: '施設紹介', href: '/facility' },
  { label: '指導者紹介', href: '/coaches' },
  { label: 'お知らせ', href: '/news' },
  { label: 'コラム', href: '/column' },
  { label: 'アクセス', href: '/about' },
  { label: 'お問い合わせ', href: '/contact' },
];

export default function Footer() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_WP_API || 'https://ssba1223.com/wp/wp-json/ssba/v1';
    fetch(`${api}/partners`)
      .then((r) => r.json())
      .then((d) => setPartners(d.partners || []))
      .catch(() => {});
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          {/* 左側：会社情報 */}
          <div className={styles.footerInfo}>
            <div className={styles.footerLogo}>
              <Image
                src="/images/logo_before.png"
                alt="SSBA"
                width={120}
                height={43}
              />
            </div>
            <p className={styles.footerName}>SSBA野球塾</p>
            <p className={styles.footerSubName}>Shootingstar baseball academy</p>
            <address className={styles.footerAddress}>
              <p>福岡県久留米市安武町安武本2930-6</p>
              <p>Mail：<a href="mailto:ssba1223dn@gmail.com">ssba1223dn@gmail.com</a></p>
            </address>
            <div className={styles.footerSocial}>
              <a href="https://www.instagram.com/nagare007ssba/" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@7nagare_starbaseball" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
                </svg>
              </a>
              <a href="https://line.me/R/ti/p/%40vyx4744a" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink} aria-label="LINE">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
              </a>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/privacy-policy" className={styles.footerLink}>プライバシーポリシー</Link>
            </div>
          </div>

          {/* 右側：ナビ + 関連事業 */}
          <div className={styles.footerRight}>
            {/* フッターナビゲーション */}
            <div className={styles.footerBusiness}>
              <div className={styles.footerBusinessGrid}>
                {FOOTER_LINKS.map((link) => (
                  <Link key={link.label} href={link.href} className={styles.footerBusinessLink}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} SSBA - Shootingstar Baseball Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
