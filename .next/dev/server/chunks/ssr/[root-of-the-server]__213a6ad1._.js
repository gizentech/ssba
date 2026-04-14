module.exports = [
"[project]/pages/admin/news.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewsAdmin
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
;
;
;
const WP_API = ("TURBOPACK compile-time value", "https://ssba1223.com/wp/wp-json/ssba/v1") || 'https://ssba1223.com/wp/wp-json/ssba/v1';
const ADMIN_KEY = 'ssba1223';
const HEADERS = {
    'Content-Type': 'application/json',
    'X-SSBA-Admin-Key': ADMIN_KEY
};
const EMPTY_FORM = {
    title: '',
    content: '',
    tag: '',
    important: false
};
function NewsAdmin() {
    const [news, setNews] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null); // null=一覧, 'new'=新規, number=編集中ID
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(EMPTY_FORM);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const load = ()=>{
        setLoading(true);
        fetch(`${WP_API}/news`).then((r)=>r.json()).then((d)=>{
            setNews(Array.isArray(d) ? d : []);
            setLoading(false);
        }).catch(()=>setLoading(false));
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        load();
    }, []);
    const openNew = ()=>{
        setForm(EMPTY_FORM);
        setError('');
        setEditing('new');
    };
    const openEdit = (item)=>{
        setForm({
            title: item.title,
            content: item.rawContent || item.content.replace(/<[^>]+>/g, ''),
            tag: item.tag || '',
            important: !!item.important
        });
        setError('');
        setEditing(item.id);
    };
    const handleDelete = async (item)=>{
        if (!confirm(`「${item.title}」を削除しますか？`)) return;
        await fetch(`${WP_API}/news/${item.id}`, {
            method: 'DELETE',
            headers: HEADERS
        });
        load();
    };
    const handleSave = async ()=>{
        if (!form.title.trim()) {
            setError('タイトルを入力してください');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const isNew = editing === 'new';
            const url = isNew ? `${WP_API}/news` : `${WP_API}/news/${editing}`;
            const method = isNew ? 'POST' : 'PUT';
            const res = await fetch(url, {
                method,
                headers: HEADERS,
                body: JSON.stringify(form)
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || '保存に失敗しました');
            }
            setEditing(null);
            load();
        } catch (e) {
            setError(e.message);
        } finally{
            setSaving(false);
        }
    };
    /* ===== 編集フォーム ===== */ if (editing !== null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                            children: [
                                editing === 'new' ? '新規投稿' : '編集',
                                " - SSBA 管理"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/admin/news.js",
                            lineNumber: 82,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                            href: "https://fonts.googleapis.com/icon?family=Material+Icons",
                            rel: "stylesheet"
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/news.js",
                            lineNumber: 83,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/admin/news.js",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        minHeight: '100vh',
                        background: '#f5f5f5',
                        padding: '20px 12px 100px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                maxWidth: 720,
                                margin: '0 auto'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        marginBottom: 24
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setEditing(null),
                                            style: backBtnStyle,
                                            children: "← 一覧"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                            style: {
                                                fontSize: 20,
                                                fontWeight: 700,
                                                color: '#111',
                                                margin: 0
                                            },
                                            children: editing === 'new' ? '新規投稿' : '記事を編集'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 89,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/news.js",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: cardStyle,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: fieldWrap,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    style: labelStyle,
                                                    children: [
                                                        "タイトル ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: '#dc2626'
                                                            },
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/news.js",
                                                            lineNumber: 97,
                                                            columnNumber: 48
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 97,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    value: form.title,
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                title: e.target.value
                                                            })),
                                                    placeholder: "記事タイトル",
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 98,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 96,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: fieldWrap,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    style: labelStyle,
                                                    children: "タグ"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 108,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    value: form.tag,
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                tag: e.target.value
                                                            })),
                                                    placeholder: "例：お知らせ・イベント",
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 109,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...fieldWrap,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    id: "important",
                                                    checked: form.important,
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                important: e.target.checked
                                                            })),
                                                    style: {
                                                        width: 18,
                                                        height: 18,
                                                        cursor: 'pointer',
                                                        accentColor: '#C41E24'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 119,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    htmlFor: "important",
                                                    style: {
                                                        ...labelStyle,
                                                        margin: 0,
                                                        cursor: 'pointer'
                                                    },
                                                    children: "重要（トップページに表示）"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 126,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: fieldWrap,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    style: labelStyle,
                                                    children: "本文"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 133,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                    value: form.content,
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                content: e.target.value
                                                            })),
                                                    placeholder: "記事の内容を入力してください",
                                                    rows: 14,
                                                    style: {
                                                        ...inputStyle,
                                                        resize: 'vertical',
                                                        fontFamily: 'inherit',
                                                        lineHeight: 1.8
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 134,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: 12,
                                                        color: '#9ca3af',
                                                        marginTop: 4
                                                    },
                                                    children: "※ HTMLタグも使用できます（<p>, <h2>, <strong>, <ul><li> など）"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 141,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 132,
                                            columnNumber: 15
                                        }, this),
                                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#dc2626',
                                                fontSize: 14,
                                                marginTop: 4
                                            },
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 146,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/news.js",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/admin/news.js",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: footerStyle,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    maxWidth: 720,
                                    margin: '0 auto',
                                    display: 'flex',
                                    gap: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setEditing(null),
                                        style: cancelBtnStyle,
                                        children: "キャンセル"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/news.js",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleSave,
                                        disabled: saving,
                                        style: saveBtnStyle,
                                        children: saving ? '保存中...' : '保存する'
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/news.js",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/admin/news.js",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/news.js",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/admin/news.js",
                    lineNumber: 85,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    /* ===== 一覧 ===== */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "お知らせ管理 - SSBA"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/news.js",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/icon?family=Material+Icons",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/news.js",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/admin/news.js",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    minHeight: '100vh',
                    background: '#f5f5f5',
                    padding: '20px 12px 40px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        maxWidth: 720,
                        margin: '0 auto'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 20
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    style: {
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: '#111',
                                        margin: 0
                                    },
                                    children: "お知らせ管理"
                                }, void 0, false, {
                                    fileName: "[project]/pages/admin/news.js",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: openNew,
                                    style: {
                                        ...newBtnStyle,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "material-icons",
                                            style: {
                                                fontSize: 18
                                            },
                                            children: "add"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 176,
                                            columnNumber: 15
                                        }, this),
                                        " 新規投稿"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/news.js",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/admin/news.js",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            style: {
                                textAlign: 'center',
                                color: '#888',
                                padding: 40
                            },
                            children: "読み込み中..."
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/news.js",
                            lineNumber: 181,
                            columnNumber: 13
                        }, this) : news.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            style: {
                                textAlign: 'center',
                                color: '#888',
                                padding: 40
                            },
                            children: "投稿がありません"
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/news.js",
                            lineNumber: 183,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            },
                            children: news.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: listItemStyle,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                flex: 1,
                                                minWidth: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        flexWrap: 'wrap'
                                                    },
                                                    children: [
                                                        item.important && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: 10,
                                                                fontWeight: 700,
                                                                color: '#fff',
                                                                background: '#C41E24',
                                                                padding: '2px 6px',
                                                                borderRadius: 3,
                                                                flexShrink: 0
                                                            },
                                                            children: "重要"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/news.js",
                                                            lineNumber: 191,
                                                            columnNumber: 25
                                                        }, this),
                                                        item.tag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: 11,
                                                                color: '#555',
                                                                border: '1px solid #ccc',
                                                                padding: '1px 7px',
                                                                borderRadius: 3,
                                                                flexShrink: 0
                                                            },
                                                            children: item.tag
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/news.js",
                                                            lineNumber: 198,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: 12,
                                                                color: '#9ca3af',
                                                                flexShrink: 0
                                                            },
                                                            children: item.date
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/news.js",
                                                            lineNumber: 203,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 189,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: 14,
                                                        fontWeight: 600,
                                                        color: '#111',
                                                        margin: '4px 0 0',
                                                        lineHeight: 1.5
                                                    },
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 205,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 188,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: 6,
                                                flexShrink: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>openEdit(item),
                                                    style: {
                                                        ...editBtnStyle,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 3
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "material-icons",
                                                            style: {
                                                                fontSize: 16
                                                            },
                                                            children: "edit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/news.js",
                                                            lineNumber: 211,
                                                            columnNumber: 23
                                                        }, this),
                                                        " 編集"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 210,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleDelete(item),
                                                    style: {
                                                        ...deleteBtnStyle,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 3
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "material-icons",
                                                            style: {
                                                                fontSize: 16
                                                            },
                                                            children: "delete"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/news.js",
                                                            lineNumber: 214,
                                                            columnNumber: 23
                                                        }, this),
                                                        " 削除"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/admin/news.js",
                                                    lineNumber: 213,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/news.js",
                                            lineNumber: 209,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/pages/admin/news.js",
                                    lineNumber: 187,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/news.js",
                            lineNumber: 185,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/admin/news.js",
                    lineNumber: 172,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/admin/news.js",
                lineNumber: 171,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
