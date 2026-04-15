import SeoHead from '@/components/common/SeoHead';
import Link from 'next/link';
import styles from '@/styles/SubPage.module.css';
import articleStyles from '@/styles/ArticleDetail.module.css';
import { fetchNews, fetchNewsById } from '@/lib/wp-api';

export async function getStaticPaths() {
  const news = await fetchNews();
  const paths = news.map((item) => ({ params: { id: String(item.id) } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const article = await fetchNewsById(params.id);
  if (!article) return { notFound: true };
  return { props: { article } };
}

export default function NewsDetailPage({ article }) {
  return (
    <>
      <SeoHead
        title={article.title}
        description={article.excerpt || `SSBA久留米からのお知らせ。福岡県久留米市の野球塾・野球アカデミー。`}
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
        </div>
      </div>
    </>
  );
}
