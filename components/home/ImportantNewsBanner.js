import Link from 'next/link';
import styles from '@/styles/ImportantNewsBanner.module.css';

export default function ImportantNewsBanner({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <div className={styles.banner}>
      {items.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`} className={styles.row}>
          <span className={styles.label}>重要なお知らせ</span>
          <span className={styles.title}>{item.title}</span>
        </Link>
      ))}
    </div>
  );
}
