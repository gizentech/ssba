import { useState, useEffect } from 'react';
import SeoHead from '@/components/common/SeoHead';
import styles from '@/styles/SubPage.module.css';
import articleStyles from '@/styles/ArticleDetail.module.css';
import { fetchPrivacyPolicy } from '@/lib/wp-api';

export default function PrivacyPolicyPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPolicy().then((data) => {
      setPage(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SeoHead
        title="プライバシーポリシー"
        description="SSBA（シューティングスターベースボールアカデミー）のプライバシーポリシー。個人情報の取り扱いについて記載しています。"
        keywords="SSBA,プライバシーポリシー,個人情報"
        canonical="/privacy-policy"
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>プライバシーポリシー</h1>
            <p className={styles.pageSub}>PRIVACY POLICY</p>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.section}>
            {loading ? (
              <p className={styles.text} style={{ color: '#888' }}>読み込み中...</p>
            ) : !page ? (
              <p className={styles.text}>
                現在準備中です。しばらくお待ちください。<br />
                お急ぎの場合は <a href="mailto:ssba1223dn@gmail.com" style={{ color: 'var(--color-primary)' }}>ssba1223dn@gmail.com</a> までご連絡ください。
              </p>
            ) : (
              <div
                className={articleStyles.articleContent}
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
