module.exports = [
"[project]/pages/admin/availability.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AvailabilityAdmin
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
;
;
;
const DAY_LABELS = [
    {
        key: 'mon',
        label: '月'
    },
    {
        key: 'tue',
        label: '火'
    },
    {
        key: 'wed',
        label: '水'
    },
    {
        key: 'thu',
        label: '木'
    },
    {
        key: 'fri',
        label: '金'
    },
    {
        key: 'sat',
        label: '土'
    }
];
const STATUS_CYCLE = [
    '○',
    '△',
    '×',
    '−'
];
const STATUS_STYLES = {
    '○': {
        bg: '#dcfce7',
        color: '#16a34a',
        label: '空きあり'
    },
    '△': {
        bg: '#fef9c3',
        color: '#ca8a04',
        label: '残りわずか'
    },
    '×': {
        bg: '#fecaca',
        color: '#dc2626',
        label: '満員'
    },
    '−': {
        bg: '#f3f4f6',
        color: '#9ca3af',
        label: '対象外'
    }
};
function AvailabilityAdmin() {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingClass, setEditingClass] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: '',
        subtitle: '',
        schedule: ''
    });
    const [isSP, setIsSP] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const WP_API = ("TURBOPACK compile-time value", "https://ssba1223.com/wp/wp-json/ssba/v1") || 'https://ssba1223.com/wp/wp-json/ssba/v1';
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetch(`${WP_API}/availability`).then((r)=>r.json()).then((d)=>setData(d));
        const check = ()=>setIsSP(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return ()=>window.removeEventListener('resize', check);
    }, []);
    const toggleStatus = (classIndex, dayKey)=>{
        setData((prev)=>{
            const next = JSON.parse(JSON.stringify(prev));
            const current = next.classes[classIndex].days[dayKey];
            const idx = STATUS_CYCLE.indexOf(current);
            next.classes[classIndex].days[dayKey] = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
            return next;
        });
    };
    const save = async ()=>{
        setSaving(true);
        try {
            const res = await fetch(`${WP_API}/availability`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-SSBA-Admin-Key': 'ssba1223'
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('保存失敗');
            setSaved(true);
            setTimeout(()=>setSaved(false), 2000);
        } catch  {
            alert('保存に失敗しました。');
        } finally{
            setSaving(false);
        }
    };
    const startEditClass = (index)=>{
        const cls = data.classes[index];
        setEditForm({
            name: cls.name,
            subtitle: cls.subtitle || '',
            schedule: cls.schedule || ''
        });
        setEditingClass(index);
    };
    const saveEditClass = ()=>{
        setData((prev)=>{
            const next = JSON.parse(JSON.stringify(prev));
            next.classes[editingClass].name = editForm.name;
            next.classes[editingClass].subtitle = editForm.subtitle;
            next.classes[editingClass].schedule = editForm.schedule;
            return next;
        });
        setEditingClass(null);
    };
    const addClass = ()=>{
        setData((prev)=>{
            const next = JSON.parse(JSON.stringify(prev));
            next.classes.push({
                id: `class-${Date.now()}`,
                name: '新しいクラス',
                subtitle: '',
                schedule: '',
                days: {
                    mon: '−',
                    tue: '−',
                    wed: '−',
                    thu: '−',
                    fri: '−',
                    sat: '−'
                }
            });
            return next;
        });
    };
    const removeClass = (index)=>{
        if (!confirm(`「${data.classes[index].name}」を削除しますか？`)) return;
        setData((prev)=>{
            const next = JSON.parse(JSON.stringify(prev));
            next.classes.splice(index, 1);
            return next;
        });
    };
    const moveClass = (index, direction)=>{
        setData((prev)=>{
            const next = JSON.parse(JSON.stringify(prev));
            const target = index + direction;
            if (target < 0 || target >= next.classes.length) return prev;
            [next.classes[index], next.classes[target]] = [
                next.classes[target],
                next.classes[index]
            ];
            return next;
        });
    };
    if (!data) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: 40,
            textAlign: 'center'
        },
        children: "読み込み中..."
    }, void 0, false, {
        fileName: "[project]/pages/admin/availability.js",
        lineNumber: 123,
        columnNumber: 21
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "空き状況管理 - SSBA"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/availability.js",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "robots",
                        content: "noindex"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/availability.js",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/icon?family=Material+Icons",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/availability.js",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/admin/availability.js",
                lineNumber: 127,
                columnNumber: 7
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
                            maxWidth: 800,
                            margin: '0 auto'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: 20,
                                    fontWeight: 700,
                                    marginBottom: 4,
                                    color: '#111'
                                },
                                children: "アカデミー空き状況 管理"
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                style: {
                                    color: '#6b7280',
                                    fontSize: 13,
                                    marginBottom: 16
                                },
                                children: "タップして ○ → △ → × → − を切り替え"
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 12,
                                    marginBottom: 20,
                                    flexWrap: 'wrap'
                                },
                                children: STATUS_CYCLE.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 5
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                style: {
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 6,
                                                    background: STATUS_STYLES[s].bg,
                                                    color: STATUS_STYLES[s].color,
                                                    fontWeight: 700,
                                                    fontSize: 16
                                                },
                                                children: s
                                            }, void 0, false, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 12,
                                                    color: '#374151'
                                                },
                                                children: STATUS_STYLES[s].label
                                            }, void 0, false, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, s, true, {
                                        fileName: "[project]/pages/admin/availability.js",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            isSP ? /* ===== SP: カード形式 ===== */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 12,
                                    marginBottom: 16
                                },
                                children: data.classes.map((cls, ci)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: '#fff',
                                            borderRadius: 10,
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            overflow: 'hidden'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 14px',
                                                    borderBottom: '1px solid #e5e7eb',
                                                    background: '#f9fafb'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontWeight: 700,
                                                                    fontSize: 14,
                                                                    color: '#111'
                                                                },
                                                                children: cls.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 170,
                                                                columnNumber: 23
                                                            }, this),
                                                            cls.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: 11,
                                                                    color: '#9ca3af',
                                                                    marginTop: 1
                                                                },
                                                                children: cls.subtitle
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 171,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/admin/availability.js",
                                                        lineNumber: 169,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            gap: 2
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>moveClass(ci, -1),
                                                                style: iconBtn,
                                                                title: "上へ",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "material-icons",
                                                                    style: {
                                                                        fontSize: 18
                                                                    },
                                                                    children: "arrow_upward"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/admin/availability.js",
                                                                    lineNumber: 174,
                                                                    columnNumber: 92
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 174,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>moveClass(ci, 1),
                                                                style: iconBtn,
                                                                title: "下へ",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "material-icons",
                                                                    style: {
                                                                        fontSize: 18
                                                                    },
                                                                    children: "arrow_downward"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/admin/availability.js",
                                                                    lineNumber: 175,
                                                                    columnNumber: 91
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 175,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>startEditClass(ci),
                                                                style: iconBtn,
                                                                title: "編集",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "material-icons",
                                                                    style: {
                                                                        fontSize: 18
                                                                    },
                                                                    children: "edit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/admin/availability.js",
                                                                    lineNumber: 176,
                                                                    columnNumber: 93
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 176,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeClass(ci),
                                                                style: {
                                                                    ...iconBtn,
                                                                    color: '#ef4444'
                                                                },
                                                                title: "削除",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "material-icons",
                                                                    style: {
                                                                        fontSize: 18
                                                                    },
                                                                    children: "delete"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/admin/availability.js",
                                                                    lineNumber: 177,
                                                                    columnNumber: 115
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 177,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/admin/availability.js",
                                                        lineNumber: 173,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 165,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(6, 1fr)',
                                                    gap: 6,
                                                    padding: 10
                                                },
                                                children: DAY_LABELS.map((d)=>{
                                                    const status = cls.days[d.key] || '−';
                                                    const st = STATUS_STYLES[status];
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            textAlign: 'center'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: 11,
                                                                    color: '#6b7280',
                                                                    marginBottom: 3,
                                                                    fontWeight: 600
                                                                },
                                                                children: d.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 189,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>toggleStatus(ci, d.key),
                                                                style: {
                                                                    width: '100%',
                                                                    aspectRatio: '1',
                                                                    borderRadius: 8,
                                                                    border: 'none',
                                                                    background: st.bg,
                                                                    color: st.color,
                                                                    fontSize: 20,
                                                                    fontWeight: 700,
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                },
                                                                children: status
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 190,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, d.key, true, {
                                                        fileName: "[project]/pages/admin/availability.js",
                                                        lineNumber: 188,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 181,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, cls.id, true, {
                                        fileName: "[project]/pages/admin/availability.js",
                                        lineNumber: 160,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this) : /* ===== PC: テーブル形式 ===== */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    overflowX: 'auto',
                                    marginBottom: 16
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                    style: {
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        background: '#fff',
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: '12px 16px',
                                                            textAlign: 'left',
                                                            background: '#f3f4f6',
                                                            borderBottom: '2px solid #e5e7eb',
                                                            fontSize: 14,
                                                            color: '#374151'
                                                        },
                                                        children: "クラス名"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/availability.js",
                                                        lineNumber: 212,
                                                        columnNumber: 21
                                                    }, this),
                                                    DAY_LABELS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: '12px 8px',
                                                                textAlign: 'center',
                                                                background: '#f3f4f6',
                                                                borderBottom: '2px solid #e5e7eb',
                                                                fontSize: 15,
                                                                fontWeight: 700,
                                                                color: '#374151',
                                                                width: 60
                                                            },
                                                            children: d.label
                                                        }, d.key, false, {
                                                            fileName: "[project]/pages/admin/availability.js",
                                                            lineNumber: 214,
                                                            columnNumber: 23
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: '12px 8px',
                                                            background: '#f3f4f6',
                                                            borderBottom: '2px solid #e5e7eb',
                                                            width: 100
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/admin/availability.js",
                                                        lineNumber: 218,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 211,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            children: data.classes.map((cls, ci)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    style: {
                                                        borderBottom: '1px solid #e5e7eb'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: '12px 16px'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontWeight: 600,
                                                                        fontSize: 14,
                                                                        color: '#111'
                                                                    },
                                                                    children: cls.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/admin/availability.js",
                                                                    lineNumber: 225,
                                                                    columnNumber: 25
                                                                }, this),
                                                                cls.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 11,
                                                                        color: '#9ca3af',
                                                                        marginTop: 2
                                                                    },
                                                                    children: cls.subtitle
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/admin/availability.js",
                                                                    lineNumber: 226,
                                                                    columnNumber: 42
                                                                }, this),
                                                                cls.schedule && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 11,
                                                                        color: '#9ca3af',
                                                                        marginTop: 1
                                                                    },
                                                                    children: cls.schedule
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/admin/availability.js",
                                                                    lineNumber: 227,
                                                                    columnNumber: 42
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/admin/availability.js",
                                                            lineNumber: 224,
                                                            columnNumber: 23
                                                        }, this),
                                                        DAY_LABELS.map((d)=>{
                                                            const status = cls.days[d.key] || '−';
                                                            const st = STATUS_STYLES[status];
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: 6,
                                                                    textAlign: 'center'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>toggleStatus(ci, d.key),
                                                                    style: {
                                                                        width: 44,
                                                                        height: 44,
                                                                        borderRadius: 8,
                                                                        border: 'none',
                                                                        background: st.bg,
                                                                        color: st.color,
                                                                        fontSize: 22,
                                                                        fontWeight: 700,
                                                                        cursor: 'pointer',
                                                                        transition: 'transform 0.1s'
                                                                    },
                                                                    onMouseDown: (e)=>{
                                                                        e.currentTarget.style.transform = 'scale(0.9)';
                                                                    },
                                                                    onMouseUp: (e)=>{
                                                                        e.currentTarget.style.transform = 'scale(1)';
                                                                    },
                                                                    onMouseLeave: (e)=>{
                                                                        e.currentTarget.style.transform = 'scale(1)';
                                                                    },
                                                                    children: status
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/admin/availability.js",
                                                                    lineNumber: 234,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, d.key, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 233,
                                                                columnNumber: 27
                                                            }, this);
                                                        }),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: '6px 8px',
                                                                textAlign: 'center'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'flex',
                                                                    gap: 4,
                                                                    justifyContent: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>moveClass(ci, -1),
                                                                        style: iconBtn,
                                                                        title: "上へ",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "material-icons",
                                                                            style: {
                                                                                fontSize: 18
                                                                            },
                                                                            children: "arrow_upward"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/admin/availability.js",
                                                                            lineNumber: 251,
                                                                            columnNumber: 96
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/admin/availability.js",
                                                                        lineNumber: 251,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>moveClass(ci, 1),
                                                                        style: iconBtn,
                                                                        title: "下へ",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "material-icons",
                                                                            style: {
                                                                                fontSize: 18
                                                                            },
                                                                            children: "arrow_downward"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/admin/availability.js",
                                                                            lineNumber: 252,
                                                                            columnNumber: 95
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/admin/availability.js",
                                                                        lineNumber: 252,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>startEditClass(ci),
                                                                        style: iconBtn,
                                                                        title: "編集",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "material-icons",
                                                                            style: {
                                                                                fontSize: 18
                                                                            },
                                                                            children: "edit"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/admin/availability.js",
                                                                            lineNumber: 253,
                                                                            columnNumber: 97
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/admin/availability.js",
                                                                        lineNumber: 253,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>removeClass(ci),
                                                                        style: {
                                                                            ...iconBtn,
                                                                            color: '#ef4444'
                                                                        },
                                                                        title: "削除",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "material-icons",
                                                                            style: {
                                                                                fontSize: 18
                                                                            },
                                                                            children: "delete"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/admin/availability.js",
                                                                            lineNumber: 254,
                                                                            columnNumber: 119
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/admin/availability.js",
                                                                        lineNumber: 254,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 250,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/availability.js",
                                                            lineNumber: 249,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, cls.id, true, {
                                                    fileName: "[project]/pages/admin/availability.js",
                                                    lineNumber: 223,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 221,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 209,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: addClass,
                                style: {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '10px 20px',
                                    border: '2px dashed #d1d5db',
                                    borderRadius: 8,
                                    background: '#fff',
                                    color: '#6b7280',
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    marginBottom: 24,
                                    width: isSP ? '100%' : 'auto',
                                    justifyContent: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "material-icons",
                                        style: {
                                            fontSize: 18
                                        },
                                        children: "add"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/availability.js",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    " クラスを追加"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'fixed',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '12px 16px',
                                    background: '#fff',
                                    borderTop: '1px solid #e5e7eb',
                                    boxShadow: '0 -2px 8px rgba(0,0,0,0.08)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        maxWidth: 800,
                                        margin: '0 auto'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: save,
                                        disabled: saving,
                                        style: {
                                            width: '100%',
                                            padding: '14px 0',
                                            borderRadius: 8,
                                            border: 'none',
                                            background: saved ? '#16a34a' : '#111',
                                            color: '#fff',
                                            fontSize: 16,
                                            fontWeight: 600,
                                            cursor: saving ? 'wait' : 'pointer',
                                            transition: 'background 0.3s'
                                        },
                                        children: saving ? '保存中...' : saved ? '保存しました ✓' : '変更を保存'
                                    }, void 0, false, {
                                        fileName: "[project]/pages/admin/availability.js",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 283,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/admin/availability.js",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    editingClass !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: 16
                        },
                        onClick: (e)=>{
                            if (e.target === e.currentTarget) setEditingClass(null);
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                background: '#fff',
                                borderRadius: 12,
                                padding: 24,
                                width: '100%',
                                maxWidth: 400
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 700,
                                        marginBottom: 16,
                                        color: '#111'
                                    },
                                    children: "クラス情報を編集"
                                }, void 0, false, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 311,
                                    columnNumber: 15
                                }, this),
                                [
                                    {
                                        label: 'クラス名',
                                        key: 'name',
                                        placeholder: ''
                                    },
                                    {
                                        label: 'サブタイトル',
                                        key: 'subtitle',
                                        placeholder: '例: 小学6年生限定'
                                    },
                                    {
                                        label: '時間帯',
                                        key: 'schedule',
                                        placeholder: '例: 17:15〜18:35'
                                    }
                                ].map(({ label, key, placeholder })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'block',
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: '#374151',
                                                    marginBottom: 4
                                                },
                                                children: label
                                            }, void 0, false, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 318,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                value: editForm[key],
                                                onChange: (e)=>setEditForm((p)=>({
                                                            ...p,
                                                            [key]: e.target.value
                                                        })),
                                                placeholder: placeholder,
                                                style: {
                                                    width: '100%',
                                                    padding: '10px 12px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: 6,
                                                    fontSize: 14,
                                                    boxSizing: 'border-box'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 319,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/pages/admin/availability.js",
                                        lineNumber: 317,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 8,
                                        justifyContent: 'flex-end',
                                        marginTop: 20
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setEditingClass(null),
                                            style: {
                                                padding: '10px 20px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: 6,
                                                background: '#fff',
                                                fontSize: 14,
                                                cursor: 'pointer',
                                                color: '#374151'
                                            },
                                            children: "キャンセル"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 328,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: saveEditClass,
                                            style: {
                                                padding: '10px 20px',
                                                border: 'none',
                                                borderRadius: 6,
                                                background: '#111',
                                                color: '#fff',
                                                fontSize: 14,
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            },
                                            children: "保存"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 331,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 327,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/admin/availability.js",
                            lineNumber: 310,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/availability.js",
                        lineNumber: 302,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/admin/availability.js",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
const iconBtn = {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: 16,
    color: '#6b7280',
    padding: 6,
    borderRadius: 6,
    lineHeight: 1
};
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f023a6ab._.js.map