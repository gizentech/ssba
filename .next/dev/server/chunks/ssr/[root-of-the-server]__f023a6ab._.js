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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetch('/api/availability').then((r)=>r.json()).then((d)=>setData(d));
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
        await fetch('/api/availability', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        setSaving(false);
        setSaved(true);
        setTimeout(()=>setSaved(false), 2000);
    };
    const startEditClass = (index)=>{
        const cls = data.classes[index];
        setEditForm({
            name: cls.name,
            subtitle: cls.subtitle,
            schedule: cls.schedule
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
        lineNumber: 107,
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
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "robots",
                        content: "noindex"
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/availability.js",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/admin/availability.js",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    minHeight: '100vh',
                    background: '#f9fafb',
                    padding: '24px 16px'
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
                                    fontSize: 24,
                                    fontWeight: 700,
                                    marginBottom: 8,
                                    color: '#111'
                                },
                                children: "アカデミー空き状況 管理"
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                style: {
                                    color: '#6b7280',
                                    fontSize: 14,
                                    marginBottom: 24
                                },
                                children: "各セルをタップして ○ → △ → × → − を切り替えてください"
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 16,
                                    marginBottom: 24,
                                    flexWrap: 'wrap'
                                },
                                children: STATUS_CYCLE.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                style: {
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 6,
                                                    background: STATUS_STYLES[s].bg,
                                                    color: STATUS_STYLES[s].color,
                                                    fontWeight: 700,
                                                    fontSize: 18
                                                },
                                                children: s
                                            }, void 0, false, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 13,
                                                    color: '#374151'
                                                },
                                                children: STATUS_STYLES[s].label
                                            }, void 0, false, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 134,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, s, true, {
                                        fileName: "[project]/pages/admin/availability.js",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    overflowX: 'auto',
                                    marginBottom: 24
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
                                                        lineNumber: 144,
                                                        columnNumber: 19
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
                                                            lineNumber: 148,
                                                            columnNumber: 21
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
                                                        lineNumber: 152,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/admin/availability.js",
                                                lineNumber: 143,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 142,
                                            columnNumber: 15
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
                                                                    lineNumber: 159,
                                                                    columnNumber: 23
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
                                                                    lineNumber: 160,
                                                                    columnNumber: 40
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
                                                                    lineNumber: 161,
                                                                    columnNumber: 40
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/admin/availability.js",
                                                            lineNumber: 158,
                                                            columnNumber: 21
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
                                                                    lineNumber: 168,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, d.key, false, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 167,
                                                                columnNumber: 25
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
                                                                        style: {
                                                                            border: 'none',
                                                                            background: 'none',
                                                                            cursor: 'pointer',
                                                                            fontSize: 16,
                                                                            color: '#9ca3af',
                                                                            padding: 4
                                                                        },
                                                                        title: "上へ",
                                                                        children: "↑"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/admin/availability.js",
                                                                        lineNumber: 187,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>moveClass(ci, 1),
                                                                        style: {
                                                                            border: 'none',
                                                                            background: 'none',
                                                                            cursor: 'pointer',
                                                                            fontSize: 16,
                                                                            color: '#9ca3af',
                                                                            padding: 4
                                                                        },
                                                                        title: "下へ",
                                                                        children: "↓"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/admin/availability.js",
                                                                        lineNumber: 188,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>startEditClass(ci),
                                                                        style: {
                                                                            border: 'none',
                                                                            background: 'none',
                                                                            cursor: 'pointer',
                                                                            fontSize: 16,
                                                                            color: '#6b7280',
                                                                            padding: 4
                                                                        },
                                                                        title: "編集",
                                                                        children: "✏️"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/admin/availability.js",
                                                                        lineNumber: 189,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>removeClass(ci),
                                                                        style: {
                                                                            border: 'none',
                                                                            background: 'none',
                                                                            cursor: 'pointer',
                                                                            fontSize: 16,
                                                                            color: '#ef4444',
                                                                            padding: 4
                                                                        },
                                                                        title: "削除",
                                                                        children: "🗑️"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/admin/availability.js",
                                                                        lineNumber: 190,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/admin/availability.js",
                                                                lineNumber: 186,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/admin/availability.js",
                                                            lineNumber: 185,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, cls.id, true, {
                                                    fileName: "[project]/pages/admin/availability.js",
                                                    lineNumber: 157,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 140,
                                columnNumber: 11
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
                                    marginBottom: 32
                                },
                                children: "＋ クラスを追加"
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'sticky',
                                    bottom: 0,
                                    padding: '16px 0',
                                    background: '#f9fafb',
                                    borderTop: '1px solid #e5e7eb'
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
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/admin/availability.js",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/admin/availability.js",
                        lineNumber: 116,
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
                                    lineNumber: 239,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                            children: "クラス名"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            value: editForm.name,
                                            onChange: (e)=>setEditForm((p)=>({
                                                        ...p,
                                                        name: e.target.value
                                                    })),
                                            style: {
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: 6,
                                                fontSize: 14,
                                                boxSizing: 'border-box'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 242,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                            children: "サブタイトル"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 249,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            value: editForm.subtitle,
                                            onChange: (e)=>setEditForm((p)=>({
                                                        ...p,
                                                        subtitle: e.target.value
                                                    })),
                                            placeholder: "例: 小学6年生限定",
                                            style: {
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: 6,
                                                fontSize: 14,
                                                boxSizing: 'border-box'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 250,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 248,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: 20
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
                                            children: "時間帯"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            value: editForm.schedule,
                                            onChange: (e)=>setEditForm((p)=>({
                                                        ...p,
                                                        schedule: e.target.value
                                                    })),
                                            placeholder: "例: 17:15〜18:35",
                                            style: {
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: 6,
                                                fontSize: 14,
                                                boxSizing: 'border-box'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/admin/availability.js",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 8,
                                        justifyContent: 'flex-end'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setEditingClass(null),
                                            style: {
                                                padding: '8px 20px',
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
                                            lineNumber: 267,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: saveEditClass,
                                            style: {
                                                padding: '8px 20px',
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
                                            lineNumber: 270,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/admin/availability.js",
                                    lineNumber: 266,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/admin/availability.js",
                            lineNumber: 238,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/admin/availability.js",
                        lineNumber: 231,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/admin/availability.js",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f023a6ab._.js.map