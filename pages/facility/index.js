import SeoHead from '@/components/common/SeoHead';
import Image from 'next/image';
import styles from '@/styles/SubPage.module.css';

export default function FacilityPage() {
  return (
    <>
      <SeoHead
        title="施設紹介｜久留米の屋内練習場・室内野球場【SSBA 福岡】"
        description="福岡県久留米市の野球屋内練習場SSBA。全面人工芝・バッティングマシン完備の全天候型室内練習場。プロ野球選手の自主トレにも対応。個人・チーム・久留米フューチャースターズなど幅広く施設貸出受付中。"
        keywords="久留米 屋内練習場,久留米 室内練習場,久留米 野球 屋内,福岡 野球 室内練習場,SSBA,施設,全天候型,人工芝,バッティングマシン,施設貸出,久留米,福岡,プロ野球,自主トレ,久留米フューチャースターズ"
        canonical="/facility"
      />
      <div className={styles.wrapper}>
        {/* タイトルカード */}
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>施設紹介</h1>
            <p className={styles.pageSub}>FACILITY</p>
          </div>
        </div>

        {/* 本文 */}
        <div className={styles.body}>
          <div className={styles.section}>
            <p className={styles.leadText}>
              SSBAでは、選手が安心して集中できる環境づくりにこだわり、充実した室内練習施設を完備しています。
              天候に左右されることなく、年間を通して安定したトレーニングが可能です。
            </p>
            <div className={styles.imageRow}>
              <div className={styles.facilityImage}>
                <Image
                  src="/images/facility/ssba1.webp"
                  alt="SSBA 室内練習場"
                  width={600}
                  height={400}
                />
              </div>
              <div className={styles.facilityImage}>
                <Image
                  src="/images/facility/ssba2.webp"
                  alt="SSBA 練習風景"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>

          {/* 室内練習場 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>施設設備</h2>

            <div className={styles.subSection}>
              <h3 className={styles.subTitle}>室内練習場完備（全天候型）</h3>
              <p className={styles.text}>
                雨や風、暑さ・寒さに影響されることなく、常に安定した環境で練習に取り組めます。
                継続的なトレーニングが、着実なレベルアップにつながります。
              </p>
            </div>

            <div className={styles.subSection}>
              <h3 className={styles.subTitle}>全面人工芝フィールド</h3>
              <p className={styles.text}>
                フィールドには安全性を重視し、全面に人工芝を採用しています。
                使用している人工芝は、2015年度の神宮球場と同仕様の高品質なものです。
              </p>
              <p className={styles.text}>
                さらに、ゴムチップ入りのためクッション性が高く、
                足腰への負担を軽減しながら、安心してプレーすることができます。
              </p>
            </div>

            <div className={styles.subSection}>
              <h3 className={styles.subTitle}>バッティングマシン完備</h3>
              <p className={styles.text}>
                バッティングマシンを活用することで、効率的かつ反復的な打撃練習が可能です。
                個々のレベルや課題に応じたトレーニングを行い、実践力の向上をサポートします。
              </p>
            </div>

            <div className={styles.subSection}>
              <h3 className={styles.subTitle}>簡易シャワールーム</h3>
              <p className={styles.text}>
                練習後に汗を流せる簡易シャワールームを完備しています。
                快適な環境でトレーニングに集中していただけます。
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
