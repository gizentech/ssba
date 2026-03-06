import SectionTitle from '@/components/common/SectionTitle';
import styles from '@/styles/OfficialMedia.module.css';

const TIKTOK_POSTS = [
  {
    id: 1,
    embedUrl: 'https://www.tiktok.com/@ssba_baseball',
    thumbnail: '/images/makihara_nagare.webp', // .avif -> .webp
    caption: 'バッティング練習',
  },
  {
    id: 2,
    embedUrl: 'https://www.tiktok.com/@ssba_baseball',
    thumbnail: '/images/makihara_nagare.webp', // .avif -> .webp
    caption: 'ピッチング指導',
  },
  {
    id: 3,
    embedUrl: 'https://www.tiktok.com/@ssba_baseball',
    thumbnail: '/images/makihara_nagare.webp', // .avif -> .webp
    caption: '守備練習',
  },
];

const INSTAGRAM_POSTS = [
  {
    id: 1,
    embedUrl: 'https://www.instagram.com/ssba_baseball/',
    thumbnail: '/images/kawasaki_nagare.webp', // .jpg -> .webp
    caption: 'トレーニング風景',
  },
  {
    id: 2,
    embedUrl: 'https://www.instagram.com/ssba_baseball/',
    thumbnail: '/images/makihara_nagare.webp', // .JPG -> .webp
    caption: '選手サポート',
  },
  {
    id: 3,
    embedUrl: 'https://www.instagram.com/ssba_baseball/',
    thumbnail: '/images/honda_nagare.webp', // .jpg -> .webp
    caption: 'アカデミー活動',
  },
  {
    id: 4,
    embedUrl: 'https://www.instagram.com/ssba_baseball/',
    thumbnail: '/images/honda_nagare.webp', // .avif -> .webp
    caption: '練習風景',
  },
];

export default function OfficialMedia() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.titleWrapper}>
          <SectionTitle
            english="OFFICIAL MEDIA"
            title="オフィシャルメディア"
          />
          <p className={styles.subtitle}>Tiktok &amp; Media</p>
        </div>

        <div className={styles.mediaGrid}>
          {/* TikTok - 左側: 大1枚(左) + 小2枚(右) */}
          <div className={styles.mediaColumn}>
            <div className={styles.platformHeader}>
              <h3 className={styles.platformTitle}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.28z"/>
                </svg>
                TikTok
              </h3>
              <a href="https://www.tiktok.com/@ssba_baseball" target="_blank" rel="noopener noreferrer" className={styles.moreLink}>
                他の動画を見る <span>&gt;</span>
              </a>
            </div>
            <div className={`${styles.bento} ${styles.bentoTiktok}`}>
              <a href={TIKTOK_POSTS[0].embedUrl} target="_blank" rel="noopener noreferrer" className={styles.bentoLarge}>
                <div className={styles.postThumbnail}>
                  <img src={TIKTOK_POSTS[0].thumbnail} alt={TIKTOK_POSTS[0].caption} />
                  <div className={styles.postOverlay}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </a>
              <div className={styles.bentoSmallColumn}>
                {TIKTOK_POSTS.slice(1).map((post) => (
                  <a key={post.id} href={post.embedUrl} target="_blank" rel="noopener noreferrer" className={styles.bentoSmall}>
                    <div className={styles.postThumbnail}>
                      <img src={post.thumbnail} alt={post.caption} />
                      <div className={styles.postOverlay}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Instagram - 右側: 2x2グリッド */}
          <div className={styles.mediaColumn}>
            <div className={styles.platformHeader}>
              <h3 className={styles.platformTitle}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Instagram
              </h3>
              <a href="https://www.instagram.com/ssba_baseball/" target="_blank" rel="noopener noreferrer" className={styles.moreLink}>
                続きの投稿を見る <span>&gt;</span>
              </a>
            </div>
            <div className={styles.instaGrid}>
              {INSTAGRAM_POSTS.map((post) => (
                <a key={post.id} href={post.embedUrl} target="_blank" rel="noopener noreferrer" className={styles.instaCard}>
                  <div className={styles.postThumbnail}>
                    <img src={post.thumbnail} alt={post.caption} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}