import SeoHead from '@/components/common/SeoHead';
import Image from 'next/image';
import styles from '@/styles/SubPage.module.css';
import { fetchReason } from '@/lib/wp-api';

export async function getStaticProps() {
  const reason = await fetchReason();
  return { props: { reason } };
}

export default function ReasonPage({ reason }) {
  const { heroUrl, lead, bullets } = reason;
  let sections = reason.sections;
  if (typeof sections === 'string') {
    try { sections = JSON.parse(sections); } catch { sections = []; }
  }
  if (!Array.isArray(sections)) sections = [];

  return (
    <>
      <SeoHead
        title="選ばれる理由｜プロも認める指導力【SSBA 久留米】"
        description="SSBAが選ばれる理由。元プロ野球選手による本格指導、少人数制の丁寧なレッスン、プロ野球選手との自主トレ指導実績。久留米・福岡で信頼される野球塾です。"
        keywords="SSBA,選ばれる理由,野球塾,久留米,福岡,プロ野球,指導力,少人数制,元プロ野球,野球アカデミー,個人指導"
        canonical="/reason"
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>選ばれる理由</h1>
            <p className={styles.pageSub}>REASON</p>
          </div>
        </div>

        {heroUrl && (
          <div className={styles.heroImage}>
            <Image
              src={heroUrl}
              alt="SSBA 指導風景"
              width={1200}
              height={600}
              priority
            />
          </div>
        )}

        <div className={styles.body}>
          <>
              {lead && (
                <div className={styles.section}>
                  <p className={styles.leadText}>{lead}</p>
                </div>
              )}

              {bullets && bullets.length > 0 && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>このような方に選ばれています</h2>
                  <ul className={styles.bulletList}>
                    {bullets.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sections.map((section, i) => (
                <div key={i} className={styles.section}>
                  {section.title && (
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                  )}
                  {section.paragraphs && section.paragraphs.map((p, j) => (
                    <p key={j} className={styles.text}>{p}</p>
                  ))}
                </div>
              ))}
            </>
        </div>
      </div>
    </>
  );
}
