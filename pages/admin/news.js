import { useState, useEffect } from 'react';
import Head from 'next/head';

const WP_API = process.env.NEXT_PUBLIC_WP_API || 'https://ssba1223.com/wp/wp-json/ssba/v1';
const ADMIN_KEY = 'ssba1223';
const HEADERS = { 'Content-Type': 'application/json', 'X-SSBA-Admin-Key': ADMIN_KEY };

const EMPTY_FORM = { title: '', content: '', tag: '', important: false };

export default function NewsAdmin() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null=一覧, 'new'=新規, number=編集中ID
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetch(`${WP_API}/news`)
      .then((r) => r.json())
      .then((d) => { setNews(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setError('');
    setEditing('new');
  };

  const openEdit = (item) => {
    setForm({
      title: item.title,
      content: item.rawContent || item.content.replace(/<[^>]+>/g, ''),
      tag: item.tag || '',
      important: !!item.important,
    });
    setError('');
    setEditing(item.id);
  };

  const handleDelete = async (item) => {
    if (!confirm(`「${item.title}」を削除しますか？`)) return;
    await fetch(`${WP_API}/news/${item.id}`, { method: 'DELETE', headers: HEADERS });
    load();
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('タイトルを入力してください'); return; }
    setSaving(true);
    setError('');
    try {
      const isNew = editing === 'new';
      const url   = isNew ? `${WP_API}/news` : `${WP_API}/news/${editing}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: HEADERS,
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || '保存に失敗しました');
      }
      setEditing(null);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ===== 編集フォーム ===== */
  if (editing !== null) {
    return (
      <>
        <Head>
        <title>{editing === 'new' ? '新規投稿' : '編集'} - SSBA 管理</title>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>
        <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px 12px 100px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <button onClick={() => setEditing(null)} style={backBtnStyle}>← 一覧</button>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>
                {editing === 'new' ? '新規投稿' : '記事を編集'}
              </h1>
            </div>

            <div style={cardStyle}>
              {/* タイトル */}
              <div style={fieldWrap}>
                <label style={labelStyle}>タイトル <span style={{ color: '#dc2626' }}>*</span></label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="記事タイトル"
                  style={inputStyle}
                />
              </div>

              {/* タグ */}
              <div style={fieldWrap}>
                <label style={labelStyle}>タグ</label>
                <input
                  value={form.tag}
                  onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
                  placeholder="例：お知らせ・イベント"
                  style={inputStyle}
                />
              </div>

              {/* 重要フラグ */}
              <div style={{ ...fieldWrap, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="important"
                  checked={form.important}
                  onChange={(e) => setForm((p) => ({ ...p, important: e.target.checked }))}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#C41E24' }}
                />
                <label htmlFor="important" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>
                  重要（トップページに表示）
                </label>
              </div>

              {/* 本文 */}
              <div style={fieldWrap}>
                <label style={labelStyle}>本文</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="記事の内容を入力してください"
                  rows={14}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.8 }}
                />
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                  ※ HTMLタグも使用できます（&lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;ul&gt;&lt;li&gt; など）
                </p>
              </div>

              {error && <p style={{ color: '#dc2626', fontSize: 14, marginTop: 4 }}>{error}</p>}
            </div>
          </div>

          {/* 保存フッター */}
          <div style={footerStyle}>
            <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 10 }}>
              <button onClick={() => setEditing(null)} style={cancelBtnStyle}>キャンセル</button>
              <button onClick={handleSave} disabled={saving} style={saveBtnStyle}>
                {saving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ===== 一覧 ===== */
  return (
    <>
      <Head>
        <title>お知らせ管理 - SSBA</title>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px 12px 40px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>お知らせ管理</h1>
            <button onClick={openNew} style={{ ...newBtnStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="material-icons" style={{ fontSize: 18 }}>add</span> 新規投稿
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>読み込み中...</p>
          ) : news.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>投稿がありません</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {news.map((item) => (
                <div key={item.id} style={listItemStyle}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {item.important && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: '#fff',
                          background: '#C41E24', padding: '2px 6px', borderRadius: 3,
                          flexShrink: 0,
                        }}>重要</span>
                      )}
                      {item.tag && (
                        <span style={{
                          fontSize: 11, color: '#555', border: '1px solid #ccc',
                          padding: '1px 7px', borderRadius: 3, flexShrink: 0,
                        }}>{item.tag}</span>
                      )}
                      <span style={{ fontSize: 12, color: '#9ca3af', flexShrink: 0 }}>{item.date}</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '4px 0 0', lineHeight: 1.5 }}>
                      {item.title}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => openEdit(item)} style={{ ...editBtnStyle, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span className="material-icons" style={{ fontSize: 16 }}>edit</span> 編集
                    </button>
                    <button onClick={() => handleDelete(item)} style={{ ...deleteBtnStyle, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span className="material-icons" style={{ fontSize: 16 }}>delete</span> 削除
                    </button>
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

/* ===== スタイル定数 ===== */
const cardStyle = {
  background: '#fff', borderRadius: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px 20px',
};
const fieldWrap = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 };
const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151' };
const inputStyle = {
  padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6,
  fontSize: 14, width: '100%', boxSizing: 'border-box', color: '#111',
};
const footerStyle = {
  position: 'fixed', bottom: 0, left: 0, right: 0,
  background: '#fff', borderTop: '1px solid #e5e7eb',
  padding: '12px 16px', boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
};
const saveBtnStyle = {
  flex: 1, padding: '13px 0', borderRadius: 8, border: 'none',
  background: '#111', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
};
const cancelBtnStyle = {
  padding: '13px 20px', borderRadius: 8, border: '1px solid #d1d5db',
  background: '#fff', color: '#374151', fontSize: 15, cursor: 'pointer',
};
const backBtnStyle = {
  padding: '6px 14px', border: '1px solid #d1d5db', borderRadius: 6,
  background: '#fff', color: '#374151', fontSize: 13, cursor: 'pointer',
};
const newBtnStyle = {
  padding: '8px 18px', border: 'none', borderRadius: 6,
  background: '#111', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
};
const listItemStyle = {
  background: '#fff', borderRadius: 8, padding: '12px 16px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
  display: 'flex', alignItems: 'center', gap: 12,
};
const editBtnStyle = {
  padding: '6px 14px', border: '1px solid #d1d5db', borderRadius: 5,
  background: '#fff', color: '#374151', fontSize: 13, cursor: 'pointer',
};
const deleteBtnStyle = {
  padding: '6px 14px', border: '1px solid #fca5a5', borderRadius: 5,
  background: '#fff', color: '#dc2626', fontSize: 13, cursor: 'pointer',
};
