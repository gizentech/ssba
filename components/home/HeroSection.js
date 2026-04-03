import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/styles/HeroSection.module.css';
import AcademyAvailability from './AcademyAvailability';

const PAGE2_IMAGES = [
  '/images/makihara_nagare.webp',
  '/images/kawasaki_nagare.webp',
];

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [vh, setVh] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const page2Ref = useRef(null);
  const [isSP, setIsSP] = useState(false);
  const [mounted, setMounted] = useState(false);


  // SP用: makiharaのみ表示
  const page2Images = isSP
    ? [PAGE2_IMAGES[0]]
    : PAGE2_IMAGES;

  // Page2画像ローテーション（10秒）
  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % page2Images.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [page2Images.length]);

  // スクロール追跡
  useEffect(() => {
    setVh(window.innerHeight);
    setIsSP(window.innerWidth <= 768);
    setScrollY(window.scrollY);
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => {
      setVh(window.innerHeight);
      setIsSP(window.innerWidth <= 768);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // ニュースティッカー・ボタン: フェード＋横スライドアウト
  const uiProgress = mounted && vh ? Math.min(1, scrollY / (vh * 0.1)) : 1;
  const uiOpacity = Math.max(0, 1 - uiProgress);

  // P2画像: マウント直後から表示
  const p2ImagesVisible = mounted;


  return (
    <>
      {/* 固定背景画像 */}
      <div className={styles.fixedBg}>
        <Image
          src="/images/p2_bg.webp"
          alt="SSBA 背景"
          fill
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
      </div>

      {/* ===== Page 1: ファーストビュー ===== */}
      <section className={styles.hero}>
        {/* アカデミー空き状況（PC用） - スクロールでフェードアウト */}
        <div className={styles.availabilityPc}>
          <AcademyAvailability visible={uiOpacity > 0} />
        </div>

        {/* 右下：リンクボタン3つ - スライドイン / スクロールでスライドアウト */}
        <div
          className={styles.bottomLinks}
          style={{
            opacity: uiOpacity,
            transform: `translateX(${-uiProgress * 100}%) translateY(0)`,
          }}
        >
          <a href="/course" className={styles.bottomLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            <span>コース紹介</span>
          </a>
          <a href="/coaches" className={styles.bottomLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span>指導者紹介</span>
          </a>
          <a href="/contact" className={styles.bottomLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span>問い合わせ</span>
          </a>
        </div>
      </section>

      {/* SP用: logo_after + アカデミー空き状況（通常フローでスクロール） */}
      <section className={styles.spAvailSection}>
        <div className={styles.spLogoAfter}>
          <Image
            src="/images/logo_after.png"
            alt="SSBA"
            width={200}
            height={60}
            priority
          />
        </div>
        <AcademyAvailability visible={true} />
      </section>

      {/* ===== Page 2: 縦書きテキストがスクロールで上がってくる ===== */}
      <section className={styles.page2} ref={page2Ref}>
        <div className={styles.page2Content}>
          {/* SP用：フェード切り替え画像 */}
          <div className={styles.page2ImageFade}>
            {page2Images.map((src, i) => (
              <div
                key={src}
                className={styles.page2ImageFadeItem}
                style={{ opacity: imageIndex === i ? 1 : 0 }}
              >
                <Image
                  src={src}
                  alt="SSBA 練習風景"
                  width={600}
                  height={400}
                  className={styles.page2Image}
                />
              </div>
            ))}
          </div>

          {/* 左側画像（PC用） */}
          <div className={`${styles.page2ImageWrap} ${styles.page2ImageWrapLeft} ${p2ImagesVisible ? styles.page2ImageWrapVisible : ''}`}>
            <Image
              src="/images/makihara_nagare.webp"
              alt="SSBA 練習風景"
              width={600}
              height={400}
              className={styles.page2Image}
            />
          </div>

          {/* 中央：縦書きテキスト */}
          <div className={styles.page2Inner}>
            <h2 className={styles.page2Title}>
              プロが認める指導力で<br />次のステージへ
            </h2>
            <p className={styles.page2Body}>
              私はこれまで数多くのプロ野球選手とプレーや練習をしてきました。<br />
              その全てのプロ野球選手が共通して行っている練習が基本動作の反復練習です。<br />
              しっかりとした基本をひたすら練習したからこそ一流のプレーができ持続できるのです。<br />
              特に小学生、中学生時は基本動作を覚えることが必要です。<br />
              分からないままや、間違った形を覚えてしまうとそれが癖となり故障にも繋がります。<br />
              当塾では生徒１人１人とコミニュケーションをとりながら、<br />
              １つ１つステップアップできるように指導させて頂きます。
            </p>
          </div>

          {/* 右側画像（PC用） */}
          <div className={`${styles.page2ImageWrap} ${styles.page2ImageWrapRight} ${p2ImagesVisible ? styles.page2ImageWrapVisible : ''}`}>
            <Image
              src="/images/kawasaki_nagare.webp"
              alt="SSBA 練習風景"
              width={600}
              height={400}
              className={styles.page2Image}
            />
          </div>
        </div>

        {/* SP用: テキスト下の空き状況 */}
        <div className={styles.spAvailBelow}>
          <AcademyAvailability visible={true} />
        </div>

        {/* 下部ボタン */}
        <div className={styles.page2BtnWrap}>
          <a href="/about" className={styles.page2Btn}>
            SSBAについて
            <span className={styles.page2BtnArrow}>&gt;</span>
          </a>
        </div>
      </section>
    </>
  );
}
