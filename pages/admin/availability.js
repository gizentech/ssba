import { useState, useEffect } from 'react';
import Head from 'next/head';

const DAY_LABELS = [
  { key: 'mon', label: '月' },
  { key: 'tue', label: '火' },
  { key: 'wed', label: '水' },
  { key: 'thu', label: '木' },
  { key: 'fri', label: '金' },
  { key: 'sat', label: '土' },
];

const STATUS_CYCLE = ['○', '△', '×', '−'];

const STATUS_STYLES = {
  '○': { bg: '#dcfce7', color: '#16a34a', label: '空きあり' },
  '△': { bg: '#fef9c3', color: '#ca8a04', label: '残りわずか' },
  '×': { bg: '#fecaca', color: '#dc2626', label: '満員' },
  '−': { bg: '#f3f4f6', color: '#9ca3af', label: '対象外' },
};

export default function AvailabilityAdmin() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', subtitle: '', schedule: '' });
  const [isSP, setIsSP] = useState(false);

  const WP_API = process.env.NEXT_PUBLIC_WP_API || 'https://ssba1223.com/wp/wp-json/ssba/v1';

  useEffect(() => {
    fetch(`${WP_API}/availability`)
      .then((r) => r.json())
      .then((d) => setData(d));
    const check = () => setIsSP(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleStatus = (classIndex, dayKey) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const current = next.classes[classIndex].days[dayKey];
      const idx = STATUS_CYCLE.indexOf(current);
      next.classes[classIndex].days[dayKey] = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${WP_API}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-SSBA-Admin-Key': 'ssba1223',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('保存失敗');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const startEditClass = (index) => {
    const cls = data.classes[index];
    setEditForm({ name: cls.name, subtitle: cls.subtitle || '', schedule: cls.schedule || '' });
    setEditingClass(index);
  };

  const saveEditClass = () => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.classes[editingClass].name = editForm.name;
      next.classes[editingClass].subtitle = editForm.subtitle;
      next.classes[editingClass].schedule = editForm.schedule;
      return next;
    });
    setEditingClass(null);
  };

  const addClass = () => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.classes.push({
        id: `class-${Date.now()}`,
        name: '新しいクラス',
        subtitle: '',
        schedule: '',
        days: { mon: '−', tue: '−', wed: '−', thu: '−', fri: '−', sat: '−' },
      });
      return next;
    });
  };

  const removeClass = (index) => {
    if (!confirm(`「${data.classes[index].name}」を削除しますか？`)) return;
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.classes.splice(index, 1);
      return next;
    });
  };

  const moveClass = (index, direction) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const target = index + direction;
      if (target < 0 || target >= next.classes.length) return prev;
      [next.classes[index], next.classes[target]] = [next.classes[target], next.classes[index]];
      return next;
    });
  };

  if (!data) return <div style={{ padding: 40, textAlign: 'center' }}>読み込み中...</div>;

  return (
    <>
      <Head>
        <title>空き状況管理 - SSBA</title>
        <meta name="robots" content="noindex" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px 12px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#111' }}>
            アカデミー空き状況 管理
          </h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
            タップして ○ → △ → × → − を切り替え
          </p>

          {/* 凡例 */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {STATUS_CYCLE.map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 6,
                  background: STATUS_STYLES[s].bg, color: STATUS_STYLES[s].color,
                  fontWeight: 700, fontSize: 16,
                }}>{s}</span>
                <span style={{ fontSize: 12, color: '#374151' }}>{STATUS_STYLES[s].label}</span>
              </div>
            ))}
          </div>

          {isSP ? (
            /* ===== SP: カード形式 ===== */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {data.classes.map((cls, ci) => (
                <div key={cls.id} style={{
                  background: '#fff', borderRadius: 10,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden',
                }}>
                  {/* クラス名ヘッダー */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{cls.name}</div>
                      {cls.subtitle && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{cls.subtitle}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      <button onClick={() => moveClass(ci, -1)} style={iconBtn} title="上へ"><span className="material-icons" style={{ fontSize: 18 }}>arrow_upward</span></button>
                      <button onClick={() => moveClass(ci, 1)} style={iconBtn} title="下へ"><span className="material-icons" style={{ fontSize: 18 }}>arrow_downward</span></button>
                      <button onClick={() => startEditClass(ci)} style={iconBtn} title="編集"><span className="material-icons" style={{ fontSize: 18 }}>edit</span></button>
                      <button onClick={() => removeClass(ci)} style={{ ...iconBtn, color: '#ef4444' }} title="削除"><span className="material-icons" style={{ fontSize: 18 }}>delete</span></button>
                    </div>
                  </div>
                  {/* 曜日ボタン 3列グリッド */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, padding: 10,
                  }}>
                    {DAY_LABELS.map((d) => {
                      const status = cls.days[d.key] || '−';
                      const st = STATUS_STYLES[status];
                      return (
                        <div key={d.key} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3, fontWeight: 600 }}>{d.label}</div>
                          <button
                            onClick={() => toggleStatus(ci, d.key)}
                            style={{
                              width: '100%', aspectRatio: '1', borderRadius: 8, border: 'none',
                              background: st.bg, color: st.color,
                              fontSize: 20, fontWeight: 700, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >{status}</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ===== PC: テーブル形式 ===== */
            <div style={{ overflowX: 'auto', marginBottom: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', background: '#f3f4f6', borderBottom: '2px solid #e5e7eb', fontSize: 14, color: '#374151' }}>クラス名</th>
                    {DAY_LABELS.map((d) => (
                      <th key={d.key} style={{ padding: '12px 8px', textAlign: 'center', background: '#f3f4f6', borderBottom: '2px solid #e5e7eb', fontSize: 15, fontWeight: 700, color: '#374151', width: 60 }}>
                        {d.label}
                      </th>
                    ))}
                    <th style={{ padding: '12px 8px', background: '#f3f4f6', borderBottom: '2px solid #e5e7eb', width: 100 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {data.classes.map((cls, ci) => (
                    <tr key={cls.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>{cls.name}</div>
                        {cls.subtitle && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{cls.subtitle}</div>}
                        {cls.schedule && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{cls.schedule}</div>}
                      </td>
                      {DAY_LABELS.map((d) => {
                        const status = cls.days[d.key] || '−';
                        const st = STATUS_STYLES[status];
                        return (
                          <td key={d.key} style={{ padding: 6, textAlign: 'center' }}>
                            <button
                              onClick={() => toggleStatus(ci, d.key)}
                              style={{
                                width: 44, height: 44, borderRadius: 8, border: 'none',
                                background: st.bg, color: st.color,
                                fontSize: 22, fontWeight: 700, cursor: 'pointer',
                                transition: 'transform 0.1s',
                              }}
                              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
                              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >{status}</button>
                          </td>
                        );
                      })}
                      <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <button onClick={() => moveClass(ci, -1)} style={iconBtn} title="上へ"><span className="material-icons" style={{ fontSize: 18 }}>arrow_upward</span></button>
                          <button onClick={() => moveClass(ci, 1)} style={iconBtn} title="下へ"><span className="material-icons" style={{ fontSize: 18 }}>arrow_downward</span></button>
                          <button onClick={() => startEditClass(ci)} style={iconBtn} title="編集"><span className="material-icons" style={{ fontSize: 18 }}>edit</span></button>
                          <button onClick={() => removeClass(ci)} style={{ ...iconBtn, color: '#ef4444' }} title="削除"><span className="material-icons" style={{ fontSize: 18 }}>delete</span></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* クラス追加 */}
          <button
            onClick={addClass}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', border: '2px dashed #d1d5db', borderRadius: 8,
              background: '#fff', color: '#6b7280', fontSize: 14, cursor: 'pointer',
              marginBottom: 24, width: isSP ? '100%' : 'auto', justifyContent: 'center',
            }}
          >
            <span className="material-icons" style={{ fontSize: 18 }}>add</span> クラスを追加
          </button>

          {/* 保存ボタン（固定フッター） */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            padding: '12px 16px', background: '#fff', borderTop: '1px solid #e5e7eb',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
          }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <button
                onClick={save}
                disabled={saving}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 8, border: 'none',
                  background: saved ? '#16a34a' : '#111', color: '#fff',
                  fontSize: 16, fontWeight: 600, cursor: saving ? 'wait' : 'pointer',
                  transition: 'background 0.3s',
                }}
              >
                {saving ? '保存中...' : saved ? '保存しました ✓' : '変更を保存'}
              </button>
            </div>
          </div>
        </div>

        {/* クラス編集モーダル */}
        {editingClass !== null && (
          <div
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: 16,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setEditingClass(null); }}
          >
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#111' }}>クラス情報を編集</h3>
              {[
                { label: 'クラス名', key: 'name', placeholder: '' },
                { label: 'サブタイトル', key: 'subtitle', placeholder: '例: 小学6年生限定' },
                { label: '時間帯', key: 'schedule', placeholder: '例: 17:15〜18:35' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
                  <input
                    value={editForm[key]}
                    onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                <button onClick={() => setEditingClass(null)} style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: 14, cursor: 'pointer', color: '#374151' }}>
                  キャンセル
                </button>
                <button onClick={saveEditClass} style={{ padding: '10px 20px', border: 'none', borderRadius: 6, background: '#111', color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const iconBtn = {
  border: 'none', background: 'none', cursor: 'pointer',
  fontSize: 16, color: '#6b7280', padding: 6,
  borderRadius: 6, lineHeight: 1,
};
