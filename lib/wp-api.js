const WP_API    = process.env.NEXT_PUBLIC_WP_API || 'https://ssba1223.com/wp/wp-json/ssba/v1';
const WP_BASE   = 'https://ssba1223.com/wp/wp-json/wp/v2';

async function wpFetch(path) {
  const res = await fetch(`${WP_API}${path}`);
  if (!res.ok) throw new Error(`WP API error: ${res.status} ${path}`);
  return res.json();
}

export async function fetchCourses() {
  try { return await wpFetch('/courses'); }
  catch { return []; }
}

export async function fetchNews({ perPage = -1, page = 1 } = {}) {
  try { return await wpFetch(`/news?per_page=${perPage}&page=${page}`); }
  catch { return []; }
}

export async function fetchNewsById(id) {
  try { return await wpFetch(`/news/${id}`); }
  catch { return null; }
}

export async function fetchImportantNews() {
  try { return await wpFetch('/news?important=1'); }
  catch { return []; }
}

export async function fetchColumns({ perPage = -1, page = 1 } = {}) {
  try { return await wpFetch(`/columns?per_page=${perPage}&page=${page}`); }
  catch { return []; }
}

export async function fetchColumnById(id) {
  try { return await wpFetch(`/columns/${id}`); }
  catch { return null; }
}

export async function fetchCoaches() {
  try { return await wpFetch('/coaches'); }
  catch { return []; }
}

export async function fetchReason() {
  try { return await wpFetch('/reason'); }
  catch { return { heroUrl: '', lead: '', bullets: [], sections: [] }; }
}

export async function fetchAvailability() {
  try { return await wpFetch('/availability'); }
  catch { return { classes: [] }; }
}

export async function fetchPartners() {
  try { return await wpFetch('/partners'); }
  catch { return { partners: [] }; }
}

export async function fetchPrivacyPolicy() {
  // まず投稿ID=3で直接取得を試みる
  try {
    const res = await fetch(`${WP_BASE}/pages/3`);
    if (res.ok) {
      const page = await res.json();
      return {
        title: page.title?.rendered || 'プライバシーポリシー',
        content: page.content?.rendered || '',
      };
    }
  } catch { /* 次の方法へ */ }

  // フォールバック：slugで検索
  try {
    const res = await fetch(`${WP_BASE}/pages?slug=privacy-policy&_fields=title,content`);
    if (res.ok) {
      const pages = await res.json();
      if (Array.isArray(pages) && pages.length > 0) {
        return {
          title: pages[0].title?.rendered || 'プライバシーポリシー',
          content: pages[0].content?.rendered || '',
        };
      }
    }
  } catch { /* 次の方法へ */ }

  // フォールバック：カスタムAPIのprivacy-policyエンドポイント
  try {
    const res = await fetch(`${WP_API}/privacy-policy`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || 'プライバシーポリシー',
        content: data.content || '',
      };
    }
  } catch { /* すべて失敗 */ }

  return null;
}

export async function submitContact({ name, email, type, message }) {
  const res = await fetch(`${WP_API}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, type, message }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || '送信に失敗しました');
  }
  return data;
}
