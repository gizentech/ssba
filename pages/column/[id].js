import SeoHead from '@/components/common/SeoHead';
import Link from 'next/link';
import styles from '@/styles/SubPage.module.css';
import articleStyles from '@/styles/ArticleDetail.module.css';
import { fetchColumns, fetchColumnById } from '@/lib/wp-api';

export async function getStaticPaths() {
  const columns = await fetchColumns();
  const paths = columns.map((col) => ({ params: { id: String(col.id) } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const article = await fetchColumnById(params.id);
  if (!article) return { notFound: true };
  return { props: { article } };
}

export default function ColumnDetailPage({ article }) {
  return (
    <>
      <SeoHead
        title={article.title}
        description={article.excerpt || `SSBAコーチによる野球コラム。打撃・守備・トレーニングなど野球上達のヒント。久留米の野球塾SSBA。`}
        keywords="SSBA,コラム,野球,トレーニング,久留米,福岡,野球塾"
        canonical="/column"
        ogImage={article.image || undefined}
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>コラム</h1>
            <p className={styles.pageSub}>COLUMN</p>
          </div>
        </div>
        <div className={styles.body}>
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
        </div>
      </div>
    </>
  );
}
