import Head from 'next/head';
import styles from '@/styles/PlaceholderPage.module.css';

export default function FacilityPage() {
  return (
    <>
      <Head>
        <title>施設紹介 | SSBA</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>FACILITY</p>
          <h1 className={styles.pageTitle}>施設紹介</h1>
        </div>
        <div className={styles.content}>
          <p className={styles.comingSoon}>コンテンツ準備中です</p>
        </div>
      </div>
    </>
  );
}
