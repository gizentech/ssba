'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import SectionTitle from '@/components/common/SectionTitle';
import styles from '@/styles/ContentsSection.module.css';

const CONTENTS_IMAGES = [
  { src: '/images/contents/3年生クラス.JPG', alt: '3年生クラス' },
  { src: '/images/contents/ラプソード.JPG', alt: 'ラプソード' },
];

const BANNERS = [
  { id: 1, src: '/images/banner/banner1.png', alt: 'バナー1', bg: '#e8e8e8' },
  { id: 2, src: '/images/banner/banner2.png', alt: 'バナー2', bg: '#dcdcdc' },
  { id: 3, src: '/images/banner/banner3.png', alt: 'バナー3', bg: '#e0e0e0' },
  { id: 4, src: '/images/banner/banner4.png', alt: 'バナー4', bg: '#d8d8d8' },
];

export default function ContentsSection() {
  const [popupImage, setPopupImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageClick = (img) => {
    setPopupImage(img);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.columns}>
            {/* Left: CONTENTS */}
            <div className={styles.left}>
              <SectionTitle english="CONTENTS" title="コンテンツ" />
              <div className={styles.imageGrid}>
                {CONTENTS_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    className={styles.imageButton}
                    onClick={() => handleImageClick(img)}
                  >
                    <img src={img.src} alt={img.alt} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: SUPPORT */}
            <div className={styles.right}>
              <SectionTitle english="SUPPORT" title="関連団体" />
              <div className={styles.bannerList}>
                {BANNERS.map((banner) => (
                  <a
                    key={banner.id}
                    href="#"
                    className={styles.bannerItem}
                    style={{ backgroundColor: banner.bg }}
                  >
                    <img
                      src={banner.src}
                      alt={banner.alt}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {popupImage && createPortal(
        <div
          className={styles.overlay}
          onClick={() => { setPopupImage(null); setLoading(false); }}
        >
          {loading ? (
            <div className={styles.spinner} />
          ) : (
            <img
              src={popupImage.src}
              alt={popupImage.alt}
              className={styles.overlayImage}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>,
        document.body
      )}
    </>
  );
}
