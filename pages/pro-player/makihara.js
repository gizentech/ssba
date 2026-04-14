import SeoHead from '@/components/common/SeoHead';
import Image from 'next/image';
import styles from '@/styles/CoachesPage.module.css';

const player = {
  role: '内野手',
  name: '牧原 大成',
  nameEn: 'Taisei Makihara',
  photo: '/images/pro-player/makihara_t.webp',
  greeting: '',
  profile: [
    { text: '福岡県久留米市出身' },
    { text: '1992年10月15日生まれ（33歳）' },
    { text: '身長 172cm　体重 74kg' },
    { text: '血液型 A型' },
    { text: '右投左打' },
    { text: 'ドラフト 2010年（育成5位）' },
    { text: 'プロ通算 16年' },
  ],
  career: [
    {
      subtitle: '球歴',
      items: [
        '山本スカイヤーズ（水分小）',
        '久留米ボーイズ（田主丸中）',
        '城北高（甲子園出場）',
        '福岡ソフトバンクホークス',
      ],
    },
    {
      subtitle: '主なタイトル',
      items: [
        '首位打者 2025年',
        'ベストナイン 2025年',
        'ゴールデングラブ賞 2025年',
      ],
    },
  ],
  gallery: [
    '/images/makihara_nagare.webp',
  ],
};

function ProfileList({ profile }) {
  if (!profile || profile.length === 0) return null;
  return (
    <ul className={styles.profileList}>
      {profile.map((item, i) => (
        <li key={i}>
          {item.text}
          {item.children && item.children.length > 0 && (
            <ul className={styles.subList}>
              {item.children.map((child, j) => (
                <li key={j}>{child}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function CareerSection({ career }) {
  if (!career || career.length === 0) return null;
  return (
    <>
      {career.map((block, i) => (
        <div key={i} className={styles.careerBlock}>
          <h4 className={styles.careerSubTitle}>{block.subtitle}</h4>
          {block.items && (
            <ul className={styles.careerList}>
              {block.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          )}
          {block.teams && block.teams.map((team, k) => (
            <div key={k} className={styles.careerTeam}>
              <p className={styles.teamName}>{team.name}</p>
              <ul className={styles.careerList}>
                {(team.items || []).map((item, l) => <li key={l}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function MakiharaPage() {
  const galleryImages = player.gallery;

  return (
    <>
      <SeoHead
        title="牧原大成 選手｜プロ野球選手の自主トレ拠点【SSBA 久留米】"
        description="福岡ソフトバンクホークス・牧原大成選手が自主トレで利用するSSBA。2025年首位打者・ベストナイン・ゴールデングラブ賞受賞。本多雄一・川崎宗則ら久留米ゆかりのプロ野球選手も繋がる、久留米の野球塾。"
        keywords="牧原大成,牧原大成 自主トレ,牧原大成 久留米,本多雄一,川崎宗則,ソフトバンクホークス,プロ野球 自主トレ,SSBA,久留米 野球,首位打者,ベストナイン,ゴールデングラブ,流大輔"
        canonical="/pro-player/makihara"
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>プロ野球選手紹介</h1>
            <p className={styles.pageSub}>PRO PLAYER</p>
          </div>
        </div>

        <div className={styles.body}>
          {/* メインカラム */}
          <div className={styles.mainColumn}>
            {/* 選手カード */}
            <div className={styles.coachCard}>
              <div className={styles.coachPhoto}>
                <Image
                  src={player.photo}
                  alt={player.name}
                  width={200}
                  height={267}
                />
              </div>
              <div className={styles.coachInfo}>
                <p className={styles.coachLabel}>{player.role}</p>
                <p className={styles.coachName}>{player.name}</p>
                <p className={styles.coachNameEn}>{player.nameEn}</p>
              </div>
            </div>

            {/* ご挨拶 */}
            {player.greeting && (
              <div className={styles.greetingBlock}>
                <p className={styles.greetingText}>{player.greeting}</p>
              </div>
            )}

            {/* 画像ギャラリー */}
            {galleryImages.length > 0 && (
              <div className={styles.imageGalleryNatural}>
                {galleryImages.map((url, i) => (
                  <div key={i} className={styles.imageItemNatural}>
                    <Image
                      src={url}
                      alt={`${player.name} ${i + 1}`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* サイドバー */}
          <aside className={styles.profileSidebar}>
            {player.profile && player.profile.length > 0 && (
              <div className={styles.profileSection}>
                <h3 className={styles.profileTitle}>プロフィール</h3>
                <ProfileList profile={player.profile} />
              </div>
            )}

            {player.career && player.career.length > 0 && (
              <div className={styles.profileSection}>
                <h3 className={styles.profileTitle}>主な球歴</h3>
                <CareerSection career={player.career} />
              </div>
            )}

          </aside>
        </div>
      </div>
    </>
  );
}
