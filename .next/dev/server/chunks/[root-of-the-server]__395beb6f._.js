module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/lib/tiktok.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getValidAccessToken",
    ()=>getValidAccessToken,
    "writeToken",
    ()=>writeToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const TOKEN_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data', 'tiktok-token.json');
function readToken() {
    try {
        const raw = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(TOKEN_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch  {
        return null;
    }
}
function writeToken(data) {
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(TOKEN_FILE, JSON.stringify(data, null, 2));
}
async function getValidAccessToken() {
    const token = readToken();
    if (!token) return null;
    // 有効期限5分前まで既存トークンを使用
    if (token.expires_at && Date.now() < token.expires_at - 300_000) {
        return token.access_token;
    }
    // refresh_tokenでアクセストークンを更新
    if (!token.refresh_token) return null;
    const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_key: process.env.TIKTOK_CLIENT_KEY,
            client_secret: process.env.TIKTOK_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token
        })
    });
    const data = await res.json();
    if (!data.access_token) return null;
    const newToken = {
        access_token: data.access_token,
        refresh_token: data.refresh_token || token.refresh_token,
        expires_at: Date.now() + data.expires_in * 1000
    };
    writeToken(newToken);
    return newToken.access_token;
}
}),
"[project]/pages/api/tiktok/videos.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tiktok$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/tiktok.js [api] (ecmascript)");
;
async function handler(req, res) {
    // キャッシュ無効化
    res.setHeader('Cache-Control', 'no-store');
    const accessToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tiktok$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getValidAccessToken"])();
    if (!accessToken) {
        return res.status(401).json({
            error: '未認証',
            message: '/api/tiktok/auth にアクセスしてTikTokアカウントと連携してください'
        });
    }
    const videoRes = await fetch('https://open.tiktokapis.com/v2/video/list/?fields=id,title,embed_html,cover_image_url', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            max_count: 3
        })
    });
    const data = await videoRes.json();
    if (data.error?.code && data.error.code !== 'ok') {
        return res.status(500).json({
            error: data.error
        });
    }
    const videos = data.data?.videos || [];
    res.json({
        videos
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__395beb6f._.js.map