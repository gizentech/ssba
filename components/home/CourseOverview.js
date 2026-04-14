import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import styles from '@/styles/CourseOverview.module.css';

const COURSES = [
  {
    number: '１',
    title: '小学生クラス',
    meta: '月〜金 / 17:15〜18:35 / 定員8名',
    price: '13,200',
    unit: '円（税込）/ 月4回',
  },
  {
    number: '２',
    title: '中学生クラス',
    meta: '月・木・金 / 18:45〜20:10 / 定員8名',
    price: '15,400',
    unit: '円（税込）/ 月4回',
  },
  {
    number: '３',
    title: '小6 ハイレベルクラス',
    meta: '水曜日 / 18:45〜20:10 / 定員10名',
    price: '15,400',
    unit: '円（税込）/ 月4回',
  },
  {
    number: '４',
    title: '中学3年生クラス',
    meta: '9月〜3月 土曜日 / 17:00〜19:00',
    price: '16,000',
    unit: '円（税込）',
  },
  {
    number: '５',
    title: 'パーソナルレッスン',
    meta: '60分 / 2名まで同額',
    price: '6,600',
    unit: '円',
  },
  {
    number: '６',
    title: 'ラプソード計測',
    meta: '球速・打球速度を計測',
    price: '',
    unit: '',
  },
];

export default function CourseOverview() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionTitle
          english="COURSE & PRICE"
          title="コース・料金"
        />
        <div className={styles.grid}>
          {COURSES.map((course) => (
            <div key={course.number} className={styles.card}>
              <span className={styles.cardNumber}>{course.number}</span>
              <h3 className={styles.cardTitle}>{course.title}</h3>
              <p className={styles.cardMeta}>{course.meta}</p>
              {course.price && (
                <p className={styles.cardPrice}>
                  {course.price}
                  <span className={styles.cardPriceUnit}>{course.unit}</span>
                </p>
              )}
            </div>
          ))}
        </div>
        <div className={styles.moreLink}>
          <Link href="/course" className={styles.moreLinkBtn}>
            コース詳細を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
