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
"[project]/pages/pro-player/makihara.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MakiharaPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/CoachesPage.module.css [ssr] (css module)");
;
;
;
;
const player = {
    role: '内野手',
    name: '牧原 大成',
    nameEn: 'Taisei Makihara',
    photo: '/images/pro-player/makihara_t.webp',
    greeting: '',
    profile: [
        {
            text: '福岡県久留米市出身'
        },
        {
            text: '1992年10月15日生まれ（33歳）'
        },
        {
            text: '身長 172cm　体重 74kg'
        },
        {
            text: '血液型 A型'
        },
        {
            text: '右投左打'
        },
        {
            text: 'ドラフト 2010年（育成5位）'
        },
        {
            text: 'プロ通算 16年'
        }
    ],
    career: [
        {
            subtitle: '球歴',
            items: [
                '山本スカイヤーズ（水分小）',
                '久留米ボーイズ（田主丸中）',
                '城北高（甲子園出場）',
                '福岡ソフトバンクホークス'
            ]
        },
        {
            subtitle: '主なタイトル',
            items: [
                '首位打者 2025年',
                'ベストナイン 2025年',
                'ゴールデングラブ賞 2025年'
            ]
        }
    ],
    gallery: [
        '/images/makihara_nagare.webp'
    ]
};
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
                                fileName: "[project]/pages/pro-player/makihara.js",
                                lineNumber: 54,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/pro-player/makihara.js",
                        lineNumber: 52,
                        columnNumber: 13
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/pages/pro-player/makihara.js",
                lineNumber: 49,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/pages/pro-player/makihara.js",
        lineNumber: 47,
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
                        fileName: "[project]/pages/pro-player/makihara.js",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    block.items && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].careerList,
                        children: block.items.map((item, j)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                children: item
                            }, j, false, {
                                fileName: "[project]/pages/pro-player/makihara.js",
                                lineNumber: 73,
                                columnNumber: 45
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/pro-player/makihara.js",
                        lineNumber: 72,
                        columnNumber: 13
                    }, this),
                    block.teams && block.teams.map((team, k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].careerTeam,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].teamName,
                                    children: team.name
                                }, void 0, false, {
                                    fileName: "[project]/pages/pro-player/makihara.js",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].careerList,
                                    children: (team.items || []).map((item, l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: item
                                        }, l, false, {
                                            fileName: "[project]/pages/pro-player/makihara.js",
                                            lineNumber: 80,
                                            columnNumber: 54
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/pages/pro-player/makihara.js",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, k, true, {
                            fileName: "[project]/pages/pro-player/makihara.js",
                            lineNumber: 77,
                            columnNumber: 13
                        }, this))
                ]
            }, i, true, {
                fileName: "[project]/pages/pro-player/makihara.js",
                lineNumber: 69,
                columnNumber: 9
            }, this))
    }, void 0, false);
}
function MakiharaPage() {
    const galleryImages = player.gallery;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: [
                        player.name,
                        " - SSBA"
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/pro-player/makihara.js",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/pro-player/makihara.js",
                lineNumber: 95,
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
                                    children: "プロ野球選手紹介"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pro-player/makihara.js",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].pageSub,
                                    children: "PRO PLAYER"
                                }, void 0, false, {
                                    fileName: "[project]/pages/pro-player/makihara.js",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/pro-player/makihara.js",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/pro-player/makihara.js",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                    src: player.photo,
                                                    alt: player.name,
                                                    width: 200,
                                                    height: 267
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/pro-player/makihara.js",
                                                    lineNumber: 112,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pro-player/makihara.js",
                                                lineNumber: 111,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachInfo,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachLabel,
                                                        children: player.role
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/pro-player/makihara.js",
                                                        lineNumber: 120,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachName,
                                                        children: player.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/pro-player/makihara.js",
                                                        lineNumber: 121,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].coachNameEn,
                                                        children: player.nameEn
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/pro-player/makihara.js",
                                                        lineNumber: 122,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/pro-player/makihara.js",
                                                lineNumber: 119,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/pro-player/makihara.js",
                                        lineNumber: 110,
                                        columnNumber: 13
                                    }, this),
                                    player.greeting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].greetingBlock,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].greetingText,
                                            children: player.greeting
                                        }, void 0, false, {
                                            fileName: "[project]/pages/pro-player/makihara.js",
                                            lineNumber: 129,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pro-player/makihara.js",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this),
                                    galleryImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].imageGalleryNatural,
                                        children: galleryImages.map((url, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].imageItemNatural,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: url,
                                                    alt: `${player.name} ${i + 1}`,
                                                    width: 0,
                                                    height: 0,
                                                    sizes: "(max-width: 768px) 100vw, 50vw",
                                                    style: {
                                                        width: '100%',
                                                        height: 'auto'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/pro-player/makihara.js",
                                                    lineNumber: 138,
                                                    columnNumber: 21
                                                }, this)
                                            }, i, false, {
                                                fileName: "[project]/pages/pro-player/makihara.js",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/pro-player/makihara.js",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/pro-player/makihara.js",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileSidebar,
                                children: [
                                    player.profile && player.profile.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileSection,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileTitle,
                                                children: "プロフィール"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pro-player/makihara.js",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ProfileList, {
                                                profile: player.profile
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pro-player/makihara.js",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/pro-player/makihara.js",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this),
                                    player.career && player.career.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileSection,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CoachesPage$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].profileTitle,
                                                children: "主な球歴"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pro-player/makihara.js",
                                                lineNumber: 163,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CareerSection, {
                                                career: player.career
                                            }, void 0, false, {
                                                fileName: "[project]/pages/pro-player/makihara.js",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/pro-player/makihara.js",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/pro-player/makihara.js",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/pro-player/makihara.js",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/pro-player/makihara.js",
                lineNumber: 98,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__a9f022aa._.js.map