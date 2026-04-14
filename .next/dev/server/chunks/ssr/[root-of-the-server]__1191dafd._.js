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
"[project]/pages/course/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoursePage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/SubPage.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/CoursePage.module.css [ssr] (css module)");
;
;
;
;
;
const COURSES = [
    {
        number: '①',
        image: '/images/course/course1.webp',
        title: '小学生クラス',
        schedule: '月曜日〜金曜日 17:15〜18:35',
        capacity: '定員 8名',
        price: '13,200',
        priceNote: '税込 / 月4回'
    },
    {
        number: '②',
        image: '/images/course/course2.webp',
        title: '中学生クラス',
        subtitle: '硬式軟式混合',
        schedule: '月・木・金曜日 18:45〜20:10',
        capacity: '定員 8名',
        price: '15,400',
        priceNote: '税込 / 月4回'
    },
    {
        number: '③',
        image: '/images/course/course3.webp',
        title: '小学6年生限定 ハイレベルクラス',
        tag: '新設クラス',
        schedule: '水曜日 18:45〜20:10',
        capacity: '定員 10名',
        price: '15,400',
        priceNote: '税込 / 月4回',
        description: '元プロ野球独立リーグのスタッフによるハイレベルな技術練習＋トレーニングを指導するクラス。毎月一回ラプソードでの球速、打球速度計測、柔軟性、瞬発力など SSBAオリジナルメニューをデータ化し成長をサポートする。定期交流戦やグランド練習など計画予定。'
    },
    {
        number: '④',
        image: '/images/course/course4.webp',
        title: '中学3年生クラス',
        schedule: '9月〜3月 土曜日 17:00〜19:00',
        price: '16,000',
        priceNote: '税込',
        description: '高校野球準備クラス。技術練習、トレーニング、硬式球での交流戦などを行う。'
    },
    {
        number: '⑤',
        image: '/images/course/course5.webp',
        title: 'パーソナルレッスン',
        schedule: '60分',
        price: '6,600',
        priceNote: '※2名まで同額'
    },
    {
        number: '⑥',
        image: '/images/course/course6.webp',
        title: 'ラプソード計測',
        description: '球速・打球速度などの計測を行います。'
    },
    {
        number: '⑦',
        image: '/images/course/course7.webp',
        title: 'チーム出張指導',
        description: 'チーム単位での出張指導を承ります。詳しくはお問い合わせください。'
    }
];
function CoursePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: "コース・料金 | SSBA"
                }, void 0, false, {
                    fileName: "[project]/pages/course/index.js",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/course/index.js",
                lineNumber: 73,
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
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageSub,
                                    children: "COURSE & PRICE"
                                }, void 0, false, {
                                    fileName: "[project]/pages/course/index.js",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/course/index.js",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/course/index.js",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SubPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].body,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseGrid,
                            children: COURSES.map((course)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseImage,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: course.image,
                                                alt: course.title,
                                                width: 600,
                                                height: 400,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseImg
                                            }, void 0, false, {
                                                fileName: "[project]/pages/course/index.js",
                                                lineNumber: 88,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/course/index.js",
                                            lineNumber: 87,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseContent,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseHeader,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseNumber,
                                                            children: course.number
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 98,
                                                            columnNumber: 21
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
                                                                    lineNumber: 102,
                                                                    columnNumber: 38
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 99,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/course/index.js",
                                                    lineNumber: 97,
                                                    columnNumber: 19
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
                                                                    lineNumber: 108,
                                                                    columnNumber: 25
                                                                }, this),
                                                                course.schedule
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 107,
                                                            columnNumber: 23
                                                        }, this),
                                                        course.capacity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseMetaItem,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseMetaLabel,
                                                                    children: "定員"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/course/index.js",
                                                                    lineNumber: 114,
                                                                    columnNumber: 25
                                                                }, this),
                                                                course.capacity
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 113,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/course/index.js",
                                                    lineNumber: 105,
                                                    columnNumber: 19
                                                }, this),
                                                course.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].courseDescription,
                                                    children: course.description
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/course/index.js",
                                                    lineNumber: 120,
                                                    columnNumber: 21
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
                                                            lineNumber: 125,
                                                            columnNumber: 23
                                                        }, this),
                                                        course.priceNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoursePage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coursePriceNote,
                                                            children: [
                                                                " ",
                                                                course.priceNote
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/course/index.js",
                                                            lineNumber: 127,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/course/index.js",
                                                    lineNumber: 123,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/course/index.js",
                                            lineNumber: 96,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, course.number, true, {
                                    fileName: "[project]/pages/course/index.js",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/pages/course/index.js",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/course/index.js",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/course/index.js",
                lineNumber: 76,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1191dafd._.js.map