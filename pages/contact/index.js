import { useState } from 'react';
import SeoHead from '@/components/common/SeoHead';
import styles from '@/styles/SubPage.module.css';
import formStyles from '@/styles/ContactPage.module.css';
import { submitContact } from '@/lib/wp-api';

const INQUIRY_TYPES = [
  '体験レッスンのお申込み',
  '入会のご相談',
  '施設貸出のご相談',
  'パーソナルレッスンのお申込み',
  'チーム出張指導のご相談',
  'その他',
];

export default function ContactPage() {
  const [values, setValues] = useState({ name: '', email: '', type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(v) {
    const e = {};
    if (!v.name.trim()) e.name = 'お名前を入力してください';
    if (!v.email.trim()) {
      e.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      e.email = '正しいメールアドレスを入力してください';
    }
    if (!v.type) e.type = 'お問い合わせ種別を選択してください';
    if (!v.message.trim()) e.message = 'お問い合わせ内容を入力してください';
    return e;
  }

  function handleChange(e) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate(values);
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    setSubmitting(true);
    try {
      await submitContact(values);
      setSubmitted(true);
    } catch (err) {
      setErrors({ message: err.message || '送信に失敗しました。時間をおいて再度お試しください。' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SeoHead
        title="お問い合わせ｜体験レッスン・入会のご相談【SSBA 久留米】"
        description="SSBA（久留米の野球塾）へのお問い合わせ・体験レッスン申込。電話：090-1362-7517。入会相談・施設貸出・パーソナルレッスンのご予約もこちらから。2営業日以内にご返信。"
        keywords="SSBA,お問い合わせ,体験レッスン,入会,野球塾,久留米,福岡,施設貸出,パーソナルレッスン"
        canonical="/contact"
      />
      <div className={styles.wrapper}>
        <div className={styles.titleCard}>
          <div className={styles.titleInner}>
            <h1 className={styles.pageTitle}>お問い合わせ</h1>
            <p className={styles.pageSub}>CONTACT</p>
          </div>
        </div>
        <div className={styles.body}>
          {/* SNS問い合わせ */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>お問い合わせ方法</h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '24px', lineHeight: '1.8' }}>
              公式LINE・Instagram DM、またはフォームからお気軽にお問い合わせください。
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <a
                href="https://line.me/R/ti/p/%40vyx4744a"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px',
                  padding: 'clamp(16px, 4vw, 24px) clamp(14px, 3vw, 20px)',
                  background: '#fff',
                  border: '2px solid #06C755',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#04a847'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#06C755'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#06C755', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="#fff" width="28" height="28">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#06C755', margin: 0, letterSpacing: '0.08em' }}>LINE</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: '#111', margin: '2px 0 4px' }}>公式LINE</p>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>友だち追加してメッセージにてお問い合わせください</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#06C755" strokeWidth="2" width="20" height="20" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
              </a>

              <a
                href="https://www.instagram.com/nagare007ssba/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px',
                  padding: 'clamp(16px, 4vw, 24px) clamp(14px, 3vw, 20px)',
                  background: '#fff',
                  border: '2px solid #dc2743',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#a81d32'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#dc2743'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="#fff" width="26" height="26">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#dc2743', margin: 0, letterSpacing: '0.08em' }}>INSTAGRAM</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: '#111', margin: '2px 0 4px' }}>Instagram DM</p>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>DMからお気軽にご連絡ください</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="#dc2743" strokeWidth="2" width="20" height="20" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
              </a>
            </div>
          </div>

          {/* フォーム */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>お問い合わせフォーム</h2>

            {submitted ? (
              <div className={formStyles.thankYou}>
                <div className={formStyles.thankYouIcon}>✓</div>
                <p className={formStyles.thankYouTitle}>送信が完了しました</p>
                <p className={formStyles.thankYouText}>
                  お問い合わせありがとうございます。<br />
                  内容を確認の上、2営業日以内にご返信いたします。
                </p>
              </div>
            ) : (
              <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
                <div className={formStyles.formRow}>
                  <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="name">
                      お名前<span className={formStyles.required}>必須</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={formStyles.input}
                      placeholder="例）流 大輔"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && <span className={formStyles.errorMsg}>{errors.name}</span>}
                  </div>
                  <div className={formStyles.formGroup}>
                    <label className={formStyles.label} htmlFor="email">
                      メールアドレス<span className={formStyles.required}>必須</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={formStyles.input}
                      placeholder="例）example@email.com"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span className={formStyles.errorMsg}>{errors.email}</span>}
                  </div>
                </div>

                <div className={formStyles.formGroup}>
                  <label className={formStyles.label} htmlFor="type">
                    お問い合わせ種別<span className={formStyles.required}>必須</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    className={formStyles.select}
                    value={values.type}
                    onChange={handleChange}
                  >
                    <option value="">選択してください</option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.type && <span className={formStyles.errorMsg}>{errors.type}</span>}
                </div>

                <div className={formStyles.formGroup}>
                  <label className={formStyles.label} htmlFor="message">
                    お問い合わせ内容<span className={formStyles.required}>必須</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={formStyles.textarea}
                    placeholder="お問い合わせ内容をご記入ください"
                    value={values.message}
                    onChange={handleChange}
                  />
                  {errors.message && <span className={formStyles.errorMsg}>{errors.message}</span>}
                </div>

                {errors.message && (
                  <p className={formStyles.errorMsg} style={{ marginBottom: 12 }}>{errors.message}</p>
                )}
                <div className={formStyles.submitWrap}>
                  <button type="submit" className={formStyles.submitBtn} disabled={submitting}>
                    {submitting ? '送信中...' : '送信する'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
