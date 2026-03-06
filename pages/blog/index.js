import Head from 'next/head';
import styles from '@/styles/PlaceholderPage.module.css';

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>ブログ | SSBA</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>BLOG</p>
          <h1 className={styles.pageTitle}>ブログ</h1>
        </div>
        <div className={styles.content}>
          <p className={styles.comingSoon}>コンテンツ準備中です</p>
        </div>
      </div>
    </>
  );
}
