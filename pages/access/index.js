import SeoHead from '@/components/common/SeoHead';
import styles from '@/styles/SubPage.module.css';

export default function AccessPage() {
  return (
    <>
      <SeoHead
        title="アクセス｜福岡県久留米市安武町【SSBA】"
        description="SSBA（久留米の野球塾）へのアクセス。住所：福岡県久留米市安武町安武本2930-6。駐車場8台完備。Googleマップで場所を確認。TEL：090-1362-7517。"
        keywords="SSBA,アクセス,久留米,福岡,安武町,野球塾,駐車場,地図,シューティングスター"
        canonical="/access"
      />
      <div className={styles.wrapper}>
        {/* タイトルカード */}
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>アクセス</h1>
            <p className={styles.pageSub}>ACCESS</p>
          </div>
        </div>

        {/* 本文 */}
        <div className={styles.body}>
          {/* 概要 */}
          <div className={styles.section}>
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

          {/* 地図 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>アクセスマップ</h2>

            <div className={styles.accessInfo}>
              <p><strong>Shootingstar baseball academy</strong></p>
              <p>福岡県久留米市安武町安武本2930-6</p>
              <p>TEL：<a href="tel:09013627517" style={{ color: 'var(--color-primary)' }}>090-1362-7517</a></p>
              <p>Mail：<a href="mailto:ssba1223dn@gmail.com" style={{ color: 'var(--color-primary)' }}>ssba1223dn@gmail.com</a></p>
            </div>

            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3712.5358188849195!2d130.4954227!3d33.29870539999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3541a514e5d1386d%3A0x794eccb931ee8cfc!2z44CSODMwLTAwNzIg56aP5bKh55yM5LmF55WZ57Gz5biC5a6J5q2m55S65a6J5q2m5pys77yS77yZ77yT77yQ4oiS77yW!5e1!3m2!1sja!2sjp!4v1775175025720!5m2!1sja!2sjp"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SSBA アクセスマップ"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
