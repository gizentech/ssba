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
"[project]/styles/CoursePage.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "courseCard": "CoursePage-module__E2WHRG__courseCard",
  "courseContent": "CoursePage-module__E2WHRG__courseContent",
  "courseDescription": "CoursePage-module__E2WHRG__courseDescription",
  "courseGrid": "CoursePage-module__E2WHRG__courseGrid",
  "courseHeader": "CoursePage-module__E2WHRG__courseHeader",
  "courseImage": "CoursePage-module__E2WHRG__courseImage",
  "courseImg": "CoursePage-module__E2WHRG__courseImg",
  "courseMeta": "CoursePage-module__E2WHRG__courseMeta",
  "courseMetaItem": "CoursePage-module__E2WHRG__courseMetaItem",
  "courseMetaLabel": "CoursePage-module__E2WHRG__courseMetaLabel",
  "courseNumber": "CoursePage-module__E2WHRG__courseNumber",
  "coursePrice": "CoursePage-module__E2WHRG__coursePrice",
  "coursePriceNote": "CoursePage-module__E2WHRG__coursePriceNote",
  "coursePriceUnit": "CoursePage-module__E2WHRG__coursePriceUnit",
  "courseTag": "CoursePage-module__E2WHRG__courseTag",
  "courseTitle": "CoursePage-module__E2WHRG__courseTitle",
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
"[project]/pages/course/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoursePage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/SubPage.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/CoursePage.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wp$2d$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/wp-api.js [ssr] (ecmascript)");
;
;
;
;
;
;
;
function CoursePage() {
    const [courses, setCourses] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wp$2d$api$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["fetchCourses"])().then((data)=>{
            setCourses(data);
            setLoading(false);
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: "コース・料金 | SSBA"
                }, void 0, false, {
                    fileName: "[project]/pages/course/index.js",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/course/index.js",
                lineNumber: 21,
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
                                    children: "コース・料金"
                                }, void 0, false, {
                                    fileName: "[project]/pages/course/index.js",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageSub,
                                    children: "COURSE & PRICE"
                                }, void 0, false, {
                                    fileName: "[project]/pages/course/index.js",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/course/index.js",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/course/index.js",
                        lineNumber: 25,
                        columnNumber: 9
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
                                fileName: "[project]/pages/course/index.js",
                                lineNumber: 34,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/course/index.js",
                            lineNumber: 33,
                            columnNumber: 13
                        }, this) : courses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].section,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].text,
                                children: "コンテンツ準備中です"
                            }, void 0, false, {
                                fileName: "[project]/pages/course/index.js",
                                lineNumber: 38,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/course/index.js",
                            lineNumber: 37,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseGrid,
                            children: courses.map((course)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseImage,
                                            children: course.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: course.image,
                                                alt: course.title,
                                                width: 600,
                                                height: 400,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseImg
                                            }, void 0, false, {
                                                fileName: "[project]/pages/course/index.js",
                                                lineNumber: 46,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseImgPlaceholder
                                            }, void 0, false, {
                                                fileName: "[project]/pages/course/index.js",
                                                lineNumber: 54,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/course/index.js",
                                            lineNumber: 44,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseContent,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseHeader,
                                                    children: [
                                                        course.number && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseNumber,
                                                            children: course.number.replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, (c)=>String('①②③④⑤⑥⑦⑧⑨⑩'.indexOf(c) + 1))
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 60,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseTitle,
                                                            children: [
                                                                course.title,
                                                                course.subtitle && ` （${course.subtitle}）`,
                                                                course.tag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseTag,
                                                                    children: course.tag
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/course/index.js",
                                                                    lineNumber: 70,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 66,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/course/index.js",
                                                    lineNumber: 58,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseMeta,
                                                    children: [
                                                        course.schedule && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseMetaItem,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseMetaLabel,
                                                                    children: "日時"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/course/index.js",
                                                                    lineNumber: 77,
                                                                    columnNumber: 27
                                                                }, this),
                                                                course.schedule
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 76,
                                                            columnNumber: 25
                                                        }, this),
                                                        course.capacity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseMetaItem,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseMetaLabel,
                                                                    children: "定員"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/course/index.js",
                                                                    lineNumber: 83,
                                                                    columnNumber: 27
                                                                }, this),
                                                                course.capacity
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 82,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/course/index.js",
                                                    lineNumber: 74,
                                                    columnNumber: 21
                                                }, this),
                                                course.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseDescription,
                                                    children: course.description
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/course/index.js",
                                                    lineNumber: 89,
                                                    columnNumber: 23
                                                }, this),
                                                course.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coursePrice,
                                                    children: [
                                                        course.price,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coursePriceUnit,
                                                            children: "円"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 94,
                                                            columnNumber: 25
                                                        }, this),
                                                        course.priceNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coursePriceNote,
                                                            children: [
                                                                " ",
                                                                course.priceNote
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 96,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/course/index.js",
                                                    lineNumber: 92,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/course/index.js",
                                            lineNumber: 57,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, course.id, true, {
                                    fileName: "[project]/pages/course/index.js",
                                    lineNumber: 43,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/pages/course/index.js",
                            lineNumber: 41,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/course/index.js",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/course/index.js",
                lineNumber: 24,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__40d010fd._.js.map