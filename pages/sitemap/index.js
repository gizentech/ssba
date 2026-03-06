import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/PlaceholderPage.module.css';

const SITEMAP_LINKS = [
  { href: '/', label: 'トップ' },
  { href: '/reason', label: '選ばれる理由' },
  { href: '/course', label: 'コース・料金' },
  { href: '/facility', label: '施設紹介' },
  { href: '/coaches', label: '指導者紹介' },
  { href: '/news', label: 'お知らせ' },
  { href: '/blog', label: 'ブログ' },
  { href: '/contact', label: 'お問い合わせ' },
];

export default function SitemapPage() {
  return (
    <>
      <Head>
        <title>サイトマップ | SSBA</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>SITEMAP</p>
          <h1 className={styles.pageTitle}>サイトマップ</h1>
        </div>
        <div className={styles.content} style={{ alignItems: 'flex-start' }}>
          <ul style={{ textAlign: 'left' }}>
            {SITEMAP_LINKS.map((link) => (
              <li key={link.href} style={{ padding: '8px 0' }}>
                <Link href={link.href} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
