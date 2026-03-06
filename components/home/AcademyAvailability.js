import { useState, useEffect } from 'react';
import styles from '@/styles/AcademyAvailability.module.css';

const DAY_LABELS = [
  { key: 'mon', label: '月' },
  { key: 'tue', label: '火' },
  { key: 'wed', label: '水' },
  { key: 'thu', label: '木' },
  { key: 'fri', label: '金' },
  { key: 'sat', label: '土' },
];

const STATUS_COLORS = {
  '○': '#4ade80',
  '△': '#fbbf24',
  '×': '#fff',
  '−': 'rgba(255,255,255,0.25)',
};

export default function AcademyAvailability({ visible = true }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/availability')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div
      className={styles.wrapper}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <h3 className={styles.title}>アカデミー空き状況</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.cornerCell}></th>
            {DAY_LABELS.map((d) => (
              <th key={d.key} className={styles.dayHeader}>{d.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.classes.map((cls) => {
            const tooltip = [cls.subtitle, cls.schedule].filter(Boolean).join(' / ');
            return (
              <tr key={cls.id}>
                <td className={styles.classCell} title={tooltip || undefined}>
                  <span className={styles.className}>{cls.name}</span>
                </td>
                {DAY_LABELS.map((d) => {
                  const status = cls.days[d.key] || '−';
                  return (
                    <td key={d.key} className={styles.statusCell}>
                      <span
                        className={styles.statusMark}
                        style={{ color: STATUS_COLORS[status] || '#fff' }}
                      >
                        {status}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
