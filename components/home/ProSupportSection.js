import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import styles from '@/styles/ProSupport.module.css';

const PAST_ROW1 = [
  { name: '川﨑宗則', team: '元メジャーリーガー', image: '/images/pro-player/kawasaki.webp' },
  { name: '本多雄一', team: 'ソフトバンク', image: '/images/pro-player/honda.webp' },
  { name: '野村勇', team: 'ソフトバンク', image: '/images/pro-player/nomura.webp' },
  { name: '緒方理貢', team: 'ソフトバンク', image: '/images/pro-player/ogata.webp' },
];

const PAST_ROW2 = [
  { name: '水谷瞬', team: '日本ハムファイターズ', image: '/images/pro-player/mizutani.webp' },
  { name: '亀澤恭平', team: '中日ドラゴンズ', image: '/images/pro-player/kamezawa.webp' },
  { name: '立岡宗一郎', team: '読売ジャイアンツ', image: '/images/pro-player/kameoka.webp' },
];

export default function ProSupportSection() {
  return (
    <section id="pro-support" className={styles.section}>
      <div className={styles.inner}>
        <SectionTitle
          english="PRO SUPPORT"
          title="プロ野球選手サポート実績"
        />
        <div className={styles.content}>
          {/* 左：牧原大成 */}
          <div className={styles.mainPlayer}>
            <Link href="/pro-player/makihara" className={styles.mainPlayerLink}>
              <div className={styles.mainImageWrapper}>
                <Image
                  src="/images/pro-player/makihara_t.webp"
                  alt="牧原大成"
                  width={600}
                  height={450}
                  className={styles.mainImage}
                />
                <div className={styles.ggBadge}>
                  <Image
                    src="/images/pro-player/gg.webp"
                    alt="2025年 三井ゴールデン・グラブ賞 / ベストナイン賞"
                    width={240}
                    height={120}
                    className={styles.ggImage}
                  />
                </div>
              </div>
            </Link>
            <div className={styles.mainPlayerInfo}>
              <span className={styles.currentLabel}>現在担当</span>
              <span className={styles.mainPlayerName}>牧原大成</span>
              <span className={styles.mainPlayerTeam}>（ソフトバンク）</span>
            </div>
          </div>

          {/* 右：過去のサポート選手 上段4列・下段3列 */}
          <div className={styles.pastArea}>
            <div className={styles.pastRow4}>
              {PAST_ROW1.map((player) => (
                <div key={player.name} className={styles.pastCard}>
                  <div className={styles.pastImageWrapper}>
                    <Image
                      src={player.image}
                      alt={player.name}
                      width={300}
                      height={225}
                      className={styles.pastImage}
                    />
                  </div>
                  <p className={styles.pastName}>
                    {player.name}<span className={styles.pastTeam}>（{player.team}）</span>
                  </p>
                </div>
              ))}
            </div>
            <div className={styles.pastRow3}>
              {PAST_ROW2.map((player) => (
                <div key={player.name} className={styles.pastCard}>
                  <div className={styles.pastImageWrapper}>
                    <Image
                      src={player.image}
                      alt={player.name}
                      width={300}
                      height={225}
                      className={styles.pastImage}
                    />
                  </div>
                  <p className={styles.pastName}>
                    {player.name}<span className={styles.pastTeam}>（{player.team}）</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}