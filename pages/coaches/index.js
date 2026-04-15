import SeoHead from '@/components/common/SeoHead';
import Image from 'next/image';
import styles from '@/styles/CoachesPage.module.css';
import { fetchCoaches } from '@/lib/wp-api';

export async function getStaticProps() {
  const coaches = await fetchCoaches();
  return { props: { coaches } };
}

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

function CoachSection({ coach }) {
  const LOCAL_GALLERY = [
    '/images/nagare/nagare01.avif',
    '/images/nagare/nagare03.avif',
    '/images/nagare/nagare04.avif',
    '/images/nagare/nagare05.avif',
    '/images/nagare/nagare06.avif',
  ];
  const validGallery = (coach.gallery || []).filter(
    (url) => url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')
  );
  const galleryImages = validGallery.length > 0 ? validGallery : LOCAL_GALLERY;

  return (
    <div className={styles.body}>
      <div className={styles.mainColumn}>
        <div className={styles.coachCard}>
          <div className={styles.coachPhoto}>
            <Image
              src={coach.photo || '/images/nagare.webp'}
              alt={coach.name}
              width={200}
              height={267}
            />
          </div>
          <div className={styles.coachInfo}>
            <p className={styles.coachLabel}>{coach.role}</p>
            <p className={styles.coachName}>{coach.name}</p>
            <p className={styles.coachNameEn}>{coach.nameEn}</p>
          </div>
        </div>

        {coach.greeting && (
          <div className={styles.greetingBlock}>
            <p className={styles.greetingText}>{coach.greeting}</p>
          </div>
        )}

        {galleryImages.length > 0 && (
          <div className={styles.imageGalleryPc}>
            {galleryImages.map((url, i) => (
              <div key={i} className={styles.imageItem}>
                <Image
                  src={url}
                  alt={`${coach.name} ${i + 1}`}
                  width={240}
                  height={360}
                  className={styles.galleryImage}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className={styles.profileSidebar}>
        {coach.profile && coach.profile.length > 0 && (
          <div className={styles.profileSection}>
            <h3 className={styles.profileTitle}>プロフィール</h3>
            <ProfileList profile={coach.profile} />
          </div>
        )}

        {coach.career && coach.career.length > 0 && (
          <div className={styles.profileSection}>
            <h3 className={styles.profileTitle}>主な球歴</h3>
            <CareerSection career={coach.career} />
          </div>
        )}

        {galleryImages.length > 0 && (
          <div className={styles.imageGallerySp}>
            {galleryImages.map((url, i) => (
              <div key={i} className={styles.imageItem}>
                <Image
                  src={url}
                  alt={`${coach.name} ${i + 1}`}
                  width={240}
                  height={360}
                  className={styles.galleryImage}
                />
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

export default function CoachesPage({ coaches }) {
  return (
    <>
      <SeoHead
        title="指導者紹介｜流大輔・若松悠平コーチ【SSBA 久留米 野球塾】"
        description="SSBAの指導者を紹介。代表・流大輔（高知ファイティングドッグス出身／独立リーグ日本一・最多盗塁王）、スタッフ・若松悠平（香川オリーブガイナーズ・福島レッドホープス出身）。牧原大成・本多雄一・川崎宗則など現役・元プロ野球選手の自主トレにも対応。久留米フューチャースターズとも連携する福岡県久留米市の野球塾。"
        keywords="流大輔,流 大輔,Nagare Daisuke,流 野球,SSBA,指導者,コーチ,久留米,久留米市,福岡,野球塾,野球アカデミー,野球教室,高知ファイティングドッグス,四国アイランドリーグ,独立リーグ,独立リーグ日本一,最多盗塁王,若松悠平,香川オリーブガイナーズ,福島レッドホープス,祐誠高校,牧原大成,本多雄一,川崎宗則,プロ野球,プロ野球選手,自主トレ,久留米フューチャースターズ,Bar Greenlight,BarGreenlight,元プロ野球選手,コーチ紹介,指導者紹介,久留米 野球コーチ,福岡 野球指導者"
        canonical="/coaches"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: [
            {
              '@type': 'Person',
              position: 1,
              name: '流 大輔',
              alternateName: 'Daisuke Nagare',
              jobTitle: '代表 / ヘッドコーチ',
              birthDate: '1989-03-11',
              birthPlace: { '@type': 'Place', name: '福岡県久留米市' },
              alumniOf: [
                { '@type': 'EducationalOrganization', name: '祐誠高校' },
              ],
              memberOf: [
                { '@type': 'SportsTeam', name: '高知ファイティングドッグス' },
                { '@type': 'SportsTeam', name: '愛媛マンダリンパイレーツ' },
              ],
              award: ['独立リーグ日本一（2009年）', '最多盗塁王（2011年）通算128盗塁'],
              worksFor: { '@type': 'Organization', name: 'SSBA - Shootingstar Baseball Academy' },
            },
            {
              '@type': 'Person',
              position: 2,
              name: '若松 悠平',
              alternateName: 'Yuhei Wakamatsu',
              jobTitle: 'スタッフ',
              alumniOf: [
                { '@type': 'EducationalOrganization', name: '祐誠高校' },
                { '@type': 'EducationalOrganization', name: '長崎国際大学' },
              ],
              memberOf: [
                { '@type': 'SportsTeam', name: '香川オリーブガイナーズ' },
                { '@type': 'SportsTeam', name: '福島レッドホープス' },
              ],
              worksFor: { '@type': 'Organization', name: 'SSBA - Shootingstar Baseball Academy' },
            },
          ],
        }}
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>指導者紹介</h1>
            <p className={styles.pageSub}>COACHES</p>
          </div>
        </div>

        {coaches.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#888' }}>
            コンテンツ準備中です
          </div>
        ) : (
          coaches.map((coach) => (
            <CoachSection key={coach.id} coach={coach} />
          ))
        )}
      </div>
    </>
  );
}
