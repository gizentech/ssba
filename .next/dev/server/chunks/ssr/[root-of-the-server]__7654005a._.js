module.exports = [
"[project]/pages/admin/column.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ColumnAdmin
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
;
;
;
const WP_API = ("TURBOPACK compile-time value", "http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1") || 'http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1';
const ADMIN_KEY = 'ssba1223';
const HEADERS = {
    'Content-Type': 'application/json',
    'X-SSBA-Admin-Key': ADMIN_KEY
};
const EMPTY_FORM = {
    title: '',
    content: '',
    excerpt: '',
    tag: ''
};
function ColumnAdmin() {
    const [columns, setColumns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(EMPTY_FORM);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const load = ()=>{
        setLoading(true);
        fetch(`${WP_API}/columns`).then((r)=>r.json()).then((d)=>{
            setColumns(Array.isArray(d) ? d : []);
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
            content: item.content.replace(/<[^>]+>/g, ''),
            excerpt: item.excerpt || '',
            tag: item.tag || ''
        });
        setError('');
        setEditing(item.id);
    };
    const handleDelete = async (item)=>{
        if (!confirm(`「${item.title}」を削除しますか？`)) return;
        await fetch(`${WP_API}/columns/${item.id}`, {
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
            const url = isNew ? `${WP_API}/columns` : `${WP_API}/columns/${editing}`;
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
                                editing === 'new' ? '新規コラム' : 'コラムを編集',
                                " - SSBA 管理"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/admin/column.js",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                            href: "https://fonts.googleapis.com/icon?family=Material+Icons",
                            rel: "stylesheet"
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/column.js",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/admin/column.js",
                    lineNumber: 77,
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
                                            fileName: "[project]/pages/admin/column.js",
                                            lineNumber: 84,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                            style: {
                                                fontSize: 20,
                                                fontWeight: 700,
                                                color: '#111',
                                                margin: 0
                                            },
                                            children: editing === 'new' ? '新規コラム' : 'コラムを編集'
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/column.js",
                                            lineNumber: 85,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/column.js",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: cardStyle,
                                    children: [
                                        [
                                            {
                                                label: 'タイトル',
                                                key: 'title',
                                                placeholder: '記事タイトル',
                                                required: true
                                            },
                                            {
                                                label: 'タグ',
                                                key: 'tag',
                                                placeholder: '例：技術・トレーニング'
                                            },
                                            {
                                                label: '抜粋（一覧に表示される説明文）',
                                                key: 'excerpt',
                                                placeholder: '記事の概要を入力'
                                            }
                                        ].map(({ label, key, placeholder, required })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: fieldWrap,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        style: labelStyle,
                                                        children: [
                                                            label,
                                                            required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: '#dc2626'
                                                                },
                                                                children: " *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/column.js",
                                                                lineNumber: 98,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/admin/column.js",
                                                        lineNumber: 97,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        value: form[key],
                                                        onChange: (e)=>setForm((p)=>({
                                                                    ...p,
                                                                    [key]: e.target.value
                                                                })),
                                                        placeholder: placeholder,
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/column.js",
                                                        lineNumber: 100,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, key, true, {
                                                fileName: "[project]/pages/admin/column.js",
                                                lineNumber: 96,
                                                columnNumber: 17
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: fieldWrap,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    style: labelStyle,
                                                    children: "本文"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/column.js",
                                                    lineNumber: 110,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                    value: form.content,
                                                    onChange: (e)=>setForm((p)=>({
                                                                ...p,
                                                                content: e.target.value
                                                            })),
                                                    placeholder: "コラムの内容を入力してください",
                                                    rows: 16,
                                                    style: {
                                                        ...inputStyle,
                                                        resize: 'vertical',
                                                        fontFamily: 'inherit',
                                                        lineHeight: 1.8
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/column.js",
                                                    lineNumber: 111,
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
                                                    fileName: "[project]/pages/admin/column.js",
                                                    lineNumber: 118,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/column.js",
                                            lineNumber: 109,
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
                                            fileName: "[project]/pages/admin/column.js",
                                            lineNumber: 123,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/column.js",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/admin/column.js",
                            lineNumber: 82,
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
                                        fileName: "[project]/pages/admin/column.js",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleSave,
                                        disabled: saving,
                                        style: saveBtnStyle,
                                        children: saving ? '保存中...' : '保存する'
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/column.js",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/admin/column.js",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/column.js",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/admin/column.js",
                    lineNumber: 81,
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
                        children: "コラム管理 - SSBA"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/column.js",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/icon?family=Material+Icons",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/column.js",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/admin/column.js",
                lineNumber: 143,
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
                                    children: "コラム管理"
                                }, void 0, false, {
                                    fileName: "[project]/pages/admin/column.js",
                                    lineNumber: 150,
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
                                            fileName: "[project]/pages/admin/column.js",
                                            lineNumber: 152,
                                            columnNumber: 15
                                        }, this),
                                        " 新規投稿"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/column.js",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/admin/column.js",
                            lineNumber: 149,
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
                            fileName: "[project]/pages/admin/column.js",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this) : columns.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            style: {
                                textAlign: 'center',
                                color: '#888',
                                padding: 40
                            },
                            children: "投稿がありません"
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/column.js",
                            lineNumber: 159,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            },
                            children: columns.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: listItemStyle,
                                    children: [
                                        item.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: item.image,
                                            alt: item.title,
                                            style: {
                                                width: 64,
                                                height: 48,
                                                objectFit: 'cover',
                                                borderRadius: 4,
                                                flexShrink: 0
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/column.js",
                                            lineNumber: 165,
                                            columnNumber: 21
                                        }, this),
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
                                                        item.tag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: 11,
                                                                color: '#555',
                                                                border: '1px solid #ccc',
                                                                padding: '1px 7px',
                                                                borderRadius: 3
                                                            },
                                                            children: item.tag
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/column.js",
                                                            lineNumber: 170,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: 12,
                                                                color: '#9ca3af'
                                                            },
                                                            children: item.date
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/column.js",
                                                            lineNumber: 172,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/admin/column.js",
                                                    lineNumber: 168,
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
                                                    fileName: "[project]/pages/admin/column.js",
                                                    lineNumber: 174,
                                                    columnNumber: 21
                                                }, this),
                                                item.excerpt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: 12,
                                                        color: '#888',
                                                        margin: '2px 0 0',
                                                        lineHeight: 1.4,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    },
                                                    children: item.excerpt
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/admin/column.js",
                                                    lineNumber: 178,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/column.js",
                                            lineNumber: 167,
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
                                                                fontSize: 15
                                                            },
                                                            children: "edit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/column.js",
                                                            lineNumber: 185,
                                                            columnNumber: 23
                                                        }, this),
                                                        " 編集"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/admin/column.js",
                                                    lineNumber: 184,
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
                                                                fontSize: 15
                                                            },
                                                            children: "delete"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/column.js",
                                                            lineNumber: 188,
                                                            columnNumber: 23
                                                        }, this),
                                                        " 削除"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/admin/column.js",
                                                    lineNumber: 187,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/admin/column.js",
                                            lineNumber: 183,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/pages/admin/column.js",
                                    lineNumber: 163,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/pages/admin/column.js",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/admin/column.js",
                    lineNumber: 148,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/admin/column.js",
                lineNumber: 147,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
const cardStyle = {
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '20px'
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

//# sourceMappingURL=%5Broot-of-the-server%5D__7654005a._.js.map