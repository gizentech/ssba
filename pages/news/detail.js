import { useState, useEffect } from 'react';
import SeoHead from '@/components/common/SeoHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/SubPage.module.css';
import articleStyles from '@/styles/ArticleDetail.module.css';
import { fetchNewsById } from '@/lib/wp-api';

export default function NewsDetailPage() {
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = router.query.id;
    if (!id) return;
    fetchNewsById(id).then((data) => {
      if (!data) setNotFound(true);
      else setArticle(data);
      setLoading(false);
    });
  }, [router.query.id]);

  return (
    <>
      <SeoHead
        title={article ? article.title : 'お知らせ'}
        description={article?.excerpt || `SSBA久留米からのお知らせ。福岡県久留米市の野球塾・野球アカデミー。`}
        keywords="SSBA,お知らせ,野球塾,久留米,福岡"
        canonical="/news"
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>お知らせ</h1>
            <p className={styles.pageSub}>NEWS</p>
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
              <Link href="/news" className={articleStyles.backLink}>← お知らせ一覧へ</Link>
            </div>
          ) : (
            <article className={articleStyles.article}>
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
                <Link href="/news" className={articleStyles.backLink}>← お知らせ一覧へ</Link>
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  );
}
