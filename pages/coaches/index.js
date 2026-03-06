import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/CoachesPage.module.css';

const NAGARE_IMAGES = [
  { src: '/images/nagare/nagare01.avif', alt: '流 大輔 1' },
  { src: '/images/nagare/nagare03.avif', alt: '流 大輔 2' },
  { src: '/images/nagare/nagare04.avif', alt: '流 大輔 3' },
  { src: '/images/nagare/nagare05.avif', alt: '流 大輔 4' },
  { src: '/images/nagare/nagare06.avif', alt: '流 大輔 5' },
];

export default function CoachesPage() {
  return (
    <>
      <Head>
        <title>指導者紹介 - SSBA</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>COACHES</p>
          <h1 className={styles.pageTitle}>指導者紹介</h1>
        </div>

        <section className={styles.section}>
          <div className={styles.inner}>
            {/* 名前 */}
            <div className={styles.coachHeader}>
              <h2 className={styles.coachName}>流 大輔</h2>
              <p className={styles.coachNameEn}>Daisuke Nagare</p>
            </div>

            {/* 画像ギャラリー - 横並び */}
            <div className={styles.imageGallery}>
              {NAGARE_IMAGES.map((img) => (
                <div key={img.src} className={styles.imageItem}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={240}
                    height={360}
                    className={styles.coachImage}
                  />
                </div>
              ))}
            </div>

            {/* プロフィール */}
            <div className={styles.profileSection}>
              <h3 className={styles.profileTitle}>プロフィール</h3>
              <ul className={styles.profileList}>
                <li>福岡県久留米市出身 1989/3/11生まれ</li>
                <li>祐誠高校</li>
                <li>社会人クラブチーム福岡オーシャンズ9</li>
                <li>
                  プロ野球独立リーグ 四国アイランドリーグ plus
                  <ul className={styles.subList}>
                    <li>高知ファイティングドッグス　2008〜2011</li>
                    <li>愛媛マンダリンパイレーツ　2012〜同年引退</li>
                  </ul>
                </li>
                <li>（株）サニクリーン九州福岡軟式野球部　2013〜2015</li>
                <li>高知ファイティングドッグススカウト　2015〜</li>
              </ul>
            </div>

            {/* 主な球歴 */}
            <div className={styles.profileSection}>
              <h3 className={styles.profileTitle}>主な球歴</h3>

              <div className={styles.careerBlock}>
                <h4 className={styles.careerSubTitle}>祐誠高校 時代</h4>
                <ul className={styles.careerList}>
                  <li>2004年秋季高校野球福岡県大会3位</li>
                  <li>2004年秋季高校野球九州大会出場</li>
                </ul>
              </div>

              <div className={styles.careerBlock}>
                <h4 className={styles.careerSubTitle}>プロ野球独立リーグ四国アイランドリーグ時代</h4>
                <div className={styles.careerTeam}>
                  <p className={styles.teamName}>高知ファイティングドッグス 2008年〜2011年</p>
                  <ul className={styles.careerList}>
                    <li>2009年独立リーグ日本一</li>
                    <li>2011年最多盗塁王 通算128盗塁</li>
                  </ul>
                </div>
                <div className={styles.careerTeam}>
                  <p className={styles.teamName}>愛媛マンダリンパイレーツ 2012年</p>
                  <ul className={styles.careerList}>
                    <li>2012年後期優勝 打率部門リーグ7位</li>
                  </ul>
                </div>
              </div>

              <div className={styles.careerBlock}>
                <h4 className={styles.careerSubTitle}>社会人軟式野球時代</h4>
                <ul className={styles.careerList}>
                  <li>軟式野球福岡県代表国体選手 2013年</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
