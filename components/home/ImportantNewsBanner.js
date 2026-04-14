import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/ImportantNewsBanner.module.css';
import { fetchNews } from '@/lib/wp-api';

export default function ImportantNewsBanner() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchNews().then((data) => {
      if (Array.isArray(data)) {
        setItems(data.filter((item) => item.important === true));
      }
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <div className={styles.banner}>
      {items.map((item) => (
        <Link key={item.id} href={`/news/detail?id=${item.id}`} className={styles.row}>
          <span className={styles.label}>重要なお知らせ</span>
          <span className={styles.title}>{item.title}</span>
        </Link>
      ))}
    </div>
  );
}