/* ===== スタイル定数 ===== */ const cardStyle = {
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '20px 20px'
};
const fieldWrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 20
};
const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151'
};
const inputStyle = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
    color: '#111'
};
const footerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    borderTop: '1px solid #e5e7eb',
    padding: '12px 16px',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.08)'
};
const saveBtnStyle = {
    flex: 1,
    padding: '13px 0',
    borderRadius: 8,
    border: 'none',
    background: '#111',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer'
};
const cancelBtnStyle = {
    padding: '13px 20px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    fontSize: 15,
    cursor: 'pointer'
};
const backBtnStyle = {
    padding: '6px 14px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: '#fff',
    color: '#374151',
    fontSize: 13,
    cursor: 'pointer'
};
const newBtnStyle = {
    padding: '8px 18px',
    border: 'none',
    borderRadius: 6,
    background: '#111',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
};
const listItemStyle = {
    background: '#fff',
    borderRadius: 8,
    padding: '12px 16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: 12
};
const editBtnStyle = {
    padding: '6px 14px',
    border: '1px solid #d1d5db',
    borderRadius: 5,
    background: '#fff',
    color: '#374151',
    fontSize: 13,
    cursor: 'pointer'
};
const deleteBtnStyle = {
    padding: '6px 14px',
    border: '1px solid #fca5a5',
    borderRadius: 5,
    background: '#fff',
    color: '#dc2626',
    fontSize: 13,
    cursor: 'pointer'
};
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__213a6ad1._.js.map