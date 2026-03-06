import styles from '@/styles/SectionTitle.module.css';

export default function SectionTitle({ english, title }) {
  return (
    <div className={styles.wrapper}>
      {english && <p className={styles.english}>{english}</p>}
      <div className={styles.bar} />
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
