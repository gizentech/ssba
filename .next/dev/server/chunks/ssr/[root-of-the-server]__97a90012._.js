module.exports = [
"[project]/styles/SubPage.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "accessInfo": "SubPage-module__B6T3FW__accessInfo",
  "body": "SubPage-module__B6T3FW__body",
  "bulletList": "SubPage-module__B6T3FW__bulletList",
  "facilityImage": "SubPage-module__B6T3FW__facilityImage",
  "heroImage": "SubPage-module__B6T3FW__heroImage",
  "imageRow": "SubPage-module__B6T3FW__imageRow",
  "infoBox": "SubPage-module__B6T3FW__infoBox",
  "infoTable": "SubPage-module__B6T3FW__infoTable",
  "leadText": "SubPage-module__B6T3FW__leadText",
  "mapContainer": "SubPage-module__B6T3FW__mapContainer",
  "noteList": "SubPage-module__B6T3FW__noteList",
  "optionList": "SubPage-module__B6T3FW__optionList",
  "pageSub": "SubPage-module__B6T3FW__pageSub",
  "pageTitle": "SubPage-module__B6T3FW__pageTitle",
  "priceTag": "SubPage-module__B6T3FW__priceTag",
  "section": "SubPage-module__B6T3FW__section",
  "sectionSub": "SubPage-module__B6T3FW__sectionSub",
  "sectionTitle": "SubPage-module__B6T3FW__sectionTitle",
  "subSection": "SubPage-module__B6T3FW__subSection",
  "subText": "SubPage-module__B6T3FW__subText",
  "subTitle": "SubPage-module__B6T3FW__subTitle",
  "text": "SubPage-module__B6T3FW__text",
  "titleCard": "SubPage-module__B6T3FW__titleCard",
  "titleInner": "SubPage-module__B6T3FW__titleInner",
  "wrapper": "SubPage-module__B6T3FW__wrapper",
});
}),
"[project]/lib/wp-api.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAvailability",
    ()=>fetchAvailability,
    "fetchCoaches",
    ()=>fetchCoaches,
    "fetchColumnById",
    ()=>fetchColumnById,
    "fetchColumns",
    ()=>fetchColumns,
    "fetchCourses",
    ()=>fetchCourses,
    "fetchImportantNews",
    ()=>fetchImportantNews,
    "fetchNews",
    ()=>fetchNews,
    "fetchNewsById",
    ()=>fetchNewsById,
    "fetchPartners",
    ()=>fetchPartners,
    "fetchReason",
    ()=>fetchReason,
    "submitContact",
    ()=>submitContact
]);
const WP_API = ("TURBOPACK compile-time value", "http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1") || 'http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1';
async function wpFetch(path) {
    const res = await fetch(`${WP_API}${path}`);
    if (!res.ok) throw new Error(`WP API error: ${res.status} ${path}`);
    return res.json();
}
async function fetchCourses() {
    try {
        return await wpFetch('/courses');
    } catch  {
        return [];
    }
}
async function fetchNews({ perPage = -1, page = 1 } = {}) {
    try {
        return await wpFetch(`/news?per_page=${perPage}&page=${page}`);
    } catch  {
        return [];
    }
}
async function fetchNewsById(id) {
    try {
        return await wpFetch(`/news/${id}`);
    } catch  {
        return null;
    }
}
async function fetchImportantNews() {
    try {
        return await wpFetch('/news?important=1');
    } catch  {
        return [];
    }
}
async function fetchColumns({ perPage = -1, page = 1 } = {}) {
    try {
        return await wpFetch(`/columns?per_page=${perPage}&page=${page}`);
    } catch  {
        return [];
    }
}
async function fetchColumnById(id) {
    try {
        return await wpFetch(`/columns/${id}`);
    } catch  {
        return null;
    }
}
async function fetchCoaches() {
    try {
        return await wpFetch('/coaches');
    } catch  {
        return [];
    }
}
async function fetchReason() {
    try {
        return await wpFetch('/reason');
    } catch  {
        return {
            heroUrl: '',
            lead: '',
            bullets: [],
            sections: []
        };
    }
}
async function fetchAvailability() {
    try {
        return await wpFetch('/availability');
    } catch  {
        return {
            classes: []
        };
    }
}
async function fetchPartners() {
    try {
        return await wpFetch('/partners');
    } catch  {
        return {
            partners: []
        };
    }
}
async function submitContact({ name, email, type, message }) {
    const res = await fetch(`${WP_API}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            type,
            message
        })
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || '送信に失敗しました');
    }
    return data;
}
}),
"[project]/pages/reason/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReasonPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/SubPage.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wp$2d$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/wp-api.js [ssr] (ecmascript)");
;
;
;
;
;
;
function ReasonPage() {
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        heroUrl: '',
        lead: '',
        bullets: [],
        sections: []
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wp$2d$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["fetchReason"])().then((data)=>{
            setReason(data);
            setLoading(false);
        });
    }, []);
    const { heroUrl, lead, bullets } = reason;
    let sections = reason.sections;
    if (typeof sections === 'string') {
        try {
            sections = JSON.parse(sections);
        } catch  {
            sections = [];
        }
    }
    if (!Array.isArray(sections)) sections = [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: "選ばれる理由 - SSBA"
                }, void 0, false, {
                    fileName: "[project]/pages/reason/index.js",
                    lineNumber: 28,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/reason/index.js",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].titleCard,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].titleInner,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageTitle,
                                    children: "選ばれる理由"
                                }, void 0, false, {
                                    fileName: "[project]/pages/reason/index.js",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageSub,
                                    children: "REASON"
                                }, void 0, false, {
                                    fileName: "[project]/pages/reason/index.js",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/reason/index.js",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/reason/index.js",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    !loading && heroUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].heroImage,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: heroUrl,
                            alt: "SSBA 指導風景",
                            width: 1200,
                            height: 600,
                            priority: true
                        }, void 0, false, {
                            fileName: "[project]/pages/reason/index.js",
                            lineNumber: 40,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/reason/index.js",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].body,
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].section,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].text,
                                style: {
                                    color: '#888'
                                },
                                children: "読み込み中..."
                            }, void 0, false, {
                                fileName: "[project]/pages/reason/index.js",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/reason/index.js",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                            children: [
                                lead && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].section,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].leadText,
                                        children: lead
                                    }, void 0, false, {
                                        fileName: "[project]/pages/reason/index.js",
                                        lineNumber: 59,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/reason/index.js",
                                    lineNumber: 58,
                                    columnNumber: 17
                                }, this),
                                bullets && bullets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].section,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionTitle,
                                            children: "このような方に選ばれています"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reason/index.js",
                                            lineNumber: 65,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].bulletList,
                                            children: bullets.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: item
                                                }, i, false, {
                                                    fileName: "[project]/pages/reason/index.js",
                                                    lineNumber: 68,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/reason/index.js",
                                            lineNumber: 66,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/reason/index.js",
                                    lineNumber: 64,
                                    columnNumber: 17
                                }, this),
                                sections.map((section, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].section,
                                        children: [
                                            section.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: section.title
                                            }, void 0, false, {
                                                fileName: "[project]/pages/reason/index.js",
                                                lineNumber: 77,
                                                columnNumber: 21
                                            }, this),
                                            section.paragraphs && section.paragraphs.map((p, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].text,
                                                    children: p
                                                }, j, false, {
                                                    fileName: "[project]/pages/reason/index.js",
                                                    lineNumber: 80,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/pages/reason/index.js",
                                        lineNumber: 75,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/pages/reason/index.js",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/reason/index.js",
                lineNumber: 30,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__97a90012._.js.map