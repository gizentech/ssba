import Head from 'next/head';
import styles from '@/styles/CoursePage.module.css';

const COURSES = [
  {
    number: '①',
    title: '小学生クラス',
    schedule: '月曜日〜金曜日 17:15〜18:35',
    capacity: '定員 8名',
    price: '13,200',
    priceNote: '税込 / 月4回',
  },
  {
    number: '②',
    title: '中学生クラス',
    subtitle: '硬式軟式混合',
    schedule: '月・木・金曜日 18:45〜20:10',
    capacity: '定員 8名',
    price: '15,400',
    priceNote: '税込 / 月4回',
  },
  {
    number: '③',
    title: '小学6年生限定 ハイレベルクラス',
    tag: '新設クラス',
    schedule: '水曜日 18:45〜20:10',
    capacity: '定員 10名',
    price: '15,400',
    priceNote: '税込 / 月4回',
    description:
      '元プロ野球独立リーグのスタッフによるハイレベルな技術練習＋トレーニングを指導するクラス。毎月一回ラプソードでの球速、打球速度計測、柔軟性、瞬発力など SSBAオリジナルメニューをデータ化し成長をサポートする。定期交流戦やグランド練習など計画予定。',
  },
  {
    number: '④',
    title: '中学3年生クラス',
    schedule: '9月〜3月 土曜日 17:00〜19:00',
    price: '16,000',
    priceNote: '税込',
    description:
      '高校野球準備クラス。技術練習、トレーニング、硬式球での交流戦などを行う。',
  },
  {
    number: '⑤',
    title: 'パーソナルレッスン',
    schedule: '60分',
    price: '6,600',
    priceNote: '※2名まで同額',
  },
  {
    number: '⑥',
    title: 'ラプソード計測',
    description: '球速・打球速度などの計測を行います。',
  },
  {
    number: '⑦',
    title: 'チーム出張指導',
    description: 'チーム単位での出張指導を承ります。詳しくはお問い合わせください。',
  },
];

export default function CoursePage() {
  return (
    <>
      <Head>
        <title>コース・料金 | SSBA</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.pageSubtitle}>COURSE & PRICE</p>
          <h1 className={styles.pageTitle}>コース・料金</h1>
        </div>
        <section className={styles.courseSection}>
          <div className={styles.inner}>
            {COURSES.map((course) => (
              <div key={course.number} className={styles.courseItem}>
                <div className={styles.courseNumber}>{course.number}</div>
                <div className={styles.courseContent}>
                  <h2 className={styles.courseTitle}>
                    {course.title}
                    {course.subtitle && ` （${course.subtitle}）`}
                    {course.tag && <span className={styles.courseTag}>{course.tag}</span>}
                  </h2>
                  <div className={styles.courseMeta}>
                    {course.schedule && (
                      <span className={styles.courseMetaItem}>
                        <span className={styles.courseMetaLabel}>日時</span>
                        {course.schedule}
                      </span>
                    )}
                    {course.capacity && (
                      <span className={styles.courseMetaItem}>
                        <span className={styles.courseMetaLabel}>定員</span>
                        {course.capacity}
                      </span>
                    )}
                  </div>
                  {course.description && (
                    <p className={styles.courseDescription}>{course.description}</p>
                  )}
                  {course.price && (
                    <p className={styles.coursePrice}>
                      {course.price}
                      <span className={styles.coursePriceUnit}>円</span>
                      {course.priceNote && (
                        <span className={styles.coursePriceNote}> {course.priceNote}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
