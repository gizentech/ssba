import { useState, useEffect } from 'react';
import SeoHead from '@/components/common/SeoHead';
import Link from 'next/link';
import styles from '@/styles/SubPage.module.css';
import listStyles from '@/styles/NewsList.module.css';
import { fetchNews } from '@/lib/wp-api';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews().then((data) => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SeoHead
        title="お知らせ｜最新情報【SSBA 久留米】"
        description="SSBA（シューティングスターベースボールアカデミー）の最新お知らせ。体験レッスン情報・イベント・プロ野球選手の自主トレ報告など久留米の野球塾からの最新情報。"
        keywords="SSBA,お知らせ,ニュース,野球塾,久留米,福岡,プロ野球,自主トレ,体験レッスン,イベント"
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
          <div className={styles.section}>
            {loading ? (
              <p className={listStyles.empty} style={{ color: '#888' }}>読み込み中...</p>
            ) : news.length === 0 ? (
              <p className={listStyles.empty}>お知らせはありません</p>
            ) : (
              <ul className={listStyles.list}>
                {news.map((item) => (
                  <li key={item.id} className={listStyles.item}>
                    <Link href={`/news/detail?id=${item.id}`} className={listStyles.link}>
                      <span className={listStyles.date}>{item.date}</span>
                      <span className={listStyles.importantWrap}>
                        {item.important && (
                          <span className={listStyles.important}>重要</span>
                        )}
                      </span>
                      <span className={listStyles.tagWrap}>
                        {item.tag
                          ? <span className={listStyles.tag}>{item.tag}</span>
                          : <span className={listStyles.tagEmpty} />
                        }
                      </span>
                      <span className={listStyles.title}>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
