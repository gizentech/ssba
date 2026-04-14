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
      <section className={styles.hero} />

      {/* アカデミー空き状況（PC用） - スクロールでフェードアウト。hero外に出してz-index競合を回避 */}
      <div className={styles.availabilityPc}>
        <AcademyAvailability visible={uiOpacity > 0} />
      </div>

      {/* 右下：リンクボタン3つ - hero外に出してz-index競合を回避 */}
      <div
        className={styles.bottomLinks}
        style={{
          opacity: uiOpacity,
          transform: `translateX(${-uiProgress * 100}%) translateY(0)`,
        }}
      >
        <a href="/course" className={styles.bottomLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          <span>コース紹介</span>
        </a>
        <a href="/coaches" className={styles.bottomLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span>指導者紹介</span>
        </a>
        <a href="https://line.me/R/ti/p/%40vyx4744a" target="_blank" rel="noopener noreferrer" className={styles.bottomLink}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          <span>問い合わせ</span>
        </a>
      </div>

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
