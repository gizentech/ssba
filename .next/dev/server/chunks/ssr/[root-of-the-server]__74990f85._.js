module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/styles/Header.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "desktopNav": "Header-module__vcZAwq__desktopNav",
  "desktopNavContact": "Header-module__vcZAwq__desktopNavContact",
  "desktopNavLink": "Header-module__vcZAwq__desktopNavLink",
  "hamburger": "Header-module__vcZAwq__hamburger",
  "hamburgerOpen": "Header-module__vcZAwq__hamburgerOpen",
  "hamburgerWhiteHeader": "Header-module__vcZAwq__hamburgerWhiteHeader",
  "header": "Header-module__vcZAwq__header",
  "headerInner": "Header-module__vcZAwq__headerInner",
  "headerWhite": "Header-module__vcZAwq__headerWhite",
  "logo": "Header-module__vcZAwq__logo",
  "mobileNav": "Header-module__vcZAwq__mobileNav",
  "mobileNavContact": "Header-module__vcZAwq__mobileNavContact",
  "mobileNavLink": "Header-module__vcZAwq__mobileNavLink",
  "mobileNavOpen": "Header-module__vcZAwq__mobileNavOpen",
  "mobileOverlay": "Header-module__vcZAwq__mobileOverlay",
  "mobileOverlayVisible": "Header-module__vcZAwq__mobileOverlayVisible",
  "slideDown": "Header-module__vcZAwq__slideDown",
});
}),
"[project]/components/layout/Header.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/Header.module.css [ssr] (css module)");
;
;
;
;
;
const NAV_ITEMS = [
    {
        href: '/',
        label: 'トップ'
    },
    {
        href: '/reason',
        label: '選ばれる理由'
    },
    {
        href: '/course',
        label: 'コース・料金'
    },
    {
        href: '/facility',
        label: '施設紹介'
    },
    {
        href: '/coaches',
        label: '指導者紹介'
    },
    {
        href: '/news',
        label: 'お知らせ'
    },
    {
        href: '/column',
        label: 'コラム'
    },
    {
        href: '/access',
        label: 'アクセス'
    }
];
function Header({ isHome }) {
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showWhiteHeader, setShowWhiteHeader] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(!isHome);
    const [logoScale, setLogoScale] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // セカンドページ（index以外）は常に白ヘッダー
        if (!isHome) {
            setShowWhiteHeader(true);
            return;
        }
        // トップページに戻ったらスクロール位置に応じてリセット
        setShowWhiteHeader(false);
        const isSP = window.innerWidth <= 960;
        const maxScale = isSP ? 2 : 4;
        const minScale = isSP ? 2 : 4;
        setLogoScale(maxScale);
        const handleScroll = ()=>{
            if (window.scrollY === 0) {
                setShowWhiteHeader(false);
                return;
            }
            const proSection = document.getElementById('pro-support');
            if (proSection) {
                const rect = proSection.getBoundingClientRect();
                setShowWhiteHeader(rect.top <= 0);
            }
            const vh = window.innerHeight;
            const progress = Math.min(1, window.scrollY / (vh * 0.7));
            const newScale = maxScale - (maxScale - minScale) * progress;
            setLogoScale(newScale);
        };
        const handleResize = ()=>{
            const nowSP = window.innerWidth <= 960;
            const newMax = nowSP ? 2 : 4;
            const newMin = nowSP ? 2 : 4;
            const vh = window.innerHeight;
            const progress = Math.min(1, window.scrollY / (vh * 0.7));
            setLogoScale(newMax - (newMax - newMin) * progress);
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return ()=>{
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [
        isHome
    ]);
    // PCで白ヘッダーに切り替わったらメニューを自動で閉じる
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (showWhiteHeader && window.innerWidth > 960) {
            setMenuOpen(false);
        }
    }, [
        showWhiteHeader
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].header} ${showWhiteHeader ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].headerWhite : ''}`,
                style: {
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].headerInner,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].logo,
                            style: !showWhiteHeader && logoScale !== null ? {
                                transform: `scale(${logoScale})`
                            } : undefined,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: showWhiteHeader ? '/images/logo_after.png' : '/images/logo_before.png',
                                alt: "SSBA - Shootingstar Baseball Academy",
                                width: 200,
                                height: 60,
                                priority: true
                            }, void 0, false, {
                                fileName: "[project]/components/layout/Header.js",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/Header.js",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        showWhiteHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].desktopNav,
                            children: [
                                NAV_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].desktopNavLink,
                                        children: item.label
                                    }, item.href, false, {
                                        fileName: "[project]/components/layout/Header.js",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/contact",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].desktopNavContact,
                                    children: "お問い合わせ"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Header.js",
                                    lineNumber: 111,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/Header.js",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/Header.js",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/Header.js",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hamburger} ${menuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hamburgerOpen : ''} ${showWhiteHeader ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hamburgerWhiteHeader : ''}`,
                onClick: ()=>setMenuOpen(!menuOpen),
                "aria-label": "メニュー",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {}, void 0, false, {
                        fileName: "[project]/components/layout/Header.js",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {}, void 0, false, {
                        fileName: "[project]/components/layout/Header.js",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {}, void 0, false, {
                        fileName: "[project]/components/layout/Header.js",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Header.js",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mobileOverlay} ${menuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mobileOverlayVisible : ''}`,
                onClick: ()=>setMenuOpen(false)
            }, void 0, false, {
                fileName: "[project]/components/layout/Header.js",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mobileNav} ${menuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mobileNavOpen : ''}`,
                children: [
                    NAV_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mobileNavLink,
                            onClick: ()=>setMenuOpen(false),
                            children: item.label
                        }, item.href, false, {
                            fileName: "[project]/components/layout/Header.js",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/contact",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mobileNavContact,
                        onClick: ()=>setMenuOpen(false),
                        children: "お問い合わせ"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Header.js",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Header.js",
                lineNumber: 133,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/styles/Footer.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "copyright": "Footer-module__bU2TmW__copyright",
  "footer": "Footer-module__bU2TmW__footer",
  "footerAddress": "Footer-module__bU2TmW__footerAddress",
  "footerBottom": "Footer-module__bU2TmW__footerBottom",
  "footerBusiness": "Footer-module__bU2TmW__footerBusiness",
  "footerBusinessGrid": "Footer-module__bU2TmW__footerBusinessGrid",
  "footerBusinessLink": "Footer-module__bU2TmW__footerBusinessLink",
  "footerInfo": "Footer-module__bU2TmW__footerInfo",
  "footerInner": "Footer-module__bU2TmW__footerInner",
  "footerLink": "Footer-module__bU2TmW__footerLink",
  "footerLinkSeparator": "Footer-module__bU2TmW__footerLinkSeparator",
  "footerLinks": "Footer-module__bU2TmW__footerLinks",
  "footerLogo": "Footer-module__bU2TmW__footerLogo",
  "footerName": "Footer-module__bU2TmW__footerName",
  "footerPartnerItem": "Footer-module__bU2TmW__footerPartnerItem",
  "footerPartners": "Footer-module__bU2TmW__footerPartners",
  "footerPartnersGrid": "Footer-module__bU2TmW__footerPartnersGrid",
  "footerRight": "Footer-module__bU2TmW__footerRight",
  "footerSectionTitle": "Footer-module__bU2TmW__footerSectionTitle",
  "footerSubName": "Footer-module__bU2TmW__footerSubName",
  "footerTop": "Footer-module__bU2TmW__footerTop",
});
}),
"[project]/components/layout/Footer.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/Footer.module.css [ssr] (css module)");
;
;
;
;
;
const FOOTER_LINKS = [
    {
        label: '選ばれる理由',
        href: '/reason'
    },
    {
        label: 'コース・料金',
        href: '/course'
    },
    {
        label: '施設紹介',
        href: '/facility'
    },
    {
        label: '指導者紹介',
        href: '/coaches'
    },
    {
        label: 'お知らせ',
        href: '/news'
    },
    {
        label: 'コラム',
        href: '/column'
    },
    {
        label: 'アクセス',
        href: '/about'
    },
    {
        label: 'お問い合わせ',
        href: '/contact'
    }
];
function Footer() {
    const [partners, setPartners] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const api = ("TURBOPACK compile-time value", "http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1") || 'http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1';
        fetch(`${api}/partners`).then((r)=>r.json()).then((d)=>setPartners(d.partners || [])).catch(()=>{});
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerInner,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerTop,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerInfo,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerLogo,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/logo_before.png",
                                        alt: "SSBA",
                                        width: 120,
                                        height: 43
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Footer.js",
                                        lineNumber: 35,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Footer.js",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerName,
                                    children: "SSBA野球塾"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Footer.js",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerSubName,
                                    children: "Shootingstar baseball academy"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Footer.js",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("address", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerAddress,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "福岡県久留米市安武町安武本2930-6"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/Footer.js",
                                            lineNumber: 45,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                "TEL：",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                    href: "tel:09013627517",
                                                    children: "090-1362-7517"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/Footer.js",
                                                    lineNumber: 46,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/Footer.js",
                                            lineNumber: 46,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                "Mail：",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                    href: "mailto:ssba1223dn@gmail.com",
                                                    children: "ssba1223dn@gmail.com"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/Footer.js",
                                                    lineNumber: 47,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/layout/Footer.js",
                                            lineNumber: 47,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/Footer.js",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerLinks,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/privacy",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerLink,
                                            children: "プライバシーポリシー"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/Footer.js",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerLinkSeparator,
                                            children: "|"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/Footer.js",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/admin/availability",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerLink,
                                            children: "管理画面"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/Footer.js",
                                            lineNumber: 52,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/Footer.js",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/Footer.js",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerRight,
                            children: [
                                partners.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerPartners,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerSectionTitle,
                                            children: "関連団体"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/Footer.js",
                                            lineNumber: 61,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerPartnersGrid,
                                            children: partners.slice(0, 4).map((partner)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                    href: partner.href || '#',
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerPartnerItem,
                                                    target: partner.href && partner.href !== '#' ? '_blank' : undefined,
                                                    rel: partner.href && partner.href !== '#' ? 'noopener noreferrer' : undefined,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                        src: partner.src,
                                                        alt: partner.alt,
                                                        onError: (e)=>{
                                                            e.target.style.display = 'none';
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/Footer.js",
                                                        lineNumber: 71,
                                                        columnNumber: 23
                                                    }, this)
                                                }, partner.id, false, {
                                                    fileName: "[project]/components/layout/Footer.js",
                                                    lineNumber: 64,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/Footer.js",
                                            lineNumber: 62,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/Footer.js",
                                    lineNumber: 60,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerBusiness,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerBusinessGrid,
                                        children: FOOTER_LINKS.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.href,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerBusinessLink,
                                                children: link.label
                                            }, link.label, false, {
                                                fileName: "[project]/components/layout/Footer.js",
                                                lineNumber: 86,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Footer.js",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/Footer.js",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/Footer.js",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/Footer.js",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerBottom,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].copyright,
                        children: [
                            "© ",
                            new Date().getFullYear(),
                            " SSBA - Shootingstar Baseball Academy. All rights reserved."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/Footer.js",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/Footer.js",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/Footer.js",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/Footer.js",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/layout/Layout.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/Header.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Footer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/Footer.js [ssr] (ecmascript)");
;
;
;
function Layout({ children, isHome }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                isHome: isHome
            }, void 0, false, {
                fileName: "[project]/components/layout/Layout.js",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: isHome ? undefined : 'secondary-page',
                children: children
            }, void 0, false, {
                fileName: "[project]/components/layout/Layout.js",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Footer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/components/layout/Layout.js",
                lineNumber: 9,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/components/layout/AdminHeader.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminHeader
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
;
;
;
const ADMIN_MENU = [
    {
        href: '/admin/availability',
        label: '空き状況管理'
    },
    {
        href: '/admin/contents',
        label: 'コンテンツ管理'
    },
    {
        href: '/admin/partners',
        label: '関連団体管理'
    },
    {
        href: '/',
        label: 'サイトを表示'
    }
];
function AdminHeader() {
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                style: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    background: 'var(--color-black, #1a1a1a)',
                    color: '#fff',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 14,
                            fontWeight: 700,
                            letterSpacing: 1
                        },
                        children: "SSBA 管理"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/AdminHeader.js",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMenuOpen(!menuOpen),
                        "aria-label": "管理メニュー",
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    display: 'block',
                                    width: 22,
                                    height: 2,
                                    background: '#fff',
                                    transition: 'transform 0.3s, opacity 0.3s',
                                    transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/layout/AdminHeader.js",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    display: 'block',
                                    width: 22,
                                    height: 2,
                                    background: '#fff',
                                    transition: 'opacity 0.3s',
                                    opacity: menuOpen ? 0 : 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/layout/AdminHeader.js",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    display: 'block',
                                    width: 22,
                                    height: 2,
                                    background: '#fff',
                                    transition: 'transform 0.3s, opacity 0.3s',
                                    transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/layout/AdminHeader.js",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/AdminHeader.js",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/AdminHeader.js",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                onClick: ()=>setMenuOpen(false),
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    zIndex: 200
                }
            }, void 0, false, {
                fileName: "[project]/components/layout/AdminHeader.js",
                lineNumber: 38,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                style: {
                    position: 'fixed',
                    top: 0,
                    right: menuOpen ? 0 : -280,
                    width: 280,
                    height: '100vh',
                    background: '#fff',
                    zIndex: 300,
                    padding: '60px 24px 24px',
                    transition: 'right 0.3s ease',
                    boxShadow: menuOpen ? '-4px 0 12px rgba(0,0,0,0.1)' : 'none'
                },
                children: ADMIN_MENU.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        onClick: ()=>setMenuOpen(false),
                        style: {
                            display: 'block',
                            padding: '14px 0',
                            fontSize: 15,
                            fontWeight: 500,
                            color: 'var(--color-black, #1a1a1a)',
                            borderBottom: '1px solid #f0f0f0'
                        },
                        children: item.label
                    }, item.href, false, {
                        fileName: "[project]/components/layout/AdminHeader.js",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/layout/AdminHeader.js",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/components/home/SphereBg.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>SphereBg
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__ = __turbopack_context__.i("[externals]/three [external] (three, esm_import, [project]/node_modules/three)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const SPHERE_IMAGES = [
    '/images/IMG_9358.webp',
    '/images/IMG_9361.webp',
    '/images/makihara_nagare.webp',
    '/images/kawasaki_nagare.webp',
    '/images/honda_nagare.webp',
    '/images/nagare/nagare01.avif',
    '/images/nagare/nagare03.avif',
    '/images/nagare/nagare04.avif',
    '/images/nagare/nagare05.avif',
    '/images/nagare/nagare06.avif',
    '/images/facility.avif'
];
// フィボナッチ球体アルゴリズム
function fibonacciSphere(count) {
    const points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for(let i = 0; i < count; i++){
        const y = 1 - i / (count - 1) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        points.push({
            x: Math.cos(theta) * radius,
            y: y,
            z: Math.sin(theta) * radius
        });
    }
    return points;
}
// ジオメトリを全カードで共有（saichu.jpと同じ手法）
const sharedGeometry = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["PlaneGeometry"](0.8, 0.57);
const sharedPoints = fibonacciSphere(36);
function SphereBg() {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const container = containerRef.current;
        if (!container) return;
        // WebGLサポートチェック
        let renderer;
        try {
            renderer = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["WebGLRenderer"]({
                antialias: true,
                alpha: true
            });
        } catch (e) {
            console.warn('WebGL initialization failed:', e);
            return;
        }
        if (!renderer.getContext()) {
            console.warn('WebGL context not available');
            renderer.dispose();
            return;
        }
        const scene = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["Scene"]();
        const camera = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["PerspectiveCamera"](45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 6;
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const canvas = renderer.domElement;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);
        let scrollProgress = 0;
        const handleScroll = ()=>{
            const vh = window.innerHeight;
            scrollProgress = Math.min(1, Math.max(0, (window.scrollY - vh * 0.5) / (vh * 0.5)));
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        const sphereGroup = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["Group"]();
        scene.add(sphereGroup);
        const loader = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["TextureLoader"]();
        const sphereRadius = 2.2;
        const materials = [];
        const meshes = [];
        // アニメーションループで再利用するベクトル（GC削減）
        const worldUp = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["Vector3"](0, 1, 0);
        const localUp = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["Vector3"](0, 1, 0);
        const tempQuat = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["Quaternion"]();
        const tempVec = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["Vector3"]();
        sharedPoints.forEach((point, i)=>{
            const imgSrc = SPHERE_IMAGES[i % SPHERE_IMAGES.length];
            const material = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["MeshBasicMaterial"]({
                side: __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["DoubleSide"],
                transparent: true,
                opacity: 0,
                visible: false
            });
            materials.push(material);
            if (imgSrc) {
                loader.load(imgSrc, (texture)=>{
                    texture.colorSpace = __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["SRGBColorSpace"];
                    material.map = texture;
                    material.visible = true;
                    material.needsUpdate = true;
                }, undefined, ()=>{});
            }
            // ジオメトリを共有して生成コストを削減
            const mesh = new __TURBOPACK__imported__module__$5b$externals$5d2f$three__$5b$external$5d$__$28$three$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$three$29$__["Mesh"](sharedGeometry, material);
            mesh.position.set(point.x * sphereRadius, point.y * sphereRadius, point.z * sphereRadius);
            mesh.lookAt(0, 0, 0);
            mesh.rotateY(Math.PI);
            meshes.push(mesh);
            sphereGroup.add(mesh);
        });
        const introDuration = 2.5;
        const fastSpeed = 8.0;
        const normalSpeed = 0.15;
        let animationId;
        let startTime = performance.now();
        let rotationY = 0;
        let prevElapsed = 0;
        const animate = ()=>{
            animationId = requestAnimationFrame(animate);
            const elapsed = (performance.now() - startTime) / 1000;
            const delta = elapsed - prevElapsed;
            prevElapsed = elapsed;
            const introProgress = Math.min(elapsed / introDuration, 1);
            const eased = 1 - Math.pow(1 - introProgress, 3);
            const baseOpacity = eased * 0.85;
            const currentSpeed = fastSpeed + (normalSpeed - fastSpeed) * eased;
            rotationY += currentSpeed * delta;
            sphereGroup.rotation.y = rotationY;
            sphereGroup.rotation.x = Math.sin(elapsed * 0.08) * 0.1 + 0.2;
            const fadeIn = scrollProgress;
            for(let i = 0; i < meshes.length; i++){
                if (!materials[i].visible) continue;
                meshes[i].getWorldQuaternion(tempQuat);
                tempVec.copy(localUp).applyQuaternion(tempQuat);
                const tiltAngle = Math.acos(Math.min(1, Math.abs(tempVec.dot(worldUp))));
                const tiltDeg = tiltAngle * (180 / Math.PI);
                if (tiltDeg > 60) {
                    materials[i].opacity = 0;
                } else {
                    materials[i].opacity = baseOpacity * fadeIn;
                }
            }
            renderer.render(scene, camera);
        };
        canvas.addEventListener('webglcontextlost', (e)=>{
            e.preventDefault();
            cancelAnimationFrame(animationId);
        });
        canvas.addEventListener('webglcontextrestored', ()=>{
            startTime = performance.now();
            prevElapsed = 0;
            animate();
        });
        animate();
        const handleResize = ()=>{
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);
        return ()=>{
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            scene.traverse((obj)=>{
                if (obj.geometry && obj.geometry !== sharedGeometry) obj.geometry.dispose();
                if (obj.material) {
                    if (obj.material.map) obj.material.map.dispose();
                    obj.material.dispose();
                }
            });
            if (container.contains(canvas)) {
                container.removeChild(canvas);
            }
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        ref: containerRef,
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 0,
            backgroundImage: 'url(/images/p2_bg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.55)',
                pointerEvents: 'none',
                zIndex: 1
            }
        }, void 0, false, {
            fileName: "[project]/components/home/SphereBg.js",
            lineNumber: 254,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/SphereBg.js",
        lineNumber: 240,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/_app.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/Layout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$AdminHeader$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/AdminHeader.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$SphereBg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/SphereBg.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$SphereBg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$SphereBg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
// SSR時はレンダリングをスキップ、クライアント側で即座にマウント
function ClientOnly({ children }) {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>setMounted(true), []);
    return mounted ? children : null;
}
function App({ Component, pageProps }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isAdmin = router.pathname.startsWith('/admin');
    const isHome = router.pathname === '/';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "SSBA - Shootingstar Baseball Academy｜プロ野球選手の自主トレパートナーが指導する野球アカデミー。少人数制で小学生・中学生を対象としたクラスを開講中。"
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "icon",
                        href: "/favicon.ico"
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.googleapis.com"
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.gstatic.com",
                        crossOrigin: "anonymous"
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap",
                        rel: "stylesheet"
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "SSBA - Shootingstar Baseball Academy"
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/_app.js",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            isAdmin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$AdminHeader$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                        ...pageProps
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 35,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                children: [
                    isHome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ClientOnly, {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$SphereBg$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/_app.js",
                            lineNumber: 39,
                            columnNumber: 34
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 39,
                        columnNumber: 22
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        isHome: isHome,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                            ...pageProps
                        }, void 0, false, {
                            fileName: "[project]/pages/_app.js",
                            lineNumber: 41,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/_app.js",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__74990f85._.js.map