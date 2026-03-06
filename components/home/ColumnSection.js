'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import styles from '@/styles/ColumnSection.module.css';

const COLUMNS = [
  {
    id: 1,
    title: 'バッティングの基本姿勢について～正しいフォームを身につけることが上達への第一歩',
    date: '2026.03.01',
    category: 'コーチング',
    thumbnail: '/images/p2_bg.webp',
  },
  {
    id: 2,
    title: '冬場のトレーニング方法～オフシーズンにこそ差がつく',
    date: '2026.02.15',
    category: 'トレーニング',
    thumbnail: '/images/kawasaki_nagare.webp',
  },
  {
    id: 3,
    title: 'ピッチングフォームの改善ポイント',
    date: '2026.02.01',
    category: 'コーチング',
    thumbnail: '/images/makihara_nagare.webp',
  },
  {
    id: 4,
    title: '試合前のウォーミングアップの重要性',
    date: '2026.01.20',
    category: 'トレーニング',
    thumbnail: '/images/p2_bg.webp',
  },
  {
    id: 5,
    title: 'チームワークを高める練習メニュー',
    date: '2026.01.10',
    category: 'コーチング',
    thumbnail: '/images/kawasaki_nagare.webp',
  },
];

function CardItem({ col }) {
  return (
    <Link href="/column" className={styles.card}>
      <div className={styles.cardImage}>
        <img src={col.thumbnail} alt={col.title} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{col.title}</h3>
        <div className={styles.cardMeta}>
          <span className={styles.metaDate}>{col.date}</span>
          <span className={styles.metaCategory}>{col.category}</span>
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
  const featured = COLUMNS[0];
  const sideArticles = COLUMNS.slice(1, 5);

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
          <Link href="/column" className={styles.featured}>
            <div className={styles.featuredImage}>
              <img src={featured.thumbnail} alt={featured.title} />
            </div>
            <div className={styles.featuredBody}>
              <h3 className={styles.featuredTitle}>{featured.title}</h3>
              <div className={styles.featuredMeta}>
                <span className={styles.metaDate}>{featured.date}</span>
                <span className={styles.metaCategory}>{featured.category}</span>
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
        <MobileCarousel articles={sideArticles} />

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