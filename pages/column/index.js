import { useState, useEffect } from 'react';
import SeoHead from '@/components/common/SeoHead';
import Link from 'next/link';
import styles from '@/styles/SubPage.module.css';
import listStyles from '@/styles/ArticleList.module.css';
import { fetchColumns } from '@/lib/wp-api';

export default function ColumnPage() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColumns().then((data) => {
      setColumns(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SeoHead
        title="コラム｜野球技術・トレーニング情報【SSBA 久留米】"
        description="SSBAコーチによる野球コラム。打撃・守備・投球フォーム・トレーニング方法など上達に役立つ情報を発信。プロ野球選手指導の経験から学べる野球上達のヒント。"
        keywords="SSBA,コラム,野球,打撃,守備,投球,トレーニング,上達,久留米,福岡,野球塾,プロ野球"
        canonical="/column"
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>コラム</h1>
            <p className={styles.pageSub}>COLUMN</p>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.section}>
            {loading ? (
              <p className={listStyles.empty} style={{ color: '#888' }}>読み込み中...</p>
            ) : columns.length === 0 ? (
              <p className={listStyles.empty}>コラムはありません</p>
            ) : (
              <div className={listStyles.grid}>
                {columns.map((col) => (
                  <Link key={col.id} href={`/column/detail?id=${col.id}`} className={listStyles.card}>
                    <div className={listStyles.cardImage}>
                      <img
                        src={col.image || '/images/eye-catch.webp'}
                        alt={col.title}
                      />
                    </div>
                    <div className={listStyles.cardBody}>
                      <div className={listStyles.cardMeta}>
                        <span className={listStyles.metaDate}>{col.date}</span>
                        {col.tag && (
                          <span className={listStyles.metaTag}>{col.tag}</span>
                        )}
                      </div>
                      <h2 className={listStyles.cardTitle}>{col.title}</h2>
                      {col.excerpt && (
                        <p style={{ fontSize: 13, color: '#555', margin: 0, lineHeight: 1.6 }}>
                          {col.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
