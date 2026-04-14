module.exports = [
"[project]/styles/CoachesPage.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "body": "CoachesPage-module__EGzhJW__body",
  "careerBlock": "CoachesPage-module__EGzhJW__careerBlock",
  "careerList": "CoachesPage-module__EGzhJW__careerList",
  "careerSubTitle": "CoachesPage-module__EGzhJW__careerSubTitle",
  "careerTeam": "CoachesPage-module__EGzhJW__careerTeam",
  "coachCard": "CoachesPage-module__EGzhJW__coachCard",
  "coachInfo": "CoachesPage-module__EGzhJW__coachInfo",
  "coachLabel": "CoachesPage-module__EGzhJW__coachLabel",
  "coachName": "CoachesPage-module__EGzhJW__coachName",
  "coachNameEn": "CoachesPage-module__EGzhJW__coachNameEn",
  "coachPhoto": "CoachesPage-module__EGzhJW__coachPhoto",
  "galleryImage": "CoachesPage-module__EGzhJW__galleryImage",
  "greetingBlock": "CoachesPage-module__EGzhJW__greetingBlock",
  "greetingText": "CoachesPage-module__EGzhJW__greetingText",
  "imageGalleryNatural": "CoachesPage-module__EGzhJW__imageGalleryNatural",
  "imageGalleryPc": "CoachesPage-module__EGzhJW__imageGalleryPc",
  "imageGallerySp": "CoachesPage-module__EGzhJW__imageGallerySp",
  "imageItem": "CoachesPage-module__EGzhJW__imageItem",
  "imageItemNatural": "CoachesPage-module__EGzhJW__imageItemNatural",
  "mainColumn": "CoachesPage-module__EGzhJW__mainColumn",
  "pageSub": "CoachesPage-module__EGzhJW__pageSub",
  "pageTitle": "CoachesPage-module__EGzhJW__pageTitle",
  "profileList": "CoachesPage-module__EGzhJW__profileList",
  "profileSection": "CoachesPage-module__EGzhJW__profileSection",
  "profileSidebar": "CoachesPage-module__EGzhJW__profileSidebar",
  "profileTitle": "CoachesPage-module__EGzhJW__profileTitle",
  "subList": "CoachesPage-module__EGzhJW__subList",
  "teamName": "CoachesPage-module__EGzhJW__teamName",
  "titleCard": "CoachesPage-module__EGzhJW__titleCard",
  "titleInner": "CoachesPage-module__EGzhJW__titleInner",
  "wrapper": "CoachesPage-module__EGzhJW__wrapper",
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
"[project]/pages/coaches/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoachesPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/CoachesPage.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wp$2d$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/wp-api.js [ssr] (ecmascript)");
;
;
;
;
;
;
function ProfileList({ profile }) {
    if (!profile || profile.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileList,
        children: profile.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                children: [
                    item.text,
                    item.children && item.children.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].subList,
                        children: item.children.map((child, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                children: child
                            }, j, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 17,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 15,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/pages/coaches/index.js",
                lineNumber: 12,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/pages/coaches/index.js",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
function CareerSection({ career }) {
    if (!career || career.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: career.map((block, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].careerBlock,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].careerSubTitle,
                        children: block.subtitle
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    block.items && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].careerList,
                        children: block.items.map((item, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                children: item
                            }, j, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 36,
                                columnNumber: 45
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 35,
                        columnNumber: 13
                    }, this),
                    block.teams && block.teams.map((team, k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].careerTeam,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].teamName,
                                    children: team.name
                                }, void 0, false, {
                                    fileName: "[project]/pages/coaches/index.js",
                                    lineNumber: 41,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].careerList,
                                    children: (team.items || []).map((item, l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: item
                                        }, l, false, {
                                            fileName: "[project]/pages/coaches/index.js",
                                            lineNumber: 43,
                                            columnNumber: 54
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/pages/coaches/index.js",
                                    lineNumber: 42,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, k, true, {
                            fileName: "[project]/pages/coaches/index.js",
                            lineNumber: 40,
                            columnNumber: 13
                        }, this))
                ]
            }, i, true, {
                fileName: "[project]/pages/coaches/index.js",
                lineNumber: 32,
                columnNumber: 9
            }, this))
    }, void 0, false);
}
function CoachSection({ coach }) {
    const LOCAL_GALLERY = [
        '/images/nagare/nagare01.avif',
        '/images/nagare/nagare03.avif',
        '/images/nagare/nagare04.avif',
        '/images/nagare/nagare05.avif',
        '/images/nagare/nagare06.avif'
    ];
    const validGallery = (coach.gallery || []).filter((url)=>url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'));
    const galleryImages = validGallery.length > 0 ? validGallery : LOCAL_GALLERY;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].body,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mainColumn,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachPhoto,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: coach.photo || '/images/nagare.webp',
                                    alt: coach.name,
                                    width: 200,
                                    height: 267
                                }, void 0, false, {
                                    fileName: "[project]/pages/coaches/index.js",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachInfo,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachLabel,
                                        children: coach.role
                                    }, void 0, false, {
                                        fileName: "[project]/pages/coaches/index.js",
                                        lineNumber: 79,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachName,
                                        children: coach.name
                                    }, void 0, false, {
                                        fileName: "[project]/pages/coaches/index.js",
                                        lineNumber: 80,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachNameEn,
                                        children: coach.nameEn
                                    }, void 0, false, {
                                        fileName: "[project]/pages/coaches/index.js",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    coach.greeting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].greetingBlock,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].greetingText,
                            children: coach.greeting
                        }, void 0, false, {
                            fileName: "[project]/pages/coaches/index.js",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    galleryImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].imageGalleryPc,
                        children: galleryImages.map((url, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].imageItem,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: url,
                                    alt: `${coach.name} ${i + 1}`,
                                    width: 240,
                                    height: 360,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].galleryImage
                                }, void 0, false, {
                                    fileName: "[project]/pages/coaches/index.js",
                                    lineNumber: 95,
                                    columnNumber: 17
                                }, this)
                            }, i, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/coaches/index.js",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileSidebar,
                children: [
                    coach.profile && coach.profile.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileTitle,
                                children: "プロフィール"
                            }, void 0, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ProfileList, {
                                profile: coach.profile
                            }, void 0, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this),
                    coach.career && coach.career.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileTitle,
                                children: "主な球歴"
                            }, void 0, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 118,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CareerSection, {
                                career: coach.career
                            }, void 0, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    galleryImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].imageGallerySp,
                        children: galleryImages.map((url, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].imageItem,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: url,
                                    alt: `${coach.name} ${i + 1}`,
                                    width: 240,
                                    height: 360,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].galleryImage
                                }, void 0, false, {
                                    fileName: "[project]/pages/coaches/index.js",
                                    lineNumber: 127,
                                    columnNumber: 17
                                }, this)
                            }, i, false, {
                                fileName: "[project]/pages/coaches/index.js",
                                lineNumber: 126,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/coaches/index.js",
                lineNumber: 108,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/coaches/index.js",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
function CoachesPage() {
    const [coaches, setCoaches] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wp$2d$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["fetchCoaches"])().then((data)=>{
            setCoaches(data);
            setLoading(false);
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: "指導者紹介 - SSBA"
                }, void 0, false, {
                    fileName: "[project]/pages/coaches/index.js",
                    lineNumber: 157,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/coaches/index.js",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].titleCard,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].titleInner,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageTitle,
                                    children: "指導者紹介"
                                }, void 0, false, {
                                    fileName: "[project]/pages/coaches/index.js",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageSub,
                                    children: "COACHES"
                                }, void 0, false, {
                                    fileName: "[project]/pages/coaches/index.js",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/coaches/index.js",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '60px 24px',
                            textAlign: 'center',
                            color: '#888'
                        },
                        children: "読み込み中..."
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this) : coaches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '60px 24px',
                            textAlign: 'center',
                            color: '#888'
                        },
                        children: "コンテンツ準備中です"
                    }, void 0, false, {
                        fileName: "[project]/pages/coaches/index.js",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this) : coaches.map((coach)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CoachSection, {
                            coach: coach
                        }, coach.id, false, {
                            fileName: "[project]/pages/coaches/index.js",
                            lineNumber: 177,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/coaches/index.js",
                lineNumber: 159,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__4e00077c._.js.map