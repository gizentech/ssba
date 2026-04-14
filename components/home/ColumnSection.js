'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import styles from '@/styles/ColumnSection.module.css';

function CardItem({ col }) {
  return (
    <Link href={`/column/detail?id=${col.id}`} className={styles.card}>
      <div className={styles.cardImage}>
        <img src={col.image || col.thumbnail || '/images/eye-catch.webp'} alt={col.title} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{col.title}</h3>
        <div className={styles.cardMeta}>
          <span className={styles.metaDate}>{col.date}</span>
          {(col.tag || col.category) && (
            <span className={styles.metaCategory}>{col.tag || col.category}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function MobileCarousel({ articles }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const total = articles.length;

  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;
    if (diff > 0) {
      setCurrent((prev) => (prev + 1) % total);
    } else {
      setCurrent((prev) => (prev - 1 + total) % total);
    }
  }, [total]);

  return (
    <div className={styles.sideGrid}>
      <div
        className={styles.carouselTrack}
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {articles.map((col) => (
          <CardItem key={col.id} col={col} />
        ))}
      </div>
      <div className={styles.dots}>
        {articles.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`記事 ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ColumnSection() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_WP_API || 'https://ssba1223.com/wp/wp-json/ssba/v1';
    fetch(`${api}/columns?per_page=5`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setColumns(data);
      })
      .catch(() => {});
  }, []);

  if (columns.length === 0) return null;

  const featured = columns[0];
  const sideArticles = columns.slice(1, 5);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <SectionTitle english="COLUMN" title="コラム" />
          <Link href="/column" className={styles.headerLink}>
            全ての記事を見る
            <span className={styles.headerLinkArrow}>&#x3e;</span>
          </Link>
        </div>

        <div className={styles.layout}>
          <Link href={`/column/detail?id=${featured.id}`} className={styles.featured}>
            <div className={styles.featuredImage}>
              <img src={featured.image || featured.thumbnail || '/images/eye-catch.webp'} alt={featured.title} />
            </div>
            <div className={styles.featuredBody}>
              <h3 className={styles.featuredTitle}>{featured.title}</h3>
              <div className={styles.featuredMeta}>
                <span className={styles.metaDate}>{featured.date}</span>
                {(featured.tag || featured.category) && (
                  <span className={styles.metaCategory}>{featured.tag || featured.category}</span>
                )}
              </div>
            </div>
          </Link>

          {/* PC: 2x2 grid */}
          <div className={styles.sideGridPc}>
            {sideArticles.map((col) => (
              <CardItem key={col.id} col={col} />
            ))}
          </div>
        </div>

        {/* SP: carousel */}
        {sideArticles.length > 0 && <MobileCarousel articles={sideArticles} />}

        <div className={styles.moreLink}>
          <Link href="/column" className={styles.moreLinkBtn}>
            全ての記事を見る
            <span className={styles.moreLinkArrow}>&#x3e;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
