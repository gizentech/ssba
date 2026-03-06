import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Footer.module.css';

const RELATED_BUSINESSES = [
  { label: '室内練習場貸出', href: '/facility' },
  { label: 'パーソナルレッスン', href: '/course' },
  { label: 'ラプソード計測', href: '/course' },
  { label: 'チーム指導', href: '/course' },
  { label: 'イベント企画', href: '/news' },
  { label: 'スカウト事業', href: '/about' },
];

export default function Footer() {
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
              <p>TEL：<a href="tel:09013627517">090-1362-7517</a></p>
              <p>Mail：<a href="mailto:ssba1223dn@gmail.com">ssba1223dn@gmail.com</a></p>
            </address>
          </div>

          {/* 右側：関連事業 */}
          <div className={styles.footerBusiness}>
            <h4 className={styles.footerBusinessTitle}>関連事業</h4>
            <div className={styles.footerBusinessGrid}>
              {RELATED_BUSINESSES.map((biz) => (
                <Link key={biz.label} href={biz.href} className={styles.footerBusinessLink}>
                  {biz.label}
                </Link>
              ))}
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
