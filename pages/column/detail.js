import { useState, useEffect } from 'react';
import SeoHead from '@/components/common/SeoHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/SubPage.module.css';
import articleStyles from '@/styles/ArticleDetail.module.css';
import { fetchColumnById } from '@/lib/wp-api';

export default function ColumnDetailPage() {
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = router.query.id;
    if (!id) return;
    fetchColumnById(id).then((data) => {
      if (!data) setNotFound(true);
      else setArticle(data);
      setLoading(false);
    });
  }, [router.query.id]);

  return (
    <>
      <SeoHead
        title={article ? article.title : 'コラム'}
        description={article?.excerpt || `SSBAコーチによる野球コラム。打撃・守備・トレーニングなど野球上達のヒント。久留米の野球塾SSBA。`}
        keywords="SSBA,コラム,野球,トレーニング,久留米,福岡,野球塾"
        canonical="/column"
        ogImage={article?.image || undefined}
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>コラム</h1>
            <p className={styles.pageSub}>COLUMN</p>
          </div>
        </div>
        <div className={styles.body}>
          {loading ? (
            <div className={styles.section}>
              <p className={styles.text} style={{ color: '#888' }}>読み込み中...</p>
            </div>
          ) : notFound ? (
            <div className={styles.section}>
              <p className={styles.text}>記事が見つかりません。</p>
              <Link href="/column" className={articleStyles.backLink}>← コラム一覧へ</Link>
            </div>
          ) : (
            <article className={articleStyles.article}>
              {article.image && (
                <div className={articleStyles.eyecatch}>
                  <img src={article.image} alt={article.title} />
                </div>
              )}
              <div className={articleStyles.articleMeta}>
                <span className={articleStyles.date}>{article.date}</span>
                {article.tag && <span className={articleStyles.tag}>{article.tag}</span>}
              </div>
              <h2 className={articleStyles.articleTitle}>{article.title}</h2>
              <div
                className={articleStyles.articleContent}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              <div className={articleStyles.backWrap}>
                <Link href="/column" className={articleStyles.backLink}>← コラム一覧へ</Link>
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
