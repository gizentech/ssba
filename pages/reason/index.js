import Head from 'next/head';
import styles from '@/styles/PlaceholderPage.module.css';

export default function ReasonPage() {
  return (
    <>
      <Head>
        <title>選ばれる理由 | SSBA</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>REASON</p>
          <h1 className={styles.pageTitle}>選ばれる理由</h1>
        </div>
        <div className={styles.content}>
          <p className={styles.comingSoon}>コンテンツ準備中です</p>
        </div>
      </div>
    </>
  );
}
