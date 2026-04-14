import { useState } from 'react';
import { createPortal } from 'react-dom';
import SectionTitle from '@/components/common/SectionTitle';
import styles from '@/styles/ContentsSection.module.css';

export default function ContentsSection({ images = [] }) {
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
          <SectionTitle english="CONTENTS" title="コンテンツ" />
          <div className={styles.imageGrid}>
            {images.map((img, i) => (
              <button
                key={img.id || i}
                className={styles.imageButton}
                onClick={() => handleImageClick(img)}
              >
                <img src={img.src} alt={img.alt} />
              </button>
            ))}
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
