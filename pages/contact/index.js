import Head from 'next/head';
import styles from '@/styles/PlaceholderPage.module.css';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>お問い合わせ | SSBA</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>CONTACT</p>
          <h1 className={styles.pageTitle}>お問い合わせ</h1>
        </div>
        <div className={styles.content}>
          <p className={styles.comingSoon}>お問い合わせフォームは準備中です</p>
        </div>
      </div>
    </>
  );
}
