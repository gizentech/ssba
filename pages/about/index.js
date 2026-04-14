import SeoHead from '@/components/common/SeoHead';
import Image from 'next/image';
import styles from '@/styles/AboutPage.module.css';

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title="SSBAとは｜野球塾の概要・施設・貸出【福岡県久留米市】"
        description="SSBA（シューティングスターベースボールアカデミー）の概要。福岡県久留米市安武町の全天候型室内練習場。代表・流大輔が運営する野球塾の施設情報・貸出料金をご紹介。"
        keywords="SSBA,野球塾,概要,久留米,福岡,室内練習場,施設貸出,流大輔,シューティングスター,野球アカデミー"
        canonical="/about"
      />
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>ABOUT</p>
          <h1 className={styles.pageTitle}>SSBAについて</h1>
        </div>

        {/* SSBA 概要 */}
        <section className={styles.section}>
          <div className={styles.inner}>
            <h2 className={styles.sectionTitle}>SSBA 概要</h2>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <th>名称</th>
                  <td>
                    Shootingstar baseball academy<br />
                    <span className={styles.subText}>シューティングスター ベースボール アカデミー</span>
                  </td>
                </tr>
                <tr>
                  <th>住所</th>
                  <td>福岡県久留米市安武町安武本2930-6</td>
                </tr>
                <tr>
                  <th>電話番号</th>
                  <td><a href="tel:09013627517">090-1362-7517</a></td>
                </tr>
                <tr>
                  <th>事業内容</th>
                  <td>野球塾（技術指導）・設備貸出</td>
                </tr>
                <tr>
                  <th>代表者</th>
                  <td>流 大輔 (Nagare Daisuke)</td>
                </tr>
                <tr>
                  <th>ホームページURL</th>
                  <td>www.ssba1223.com</td>
                </tr>
                <tr>
                  <th>メールアドレス</th>
                  <td><a href="mailto:ssba1223dn@gmail.com">ssba1223dn@gmail.com</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 施設紹介 */}
        <section className={`${styles.section} ${styles.sectionGray}`}>
          <div className={styles.inner}>
            <h2 className={styles.sectionTitle}>施設紹介</h2>
            <div className={styles.facilityImage}>
              <Image
                src="/images/facility.avif"
                alt="SSBA 室内練習場"
                width={1200}
                height={600}
              />
            </div>
            <ul className={styles.facilityList}>
              <li>ＳＳＢＡでは室内練習場を完備しておりますので年中天候に関わらず練習ができます。</li>
              <li>フィールドは安全性を考慮し全面人工芝を使用しています。<br />（2015年度神宮球場と同じ人工芝）<br />※ゴムチップ入りですので足腰への負担が非常に少ないです。</li>
              <li>バッティンングマシンで効率の良い練習ができます。</li>
              <li>簡易シャワールームあり。</li>
            </ul>
          </div>
        </section>

        {/* 室内練習場貸出 */}
        <section className={styles.section}>
          <div className={styles.inner}>
            <h2 className={styles.sectionTitle}>室内練習場貸出</h2>
            <p className={styles.rentalIntro}>
              ☆SSBAでは個人使用からチーム単位での施設貸出を行っております。
            </p>

            <div className={styles.rentalInfo}>
              <p className={styles.rentalNote}>※室内練習場使用は事前予約制です。<br />ご利用をご希望の場合は必ず事前に電話予約をお願い致します。</p>

              <div className={styles.rentalPricing}>
                <p className={styles.rentalPrice}>料金：90分 ¥5,400（税込）</p>
                <ul className={styles.rentalOptions}>
                  <li>アーム式マシン使用料 ¥500</li>
                  <li>各種ボール使用料 ¥300</li>
                </ul>
              </div>

              <div className={styles.rentalNotes}>
                <p>※万が一施設貸出での破損、紛失があった場合、施設の損害を賠償していただく場合がございます。</p>
                <p>※全面スパイク禁止。泥汚れのないトレーニングシューズでの使用をお願い致します。</p>
                <p>※駐車場は施設前に5台、施設裏側に3台の8台駐車可能です。</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
