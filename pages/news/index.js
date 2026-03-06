import Head from 'next/head';
import styles from '@/styles/PlaceholderPage.module.css';

export default function NewsPage() {
  return (
    <>
      <Head>
        <title>お知らせ | SSBA</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>NEWS</p>
          <h1 className={styles.pageTitle}>お知らせ</h1>
        </div>
        <div className={styles.content}>
          <p className={styles.comingSoon}>コンテンツ準備中です</p>
        </div>
      </div>
    </>
  );
}
