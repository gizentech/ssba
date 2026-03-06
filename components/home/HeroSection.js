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

  // SP用スクロールステージ制御
  const [spTitleVisible, setSpTitleVisible] = useState(true);
  const [page2FadeOut, setPage2FadeOut] = useState(false);

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
    setScrollY(window.scrollY); // 初期スクロール位置を読み取り
    setMounted(true); // マウント完了
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
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

  // SP用: 4ステージスクロール制御
  useEffect(() => {
    if (!vh || !isSP) return;
    // ステージ1→2: 10%vhでタイトル+段落フェードアウト、空き状況出現
    setSpTitleVisible(scrollY < vh * 0.1);
  }, [scrollY, vh, isSP]);

  // Page2接近でタイトル＆空き状況がフェードアウト
  useEffect(() => {
    if (!page2Ref.current || !vh) return;
    const page2Top = page2Ref.current.getBoundingClientRect().top;
    setPage2FadeOut(page2Top < vh * 1.0);
  }, [scrollY, vh]);

  // YouTube: 既存のフェードアウト（マウント前は非表示にして初期描画の不整合を防ぐ）
  const verticalOpacity = mounted && vh ? Math.max(0, 1 - scrollY / (vh * 0.2)) : 0;

  // ニュースティッカー・ボタン: フェード＋横スライドアウト
  const uiProgress = mounted && vh ? Math.min(1, scrollY / (vh * 0.1)) : 1;
  const uiOpacity = Math.max(0, 1 - uiProgress);

  // P1背景: p1で表示、p2でフェードアウト（球体を表示するため）
  const scrollFraction = mounted && vh ? Math.min(1, Math.max(0, (scrollY - vh * 0.5) / (vh * 0.5))) : 0;
  const p2BgOpacity = 1 - scrollFraction;

  // P2画像スライドイン: P2セクションが見え始めたら
  const p2ImagesVisible = mounted && vh && scrollY > vh * 1.0;


  return (
    <>
      {/* 固定背景画像（Page2）- スクロールでフェードイン */}
      <div className={styles.fixedBg} style={{ opacity: p2BgOpacity }}>
        <Image
          src="/images/p2_bg.webp"
          alt="SSBA 背景"
          fill
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
      </div>

      {/* YouTube動画（fixed・PC専用） */}
      <div
        className={styles.heroVideo}
        style={{
          opacity: verticalOpacity,
          transition: scrollY === 0 ? 'opacity 1.5s ease-out' : 'none',
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/mZjbQCXli-8?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&loop=1&playlist=mZjbQCXli-8&rel=0&playsinline=1"
          title="SSBA紹介動画"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className={styles.heroVideoIframe}
        />
      </div>

      {/* 縦書きテキスト（fixed） */}
      <div className={styles.verticalText} style={{ opacity: mounted ? undefined : 0 }}>
        <div
          className={`${styles.heroTitle} ${isSP ? (spTitleVisible ? '' : styles.fadeOut) : (page2FadeOut ? styles.fadeOut : '')}`}
        >
          {isSP ? (
            <Image
              src="/images/zenshin.webp"
              alt="かすかでも確実に前進"
              width={300}
              height={80}
              className={styles.heroTitleImage}
              priority
            />
          ) : (
            <h1 className={styles.heroTitleText}>かすかでも確実に前進</h1>
          )}
        </div>
        <p className={isSP ? (spTitleVisible ? '' : styles.fadeOut) : (page2FadeOut ? styles.fadeOut : '')}>
          プロ野球選手の自主トレパートナーとして<br />
          培った技術と経験を、<br />
          次世代の選手たちへ。<br />
          少人数制で一人ひとりに向き合う指導。
        </p>
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
          <a href="/contact" className={styles.bottomLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 14l2 2 4-4" />
            </svg>
            <span>体験申込</span>
          </a>
          <a href="/facility" className={styles.bottomLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
              <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14" />
              <path d="M9 9v.01M9 12v.01M9 15v.01" />
            </svg>
            <span>施設見学</span>
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
              src="/images/makihara_nagare.JPG"
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
              src="/images/kawasaki_nagare.jpg"
              alt="SSBA 練習風景"
              width={600}
              height={400}
              className={styles.page2Image}
            />
          </div>
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
