import { useState, useEffect } from 'react';
import SeoHead from '@/components/common/SeoHead';
import Image from 'next/image';
import subStyles from '@/styles/SubPage.module.css';
import styles from '@/styles/CoursePage.module.css';
import { fetchCourses } from '@/lib/wp-api';

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SeoHead
        title="コース・料金｜個人・グループレッスン【SSBA 久留米】"
        description="SSBAのコース・料金案内。小学生・中学生・高校生・大人向けの個人レッスン・グループレッスン・パーソナルトレーニング。入会金なし。福岡県久留米市の野球教室・野球塾。"
        keywords="SSBA,コース,料金,個人レッスン,グループレッスン,野球塾,久留米,福岡,小学生,中学生,高校生,パーソナルトレーニング,野球教室"
        canonical="/course"
      />
      <div className={subStyles.wrapper}>
        <div className={subStyles.titleCard}>
          <div className={subStyles.titleInner}>
            <h1 className={subStyles.pageTitle}>コース・料金</h1>
            <p className={subStyles.pageSub}>COURSE & PRICE</p>
          </div>
        </div>
        <div className={subStyles.body}>
          {loading ? (
            <div className={subStyles.section}>
              <p className={subStyles.text} style={{ color: '#888' }}>読み込み中...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className={subStyles.section}>
              <p className={subStyles.text}>コンテンツ準備中です</p>
            </div>
          ) : (
            <div className={styles.courseGrid}>
              {courses.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseImage}>
                    {course.image ? (
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={600}
                        height={400}
                        className={styles.courseImg}
                      />
                    ) : (
                      <div className={styles.courseImgPlaceholder} />
                    )}
                  </div>
                  <div className={styles.courseContent}>
                    <div className={styles.courseHeader}>
                      {course.number && (
                        <div className={styles.courseNumber}>
                          {course.number.replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, (c) =>
                            String('①②③④⑤⑥⑦⑧⑨⑩'.indexOf(c) + 1)
                          )}
                        </div>
                      )}
                      <h2 className={styles.courseTitle}>
                        {course.title}
                        {course.subtitle && ` （${course.subtitle}）`}
                        {course.tag && (
                          <span className={styles.courseTag}>{course.tag}</span>
                        )}
                      </h2>
                    </div>
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
          )}
        </div>
      </div>
    </>
  );
}
