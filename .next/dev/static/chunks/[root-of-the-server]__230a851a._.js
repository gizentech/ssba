(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/components/common/SeoHead.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SeoHead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
;
;
const SITE_NAME = 'SSBA 久留米 - Shootingstar Baseball Academy';
const BASE_URL = 'https://www.ssba1223.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/eye-catch-log.png`;
function SeoHead({ title, description, keywords, canonical, ogImage = DEFAULT_OG_IMAGE, jsonLd }) {
    const fullTitle = title ? `${title} | SSBA 久留米` : SITE_NAME;
    const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                children: fullTitle
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                name: "description",
                content: description
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 25,
                columnNumber: 23
            }, this),
            keywords && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                name: "keywords",
                content: keywords
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 26,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                rel: "canonical",
                href: url
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                property: "og:type",
                content: "website"
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                property: "og:site_name",
                content: SITE_NAME
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                property: "og:title",
                content: fullTitle
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                property: "og:description",
                content: description
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 33,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                property: "og:url",
                content: url
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                property: "og:image",
                content: ogImage
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                property: "og:locale",
                content: "ja_JP"
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                name: "twitter:card",
                content: "summary_large_image"
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                name: "twitter:title",
                content: fullTitle
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                name: "twitter:description",
                content: description
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 41,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                name: "twitter:image",
                content: ogImage
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            jsonLd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(jsonLd)
                }
            }, void 0, false, {
                fileName: "[project]/components/common/SeoHead.js",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/common/SeoHead.js",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = SeoHead;
var _c;
__turbopack_context__.k.register(_c, "SeoHead");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/styles/HeroSection.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "availabilityPc": "HeroSection-module__fSZHDq__availabilityPc",
  "availabilitySp": "HeroSection-module__fSZHDq__availabilitySp",
  "availabilitySpWrapper": "HeroSection-module__fSZHDq__availabilitySpWrapper",
  "bottomLink": "HeroSection-module__fSZHDq__bottomLink",
  "bottomLinkContact": "HeroSection-module__fSZHDq__bottomLinkContact",
  "bottomLinkDivider": "HeroSection-module__fSZHDq__bottomLinkDivider",
  "bottomLinkInsta": "HeroSection-module__fSZHDq__bottomLinkInsta",
  "bottomLinkLine": "HeroSection-module__fSZHDq__bottomLinkLine",
  "bottomLinks": "HeroSection-module__fSZHDq__bottomLinks",
  "fadeIn": "HeroSection-module__fSZHDq__fadeIn",
  "fadeOut": "HeroSection-module__fSZHDq__fadeOut",
  "fixedBg": "HeroSection-module__fSZHDq__fixedBg",
  "hero": "HeroSection-module__fSZHDq__hero",
  "heroImage": "HeroSection-module__fSZHDq__heroImage",
  "heroOverlay": "HeroSection-module__fSZHDq__heroOverlay",
  "heroTitle": "HeroSection-module__fSZHDq__heroTitle",
  "heroTitleImage": "HeroSection-module__fSZHDq__heroTitleImage",
  "newsDate": "HeroSection-module__fSZHDq__newsDate",
  "newsLabel": "HeroSection-module__fSZHDq__newsLabel",
  "newsTag": "HeroSection-module__fSZHDq__newsTag",
  "newsText": "HeroSection-module__fSZHDq__newsText",
  "newsTicker": "HeroSection-module__fSZHDq__newsTicker",
  "page2": "HeroSection-module__fSZHDq__page2",
  "page2Body": "HeroSection-module__fSZHDq__page2Body",
  "page2Btn": "HeroSection-module__fSZHDq__page2Btn",
  "page2BtnArrow": "HeroSection-module__fSZHDq__page2BtnArrow",
  "page2BtnWrap": "HeroSection-module__fSZHDq__page2BtnWrap",
  "page2Content": "HeroSection-module__fSZHDq__page2Content",
  "page2Image": "HeroSection-module__fSZHDq__page2Image",
  "page2ImageFade": "HeroSection-module__fSZHDq__page2ImageFade",
  "page2ImageFadeItem": "HeroSection-module__fSZHDq__page2ImageFadeItem",
  "page2ImageWrap": "HeroSection-module__fSZHDq__page2ImageWrap",
  "page2ImageWrapLeft": "HeroSection-module__fSZHDq__page2ImageWrapLeft",
  "page2ImageWrapRight": "HeroSection-module__fSZHDq__page2ImageWrapRight",
  "page2ImageWrapVisible": "HeroSection-module__fSZHDq__page2ImageWrapVisible",
  "page2Inner": "HeroSection-module__fSZHDq__page2Inner",
  "page2Title": "HeroSection-module__fSZHDq__page2Title",
  "spAvailBelow": "HeroSection-module__fSZHDq__spAvailBelow",
  "spAvailInHero": "HeroSection-module__fSZHDq__spAvailInHero",
  "spAvailSection": "HeroSection-module__fSZHDq__spAvailSection",
  "spLogoAfter": "HeroSection-module__fSZHDq__spLogoAfter",
});
}),
"[project]/styles/AcademyAvailability.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "classCell": "AcademyAvailability-module__dGmEAG__classCell",
  "className": "AcademyAvailability-module__dGmEAG__className",
  "cornerCell": "AcademyAvailability-module__dGmEAG__cornerCell",
  "dayHeader": "AcademyAvailability-module__dGmEAG__dayHeader",
  "statusCell": "AcademyAvailability-module__dGmEAG__statusCell",
  "statusMark": "AcademyAvailability-module__dGmEAG__statusMark",
  "table": "AcademyAvailability-module__dGmEAG__table",
  "title": "AcademyAvailability-module__dGmEAG__title",
  "wrapper": "AcademyAvailability-module__dGmEAG__wrapper",
});
}),
"[project]/components/home/AcademyAvailability.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AcademyAvailability
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/AcademyAvailability.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
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
const STATUS_COLORS = {
    '○': '#4ade80',
    '△': '#fbbf24',
    '×': '#fff',
    '−': 'rgba(255,255,255,0.25)'
};
function AcademyAvailability({ visible = true }) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AcademyAvailability.useEffect": ()=>{
            const api = ("TURBOPACK compile-time value", "https://ssba1223.com/wp/wp-json/ssba/v1") || 'https://ssba1223.com/wp/wp-json/ssba/v1';
            fetch(`${api}/availability`).then({
                "AcademyAvailability.useEffect": (res)=>res.json()
            }["AcademyAvailability.useEffect"]).then({
                "AcademyAvailability.useEffect": (d)=>setData(d)
            }["AcademyAvailability.useEffect"]).catch({
                "AcademyAvailability.useEffect": ()=>{}
            }["AcademyAvailability.useEffect"]);
        }
    }["AcademyAvailability.useEffect"], []);
    if (!data) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
            style: {
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                    children: "アカデミー空き状況"
                }, void 0, false, {
                    fileName: "[project]/components/home/AcademyAvailability.js",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: 12,
                        margin: 0
                    },
                    children: "読み込み中..."
                }, void 0, false, {
                    fileName: "[project]/components/home/AcademyAvailability.js",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/home/AcademyAvailability.js",
            lineNumber: 33,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
        style: {
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            pointerEvents: visible ? 'auto' : 'none'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                children: "アカデミー空き状況"
            }, void 0, false, {
                fileName: "[project]/components/home/AcademyAvailability.js",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].table,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cornerCell
                                }, void 0, false, {
                                    fileName: "[project]/components/home/AcademyAvailability.js",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                DAY_LABELS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].dayHeader,
                                        children: d.label
                                    }, d.key, false, {
                                        fileName: "[project]/components/home/AcademyAvailability.js",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/AcademyAvailability.js",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/home/AcademyAvailability.js",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: data.classes.map((cls)=>{
                            const tooltip = [
                                cls.subtitle,
                                cls.schedule
                            ].filter(Boolean).join(' / ');
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].classCell,
                                        title: tooltip || undefined,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].className,
                                            children: cls.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/AcademyAvailability.js",
                                            lineNumber: 71,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/AcademyAvailability.js",
                                        lineNumber: 70,
                                        columnNumber: 17
                                    }, this),
                                    DAY_LABELS.map((d)=>{
                                        const status = cls.days[d.key] || '−';
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusCell,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statusMark,
                                                style: {
                                                    color: STATUS_COLORS[status] || '#fff'
                                                },
                                                children: status
                                            }, void 0, false, {
                                                fileName: "[project]/components/home/AcademyAvailability.js",
                                                lineNumber: 77,
                                                columnNumber: 23
                                            }, this)
                                        }, d.key, false, {
                                            fileName: "[project]/components/home/AcademyAvailability.js",
                                            lineNumber: 76,
                                            columnNumber: 21
                                        }, this);
                                    })
                                ]
                            }, cls.id, true, {
                                fileName: "[project]/components/home/AcademyAvailability.js",
                                lineNumber: 69,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/home/AcademyAvailability.js",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/AcademyAvailability.js",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/home/AcademyAvailability.js",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(AcademyAvailability, "fQZRxy/+nAZ7NLS1X4dVhrlp8Go=");
_c = AcademyAvailability;
var _c;
__turbopack_context__.k.register(_c, "AcademyAvailability");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/home/HeroSection.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/HeroSection.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$AcademyAvailability$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/AcademyAvailability.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const PAGE2_IMAGES = [
    '/images/makihara_nagare.webp',
    '/images/kawasaki_nagare.webp'
];
function HeroSection() {
    _s();
    const [scrollY, setScrollY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [vh, setVh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [imageIndex, setImageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const page2Ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isSP, setIsSP] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // SP用: makiharaのみ表示
    const page2Images = isSP ? [
        PAGE2_IMAGES[0]
    ] : PAGE2_IMAGES;
    // Page2画像ローテーション（10秒）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroSection.useEffect": ()=>{
            const timer = setInterval({
                "HeroSection.useEffect.timer": ()=>{
                    setImageIndex({
                        "HeroSection.useEffect.timer": (prev)=>(prev + 1) % page2Images.length
                    }["HeroSection.useEffect.timer"]);
                }
            }["HeroSection.useEffect.timer"], 10000);
            return ({
                "HeroSection.useEffect": ()=>clearInterval(timer)
            })["HeroSection.useEffect"];
        }
    }["HeroSection.useEffect"], [
        page2Images.length
    ]);
    // スクロール追跡
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroSection.useEffect": ()=>{
            setVh(window.innerHeight);
            setIsSP(window.innerWidth <= 768);
            setScrollY(window.scrollY);
            setMounted(true);
            const handleScroll = {
                "HeroSection.useEffect.handleScroll": ()=>setScrollY(window.scrollY)
            }["HeroSection.useEffect.handleScroll"];
            const handleResize = {
                "HeroSection.useEffect.handleResize": ()=>{
                    setVh(window.innerHeight);
                    setIsSP(window.innerWidth <= 768);
                }
            }["HeroSection.useEffect.handleResize"];
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleResize);
            return ({
                "HeroSection.useEffect": ()=>{
                    window.removeEventListener('scroll', handleScroll);
                    window.removeEventListener('resize', handleResize);
                }
            })["HeroSection.useEffect"];
        }
    }["HeroSection.useEffect"], []);
    // ニュースティッカー・ボタン: フェード＋横スライドアウト
    const uiProgress = mounted && vh ? Math.min(1, scrollY / (vh * 0.1)) : 1;
    const uiOpacity = Math.max(0, 1 - uiProgress);
    // P2画像: マウント直後から表示
    const p2ImagesVisible = mounted;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fixedBg,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/p2_bg.webp",
                        alt: "SSBA 背景",
                        fill: true,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].heroImage
                    }, void 0, false, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].heroOverlay
                    }, void 0, false, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/HeroSection.js",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero
            }, void 0, false, {
                fileName: "[project]/components/home/HeroSection.js",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].availabilityPc,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$AcademyAvailability$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    visible: uiOpacity > 0
                }, void 0, false, {
                    fileName: "[project]/components/home/HeroSection.js",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/home/HeroSection.js",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bottomLinks,
                style: {
                    opacity: uiOpacity,
                    transform: `translateX(${-uiProgress * 100}%) translateY(0)`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/course",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bottomLink,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "1.5",
                                width: "26",
                                height: "26",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "2",
                                        y: "3",
                                        width: "20",
                                        height: "14",
                                        rx: "2"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M8 21h8M12 17v4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "コース紹介"
                            }, void 0, false, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/coaches",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bottomLink,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "1.5",
                                width: "26",
                                height: "26",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "12",
                                        cy: "8",
                                        r: "4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M4 20c0-4 3.6-7 8-7s8 3 8 7"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "指導者紹介"
                            }, void 0, false, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://line.me/R/ti/p/%40vyx4744a",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bottomLink,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "currentColor",
                                width: "28",
                                height: "28",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"
                                }, void 0, false, {
                                    fileName: "[project]/components/home/HeroSection.js",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "問い合わせ"
                            }, void 0, false, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/HeroSection.js",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].spAvailSection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].spLogoAfter,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/logo_after.png",
                            alt: "SSBA",
                            width: 200,
                            height: 60,
                            priority: true
                        }, void 0, false, {
                            fileName: "[project]/components/home/HeroSection.js",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$AcademyAvailability$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        visible: true
                    }, void 0, false, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/HeroSection.js",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2,
                ref: page2Ref,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2Content,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2ImageFade,
                                children: page2Images.map((src, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2ImageFadeItem,
                                        style: {
                                            opacity: imageIndex === i ? 1 : 0
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: src,
                                            alt: "SSBA 練習風景",
                                            width: 600,
                                            height: 400,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2Image
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/HeroSection.js",
                                            lineNumber: 137,
                                            columnNumber: 17
                                        }, this)
                                    }, src, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2ImageWrap} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2ImageWrapLeft} ${p2ImagesVisible ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2ImageWrapVisible : ''}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/images/makihara_nagare.webp",
                                    alt: "SSBA 練習風景",
                                    width: 600,
                                    height: 400,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2Image
                                }, void 0, false, {
                                    fileName: "[project]/components/home/HeroSection.js",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2Inner,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2Title,
                                        children: [
                                            "プロが認める指導力で",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 162,
                                                columnNumber: 25
                                            }, this),
                                            "次のステージへ"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2Body,
                                        children: [
                                            "私はこれまで数多くのプロ野球選手とプレーや練習をしてきました。",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 165,
                                                columnNumber: 46
                                            }, this),
                                            "その全てのプロ野球選手が共通して行っている練習が基本動作の反復練習です。",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 166,
                                                columnNumber: 51
                                            }, this),
                                            "しっかりとした基本をひたすら練習したからこそ一流のプレーができ持続できるのです。",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 167,
                                                columnNumber: 55
                                            }, this),
                                            "特に小学生、中学生時は基本動作を覚えることが必要です。",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 168,
                                                columnNumber: 42
                                            }, this),
                                            "分からないままや、間違った形を覚えてしまうとそれが癖となり故障にも繋がります。",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 169,
                                                columnNumber: 54
                                            }, this),
                                            "当塾では生徒１人１人とコミニュケーションをとりながら、",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 170,
                                                columnNumber: 42
                                            }, this),
                                            "１つ１つステップアップできるように指導させて頂きます。"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2ImageWrap} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2ImageWrapRight} ${p2ImagesVisible ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2ImageWrapVisible : ''}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/images/kawasaki_nagare.webp",
                                    alt: "SSBA 練習風景",
                                    width: 600,
                                    height: 400,
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2Image
                                }, void 0, false, {
                                    fileName: "[project]/components/home/HeroSection.js",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].spAvailBelow,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$AcademyAvailability$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            visible: true
                        }, void 0, false, {
                            fileName: "[project]/components/home/HeroSection.js",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2BtnWrap,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/about",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2Btn,
                            children: [
                                "SSBAについて",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page2BtnArrow,
                                    children: ">"
                                }, void 0, false, {
                                    fileName: "[project]/components/home/HeroSection.js",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/HeroSection.js",
                            lineNumber: 194,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/HeroSection.js",
                lineNumber: 127,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(HeroSection, "TjLD1AlFhM7CIXwSuXzXjoqqR9g=");
_c = HeroSection;
var _c;
__turbopack_context__.k.register(_c, "HeroSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/styles/ImportantNewsBanner.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "banner": "ImportantNewsBanner-module__riCNSq__banner",
  "label": "ImportantNewsBanner-module__riCNSq__label",
  "row": "ImportantNewsBanner-module__riCNSq__row",
  "title": "ImportantNewsBanner-module__riCNSq__title",
});
}),
"[project]/lib/wp-api.js [client] (ecmascript)", ((__turbopack_context__) => {
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
    "fetchPrivacyPolicy",
    ()=>fetchPrivacyPolicy,
    "fetchReason",
    ()=>fetchReason,
    "submitContact",
    ()=>submitContact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
const WP_API = ("TURBOPACK compile-time value", "https://ssba1223.com/wp/wp-json/ssba/v1") || 'https://ssba1223.com/wp/wp-json/ssba/v1';
const WP_BASE = 'https://ssba1223.com/wp/wp-json/wp/v2';
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
async function fetchPrivacyPolicy() {
    // まず投稿ID=3で直接取得を試みる
    try {
        const res = await fetch(`${WP_BASE}/pages/3`);
        if (res.ok) {
            const page = await res.json();
            return {
                title: page.title?.rendered || 'プライバシーポリシー',
                content: page.content?.rendered || ''
            };
        }
    } catch  {}
    // フォールバック：slugで検索
    try {
        const res = await fetch(`${WP_BASE}/pages?slug=privacy-policy&_fields=title,content`);
        if (res.ok) {
            const pages = await res.json();
            if (Array.isArray(pages) && pages.length > 0) {
                return {
                    title: pages[0].title?.rendered || 'プライバシーポリシー',
                    content: pages[0].content?.rendered || ''
                };
            }
        }
    } catch  {}
    // フォールバック：カスタムAPIのprivacy-policyエンドポイント
    try {
        const res = await fetch(`${WP_API}/privacy-policy`);
        if (res.ok) {
            const data = await res.json();
            return {
                title: data.title || 'プライバシーポリシー',
                content: data.content || ''
            };
        }
    } catch  {}
    return null;
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/home/ImportantNewsBanner.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ImportantNewsBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ImportantNewsBanner$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/ImportantNewsBanner.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wp$2d$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/wp-api.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function ImportantNewsBanner() {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ImportantNewsBanner.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$wp$2d$api$2e$js__$5b$client$5d$__$28$ecmascript$29$__["fetchNews"])().then({
                "ImportantNewsBanner.useEffect": (data)=>{
                    if (Array.isArray(data)) {
                        setItems(data.filter({
                            "ImportantNewsBanner.useEffect": (item)=>item.important === true
                        }["ImportantNewsBanner.useEffect"]));
                    }
                }
            }["ImportantNewsBanner.useEffect"]);
        }
    }["ImportantNewsBanner.useEffect"], []);
    if (items.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ImportantNewsBanner$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].banner,
        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                href: `/news/detail?id=${item.id}`,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ImportantNewsBanner$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].row,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ImportantNewsBanner$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].label,
                        children: "重要なお知らせ"
                    }, void 0, false, {
                        fileName: "[project]/components/home/ImportantNewsBanner.js",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ImportantNewsBanner$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/components/home/ImportantNewsBanner.js",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this)
                ]
            }, item.id, true, {
                fileName: "[project]/components/home/ImportantNewsBanner.js",
                lineNumber: 22,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/home/ImportantNewsBanner.js",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_s(ImportantNewsBanner, "E85yb7BhBnl3/OpymRdjFiQJ97s=");
_c = ImportantNewsBanner;
var _c;
__turbopack_context__.k.register(_c, "ImportantNewsBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/styles/SectionTitle.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "bar": "SectionTitle-module__WiZZFa__bar",
  "english": "SectionTitle-module__WiZZFa__english",
  "title": "SectionTitle-module__WiZZFa__title",
  "wrapper": "SectionTitle-module__WiZZFa__wrapper",
});
}),
"[project]/components/common/SectionTitle.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SectionTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SectionTitle$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/SectionTitle.module.css [client] (css module)");
;
;
function SectionTitle({ english, title }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SectionTitle$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].wrapper,
        children: [
            english && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SectionTitle$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].english,
                children: english
            }, void 0, false, {
                fileName: "[project]/components/common/SectionTitle.js",
                lineNumber: 6,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SectionTitle$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bar
            }, void 0, false, {
                fileName: "[project]/components/common/SectionTitle.js",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$SectionTitle$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                children: title
            }, void 0, false, {
                fileName: "[project]/components/common/SectionTitle.js",
                lineNumber: 8,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/common/SectionTitle.js",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = SectionTitle;
var _c;
__turbopack_context__.k.register(_c, "SectionTitle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/styles/ProSupport.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "content": "ProSupport-module__bY1w1G__content",
  "currentLabel": "ProSupport-module__bY1w1G__currentLabel",
  "ggBadge": "ProSupport-module__bY1w1G__ggBadge",
  "ggImage": "ProSupport-module__bY1w1G__ggImage",
  "inner": "ProSupport-module__bY1w1G__inner",
  "mainImage": "ProSupport-module__bY1w1G__mainImage",
  "mainImageWrapper": "ProSupport-module__bY1w1G__mainImageWrapper",
  "mainPlayerInfo": "ProSupport-module__bY1w1G__mainPlayerInfo",
  "mainPlayerLink": "ProSupport-module__bY1w1G__mainPlayerLink",
  "mainPlayerName": "ProSupport-module__bY1w1G__mainPlayerName",
  "mainPlayerTeam": "ProSupport-module__bY1w1G__mainPlayerTeam",
  "pastArea": "ProSupport-module__bY1w1G__pastArea",
  "pastCard": "ProSupport-module__bY1w1G__pastCard",
  "pastImage": "ProSupport-module__bY1w1G__pastImage",
  "pastImageWrapper": "ProSupport-module__bY1w1G__pastImageWrapper",
  "pastName": "ProSupport-module__bY1w1G__pastName",
  "pastRow3": "ProSupport-module__bY1w1G__pastRow3",
  "pastRow4": "ProSupport-module__bY1w1G__pastRow4",
  "pastTeam": "ProSupport-module__bY1w1G__pastTeam",
  "section": "ProSupport-module__bY1w1G__section",
});
}),
"[project]/components/home/ProSupportSection.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProSupportSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/SectionTitle.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/ProSupport.module.css [client] (css module)");
;
;
;
;
;
const PAST_ROW1 = [
    {
        name: '川﨑宗則',
        team: '元メジャーリーガー',
        image: '/images/pro-player/kawasaki.webp'
    },
    {
        name: '本多雄一',
        team: 'ソフトバンク',
        image: '/images/pro-player/honda.webp'
    },
    {
        name: '野村勇',
        team: 'ソフトバンク',
        image: '/images/pro-player/nomura.webp'
    },
    {
        name: '緒方理貢',
        team: 'ソフトバンク',
        image: '/images/pro-player/ogata.webp'
    }
];
const PAST_ROW2 = [
    {
        name: '水谷瞬',
        team: '日本ハムファイターズ',
        image: '/images/pro-player/mizutani.webp'
    },
    {
        name: '亀澤恭平',
        team: '中日ドラゴンズ',
        image: '/images/pro-player/kamezawa.webp'
    },
    {
        name: '立岡宗一郎',
        team: '読売ジャイアンツ',
        image: '/images/pro-player/kameoka.webp'
    }
];
function ProSupportSection() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "pro-support",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].section,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inner,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    english: "PRO SUPPORT",
                    title: "プロ野球選手サポート実績"
                }, void 0, false, {
                    fileName: "[project]/components/home/ProSupportSection.js",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].content,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainPlayer,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/pro-player/makihara",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainPlayerLink,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainImageWrapper,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/pro-player/makihara_t.webp",
                                                alt: "牧原大成",
                                                width: 600,
                                                height: 450,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainImage
                                            }, void 0, false, {
                                                fileName: "[project]/components/home/ProSupportSection.js",
                                                lineNumber: 32,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ggBadge,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/images/pro-player/gg.webp",
                                                    alt: "2025年 三井ゴールデン・グラブ賞 / ベストナイン賞",
                                                    width: 240,
                                                    height: 120,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ggImage
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/ProSupportSection.js",
                                                    lineNumber: 40,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/home/ProSupportSection.js",
                                                lineNumber: 39,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/home/ProSupportSection.js",
                                        lineNumber: 31,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/home/ProSupportSection.js",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainPlayerInfo,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currentLabel,
                                            children: "現在担当"
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/ProSupportSection.js",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainPlayerName,
                                            children: "牧原大成"
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/ProSupportSection.js",
                                            lineNumber: 52,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainPlayerTeam,
                                            children: "（ソフトバンク）"
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/ProSupportSection.js",
                                            lineNumber: 53,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/home/ProSupportSection.js",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/ProSupportSection.js",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastArea,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastRow4,
                                    children: PAST_ROW1.map((player)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastCard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastImageWrapper,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: player.image,
                                                        alt: player.name,
                                                        width: 300,
                                                        height: 225,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastImage
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/home/ProSupportSection.js",
                                                        lineNumber: 63,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/ProSupportSection.js",
                                                    lineNumber: 62,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastName,
                                                    children: [
                                                        player.name,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastTeam,
                                                            children: [
                                                                "（",
                                                                player.team,
                                                                "）"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/home/ProSupportSection.js",
                                                            lineNumber: 72,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/home/ProSupportSection.js",
                                                    lineNumber: 71,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, player.name, true, {
                                            fileName: "[project]/components/home/ProSupportSection.js",
                                            lineNumber: 61,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/home/ProSupportSection.js",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastRow3,
                                    children: PAST_ROW2.map((player)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastCard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastImageWrapper,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: player.image,
                                                        alt: player.name,
                                                        width: 300,
                                                        height: 225,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastImage
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/home/ProSupportSection.js",
                                                        lineNumber: 81,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/ProSupportSection.js",
                                                    lineNumber: 80,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastName,
                                                    children: [
                                                        player.name,
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ProSupport$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pastTeam,
                                                            children: [
                                                                "（",
                                                                player.team,
                                                                "）"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/home/ProSupportSection.js",
                                                            lineNumber: 90,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/home/ProSupportSection.js",
                                                    lineNumber: 89,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, player.name, true, {
                                            fileName: "[project]/components/home/ProSupportSection.js",
                                            lineNumber: 79,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/home/ProSupportSection.js",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/ProSupportSection.js",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/ProSupportSection.js",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/home/ProSupportSection.js",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/ProSupportSection.js",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = ProSupportSection;
var _c;
__turbopack_context__.k.register(_c, "ProSupportSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/styles/OfficialMedia.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "bento": "OfficialMedia-module__2bYXva__bento",
  "bentoLarge": "OfficialMedia-module__2bYXva__bentoLarge",
  "bentoSmall": "OfficialMedia-module__2bYXva__bentoSmall",
  "bentoSmallColumn": "OfficialMedia-module__2bYXva__bentoSmallColumn",
  "inner": "OfficialMedia-module__2bYXva__inner",
  "instaCard": "OfficialMedia-module__2bYXva__instaCard",
  "instaComingSoon": "OfficialMedia-module__2bYXva__instaComingSoon",
  "instaGrid": "OfficialMedia-module__2bYXva__instaGrid",
  "mediaColumn": "OfficialMedia-module__2bYXva__mediaColumn",
  "mediaGrid": "OfficialMedia-module__2bYXva__mediaGrid",
  "moreLink": "OfficialMedia-module__2bYXva__moreLink",
  "platformHeader": "OfficialMedia-module__2bYXva__platformHeader",
  "platformTitle": "OfficialMedia-module__2bYXva__platformTitle",
  "popupBox": "OfficialMedia-module__2bYXva__popupBox",
  "popupClose": "OfficialMedia-module__2bYXva__popupClose",
  "popupIframe": "OfficialMedia-module__2bYXva__popupIframe",
  "popupOverlay": "OfficialMedia-module__2bYXva__popupOverlay",
  "postOverlay": "OfficialMedia-module__2bYXva__postOverlay",
  "postThumbnail": "OfficialMedia-module__2bYXva__postThumbnail",
  "section": "OfficialMedia-module__2bYXva__section",
  "statItem": "OfficialMedia-module__2bYXva__statItem",
  "statsOverlay": "OfficialMedia-module__2bYXva__statsOverlay",
  "subtitle": "OfficialMedia-module__2bYXva__subtitle",
  "tiktokCard": "OfficialMedia-module__2bYXva__tiktokCard",
  "tiktokHandle": "OfficialMedia-module__2bYXva__tiktokHandle",
  "titleWrapper": "OfficialMedia-module__2bYXva__titleWrapper",
});
}),
"[project]/components/home/OfficialMedia.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OfficialMedia
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/SectionTitle.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/OfficialMedia.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const WP_API = ("TURBOPACK compile-time value", "https://ssba1223.com/wp/wp-json/ssba/v1");
const INSTAGRAM_POSTS = [
    {
        id: 1,
        embedUrl: 'https://www.instagram.com/nagare007ssba/',
        thumbnail: '/images/kawasaki_nagare.webp',
        caption: 'トレーニング風景'
    },
    {
        id: 2,
        embedUrl: 'https://www.instagram.com/nagare007ssba/',
        thumbnail: '/images/makihara_nagare.webp',
        caption: '選手サポート'
    },
    {
        id: 3,
        embedUrl: 'https://www.instagram.com/nagare007ssba/',
        thumbnail: '/images/honda_nagare.webp',
        caption: 'アカデミー活動'
    },
    {
        id: 4,
        embedUrl: 'https://www.instagram.com/nagare007ssba/',
        thumbnail: '/images/honda_nagare.webp',
        caption: '練習風景'
    }
];
function formatCount(n) {
    if (!n) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
}
/* ── ポップアップモーダル ── */ function TikTokPopup({ video, onClose }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TikTokPopup.useEffect": ()=>{
            const handler = {
                "TikTokPopup.useEffect.handler": (e)=>{
                    if (e.key === 'Escape') onClose();
                }
            }["TikTokPopup.useEffect.handler"];
            document.addEventListener('keydown', handler);
            document.body.style.overflow = 'hidden';
            return ({
                "TikTokPopup.useEffect": ()=>{
                    document.removeEventListener('keydown', handler);
                    document.body.style.overflow = '';
                }
            })["TikTokPopup.useEffect"];
        }
    }["TikTokPopup.useEffect"], [
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].popupOverlay,
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].popupBox,
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].popupClose,
                    onClick: onClose,
                    "aria-label": "閉じる",
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 36,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    src: `https://www.tiktok.com/embed/v2/${video.id}`,
                    width: "325",
                    height: "740",
                    allow: "autoplay; encrypted-media",
                    allowFullScreen: true,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].popupIframe
                }, void 0, false, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/home/OfficialMedia.js",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/OfficialMedia.js",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(TikTokPopup, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = TikTokPopup;
/* ── 1枚のTikTokカード ── */ function TikTokCard({ video, large, onPlay }) {
    const cls = large ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoLarge : __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoSmall;
    const size = large ? 40 : 24;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${cls} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tiktokCard}`,
        onClick: ()=>onPlay(video),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postThumbnail,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: video.cover_image_url,
                    alt: video.title || 'TikTok動画'
                }, void 0, false, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postOverlay,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 24 24",
                        fill: "currentColor",
                        width: size,
                        height: size,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M8 5v14l11-7z"
                        }, void 0, false, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 62,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/home/OfficialMedia.js",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statsOverlay,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statItem,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    viewBox: "0 0 24 24",
                                    fill: "currentColor",
                                    width: "13",
                                    height: "13",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/OfficialMedia.js",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                formatCount(video.like_count)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statItem,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    viewBox: "0 0 24 24",
                                    fill: "currentColor",
                                    width: "13",
                                    height: "13",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M8 5v14l11-7z"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/OfficialMedia.js",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this),
                                formatCount(video.view_count)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/home/OfficialMedia.js",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/OfficialMedia.js",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c1 = TikTokCard;
/* ── TikTokセクション ── */ function TikTokSection() {
    _s1();
    const [videos, setVideos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [playing, setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TikTokSection.useEffect": ()=>{
            fetch(`${WP_API}/tiktok-videos`).then({
                "TikTokSection.useEffect": (r)=>r.json()
            }["TikTokSection.useEffect"]).then({
                "TikTokSection.useEffect": (data)=>setVideos((data.videos ?? []).slice(0, 3))
            }["TikTokSection.useEffect"]).catch({
                "TikTokSection.useEffect": ()=>setVideos([])
            }["TikTokSection.useEffect"]);
        }
    }["TikTokSection.useEffect"], []);
    const loading = videos === null;
    const empty = !loading && videos.length === 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mediaColumn,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].platformHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].platformTitle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "currentColor",
                                width: "24",
                                height: "24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.28z"
                                }, void 0, false, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/home/OfficialMedia.js",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            "TikTok",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://www.tiktok.com/@7nagare_starbaseball",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tiktokHandle,
                                children: "@7nagare_starbaseball"
                            }, void 0, false, {
                                fileName: "[project]/components/home/OfficialMedia.js",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/OfficialMedia.js",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://www.tiktok.com/@7nagare_starbaseball",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLink,
                        children: [
                            "他の動画を見る ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: ">"
                            }, void 0, false, {
                                fileName: "[project]/components/home/OfficialMedia.js",
                                lineNumber: 113,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/OfficialMedia.js",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/OfficialMedia.js",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bento} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoTiktok}`,
                children: loading || empty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoLarge,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postThumbnail,
                                style: {
                                    background: '#1a1a1a',
                                    aspectRatio: '9/16'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/home/OfficialMedia.js",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 120,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoSmallColumn,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoSmall,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postThumbnail,
                                        style: {
                                            background: '#1a1a1a'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/OfficialMedia.js",
                                        lineNumber: 124,
                                        columnNumber: 50
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 124,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoSmall,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postThumbnail,
                                        style: {
                                            background: '#1a1a1a'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/OfficialMedia.js",
                                        lineNumber: 125,
                                        columnNumber: 50
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 123,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TikTokCard, {
                            video: videos[0],
                            large: true,
                            onPlay: setPlaying
                        }, void 0, false, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 130,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoSmallColumn,
                            children: videos.slice(1).map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TikTokCard, {
                                    video: v,
                                    large: false,
                                    onPlay: setPlaying
                                }, v.id, false, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 133,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 131,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/components/home/OfficialMedia.js",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            playing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TikTokPopup, {
                video: playing,
                onClose: ()=>setPlaying(null)
            }, void 0, false, {
                fileName: "[project]/components/home/OfficialMedia.js",
                lineNumber: 140,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/home/OfficialMedia.js",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_s1(TikTokSection, "mAFuuKcfFfzyHvRWnE4WT2IyzdI=");
_c2 = TikTokSection;
function OfficialMedia() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].section,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inner,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].titleWrapper,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            english: "OFFICIAL MEDIA",
                            title: "オフィシャルメディア"
                        }, void 0, false, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                            children: "Tiktok & Media"
                        }, void 0, false, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 150,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mediaGrid,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TikTokSection, {}, void 0, false, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mediaColumn,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].platformHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].platformTitle,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    viewBox: "0 0 24 24",
                                                    fill: "currentColor",
                                                    width: "24",
                                                    height: "24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/home/OfficialMedia.js",
                                                        lineNumber: 162,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                    lineNumber: 161,
                                                    columnNumber: 17
                                                }, this),
                                                "Instagram"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 160,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://www.instagram.com/nagare007ssba/",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLink,
                                            children: [
                                                "続きの投稿を見る ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: ">"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                    lineNumber: 167,
                                                    columnNumber: 26
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 166,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].instaGrid,
                                    children: INSTAGRAM_POSTS.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: post.embedUrl,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].instaCard,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postThumbnail,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: post.thumbnail,
                                                        alt: post.caption
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/home/OfficialMedia.js",
                                                        lineNumber: 174,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].instaComingSoon,
                                                        children: "準備中"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/home/OfficialMedia.js",
                                                        lineNumber: 175,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/home/OfficialMedia.js",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, this)
                                        }, post.id, false, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 172,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 155,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/home/OfficialMedia.js",
            lineNumber: 149,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/OfficialMedia.js",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_c3 = OfficialMedia;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "TikTokPopup");
__turbopack_context__.k.register(_c1, "TikTokCard");
__turbopack_context__.k.register(_c2, "TikTokSection");
__turbopack_context__.k.register(_c3, "OfficialMedia");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/styles/ColumnSection.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "ColumnSection-module__PQUaOW__card",
  "cardBody": "ColumnSection-module__PQUaOW__cardBody",
  "cardImage": "ColumnSection-module__PQUaOW__cardImage",
  "cardMeta": "ColumnSection-module__PQUaOW__cardMeta",
  "cardTitle": "ColumnSection-module__PQUaOW__cardTitle",
  "carouselTrack": "ColumnSection-module__PQUaOW__carouselTrack",
  "dot": "ColumnSection-module__PQUaOW__dot",
  "dotActive": "ColumnSection-module__PQUaOW__dotActive",
  "dots": "ColumnSection-module__PQUaOW__dots",
  "featured": "ColumnSection-module__PQUaOW__featured",
  "featuredBody": "ColumnSection-module__PQUaOW__featuredBody",
  "featuredImage": "ColumnSection-module__PQUaOW__featuredImage",
  "featuredMeta": "ColumnSection-module__PQUaOW__featuredMeta",
  "featuredTitle": "ColumnSection-module__PQUaOW__featuredTitle",
  "header": "ColumnSection-module__PQUaOW__header",
  "headerLink": "ColumnSection-module__PQUaOW__headerLink",
  "headerLinkArrow": "ColumnSection-module__PQUaOW__headerLinkArrow",
  "inner": "ColumnSection-module__PQUaOW__inner",
  "layout": "ColumnSection-module__PQUaOW__layout",
  "metaCategory": "ColumnSection-module__PQUaOW__metaCategory",
  "metaDate": "ColumnSection-module__PQUaOW__metaDate",
  "moreLink": "ColumnSection-module__PQUaOW__moreLink",
  "moreLinkArrow": "ColumnSection-module__PQUaOW__moreLinkArrow",
  "moreLinkBtn": "ColumnSection-module__PQUaOW__moreLinkBtn",
  "section": "ColumnSection-module__PQUaOW__section",
  "sideGrid": "ColumnSection-module__PQUaOW__sideGrid",
  "sideGridPc": "ColumnSection-module__PQUaOW__sideGridPc",
});
}),
"[project]/components/home/ColumnSection.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ColumnSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/SectionTitle.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/ColumnSection.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function CardItem({ col }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/column/detail?id=${col.id}`,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardImage,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: col.image || col.thumbnail || '/images/eye-catch.webp',
                    alt: col.title
                }, void 0, false, {
                    fileName: "[project]/components/home/ColumnSection.js",
                    lineNumber: 12,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/home/ColumnSection.js",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardBody,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardTitle,
                        children: col.title
                    }, void 0, false, {
                        fileName: "[project]/components/home/ColumnSection.js",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardMeta,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].metaDate,
                                children: col.date
                            }, void 0, false, {
                                fileName: "[project]/components/home/ColumnSection.js",
                                lineNumber: 17,
                                columnNumber: 11
                            }, this),
                            (col.tag || col.category) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].metaCategory,
                                children: col.tag || col.category
                            }, void 0, false, {
                                fileName: "[project]/components/home/ColumnSection.js",
                                lineNumber: 19,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/ColumnSection.js",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/ColumnSection.js",
                lineNumber: 14,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/home/ColumnSection.js",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = CardItem;
function MobileCarousel({ articles }) {
    _s();
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const touchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const total = articles.length;
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MobileCarousel.useCallback[handleTouchStart]": (e)=>{
            touchStart.current = e.touches[0].clientX;
        }
    }["MobileCarousel.useCallback[handleTouchStart]"], []);
    const handleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MobileCarousel.useCallback[handleTouchEnd]": (e)=>{
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) < 40) return;
            if (diff > 0) {
                setCurrent({
                    "MobileCarousel.useCallback[handleTouchEnd]": (prev)=>(prev + 1) % total
                }["MobileCarousel.useCallback[handleTouchEnd]"]);
            } else {
                setCurrent({
                    "MobileCarousel.useCallback[handleTouchEnd]": (prev)=>(prev - 1 + total) % total
                }["MobileCarousel.useCallback[handleTouchEnd]"]);
            }
        }
    }["MobileCarousel.useCallback[handleTouchEnd]"], [
        total
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sideGrid,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].carouselTrack,
                style: {
                    transform: `translateX(-${current * 100}%)`
                },
                onTouchStart: handleTouchStart,
                onTouchEnd: handleTouchEnd,
                children: articles.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardItem, {
                        col: col
                    }, col.id, false, {
                        fileName: "[project]/components/home/ColumnSection.js",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/home/ColumnSection.js",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].dots,
                children: articles.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].dot} ${i === current ? __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].dotActive : ''}`,
                        onClick: ()=>setCurrent(i),
                        "aria-label": `記事 ${i + 1}`
                    }, i, false, {
                        fileName: "[project]/components/home/ColumnSection.js",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/home/ColumnSection.js",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/home/ColumnSection.js",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(MobileCarousel, "6diWChZhIEhYuhMO9rIM7/cm6Uk=");
_c1 = MobileCarousel;
function ColumnSection() {
    _s1();
    const [columns, setColumns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ColumnSection.useEffect": ()=>{
            const api = ("TURBOPACK compile-time value", "https://ssba1223.com/wp/wp-json/ssba/v1") || 'https://ssba1223.com/wp/wp-json/ssba/v1';
            fetch(`${api}/columns?per_page=5`).then({
                "ColumnSection.useEffect": (r)=>r.json()
            }["ColumnSection.useEffect"]).then({
                "ColumnSection.useEffect": (data)=>{
                    if (Array.isArray(data) && data.length > 0) setColumns(data);
                }
            }["ColumnSection.useEffect"]).catch({
                "ColumnSection.useEffect": ()=>{}
            }["ColumnSection.useEffect"]);
        }
    }["ColumnSection.useEffect"], []);
    if (columns.length === 0) return null;
    const featured = columns[0];
    const sideArticles = columns.slice(1, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].section,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inner,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            english: "COLUMN",
                            title: "コラム"
                        }, void 0, false, {
                            fileName: "[project]/components/home/ColumnSection.js",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/column",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerLink,
                            children: [
                                "全ての記事を見る",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerLinkArrow,
                                    children: ">"
                                }, void 0, false, {
                                    fileName: "[project]/components/home/ColumnSection.js",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/ColumnSection.js",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/ColumnSection.js",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].layout,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/column/detail?id=${featured.id}`,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featured,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featuredImage,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: featured.image || featured.thumbnail || '/images/eye-catch.webp',
                                        alt: featured.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/ColumnSection.js",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/home/ColumnSection.js",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featuredBody,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featuredTitle,
                                            children: featured.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/ColumnSection.js",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featuredMeta,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].metaDate,
                                                    children: featured.date
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/ColumnSection.js",
                                                    lineNumber: 109,
                                                    columnNumber: 17
                                                }, this),
                                                (featured.tag || featured.category) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].metaCategory,
                                                    children: featured.tag || featured.category
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/ColumnSection.js",
                                                    lineNumber: 111,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/home/ColumnSection.js",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/home/ColumnSection.js",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/ColumnSection.js",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sideGridPc,
                            children: sideArticles.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardItem, {
                                    col: col
                                }, col.id, false, {
                                    fileName: "[project]/components/home/ColumnSection.js",
                                    lineNumber: 120,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/home/ColumnSection.js",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/ColumnSection.js",
                    lineNumber: 101,
                    columnNumber: 9
                }, this),
                sideArticles.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileCarousel, {
                    articles: sideArticles
                }, void 0, false, {
                    fileName: "[project]/components/home/ColumnSection.js",
                    lineNumber: 126,
                    columnNumber: 37
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLink,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/column",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLinkBtn,
                        children: [
                            "全ての記事を見る",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ColumnSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLinkArrow,
                                children: ">"
                            }, void 0, false, {
                                fileName: "[project]/components/home/ColumnSection.js",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/ColumnSection.js",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/home/ColumnSection.js",
                    lineNumber: 128,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/home/ColumnSection.js",
            lineNumber: 92,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/ColumnSection.js",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s1(ColumnSection, "FGb4ECZkue8/xp6oBDaPDOM3qWY=");
_c2 = ColumnSection;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CardItem");
__turbopack_context__.k.register(_c1, "MobileCarousel");
__turbopack_context__.k.register(_c2, "ColumnSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/styles/ContentsSection.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "imageButton": "ContentsSection-module__D6gzSa__imageButton",
  "imageGrid": "ContentsSection-module__D6gzSa__imageGrid",
  "inner": "ContentsSection-module__D6gzSa__inner",
  "overlay": "ContentsSection-module__D6gzSa__overlay",
  "overlayImage": "ContentsSection-module__D6gzSa__overlayImage",
  "section": "ContentsSection-module__D6gzSa__section",
  "spin": "ContentsSection-module__D6gzSa__spin",
  "spinner": "ContentsSection-module__D6gzSa__spinner",
});
}),
"[project]/components/home/ContentsSection.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContentsSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-dom/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/SectionTitle.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ContentsSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/ContentsSection.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
function ContentsSection({ images = [] }) {
    _s();
    const [popupImage, setPopupImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleImageClick = (img)=>{
        setPopupImage(img);
        setLoading(true);
        setTimeout(()=>setLoading(false), 1000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ContentsSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].section,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ContentsSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inner,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            english: "CONTENTS",
                            title: "コンテンツ"
                        }, void 0, false, {
                            fileName: "[project]/components/home/ContentsSection.js",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ContentsSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].imageGrid,
                            children: images.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ContentsSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].imageButton,
                                    onClick: ()=>handleImageClick(img),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: img.src,
                                        alt: img.alt
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/ContentsSection.js",
                                        lineNumber: 28,
                                        columnNumber: 17
                                    }, this)
                                }, img.id || i, false, {
                                    fileName: "[project]/components/home/ContentsSection.js",
                                    lineNumber: 23,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/home/ContentsSection.js",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/ContentsSection.js",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/home/ContentsSection.js",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            popupImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ContentsSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].overlay,
                onClick: ()=>{
                    setPopupImage(null);
                    setLoading(false);
                },
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ContentsSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].spinner
                }, void 0, false, {
                    fileName: "[project]/components/home/ContentsSection.js",
                    lineNumber: 41,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: popupImage.src,
                    alt: popupImage.alt,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$ContentsSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].overlayImage,
                    onClick: (e)=>e.stopPropagation()
                }, void 0, false, {
                    fileName: "[project]/components/home/ContentsSection.js",
                    lineNumber: 43,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/home/ContentsSection.js",
                lineNumber: 36,
                columnNumber: 9
            }, this), document.body)
        ]
    }, void 0, true);
}
_s(ContentsSection, "dZe1L476rYLUXdbyZ5/vTzTabpo=");
_c = ContentsSection;
var _c;
__turbopack_context__.k.register(_c, "ContentsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/styles/CourseOverview.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "CourseOverview-module__BZFt7q__card",
  "cardMeta": "CourseOverview-module__BZFt7q__cardMeta",
  "cardNumber": "CourseOverview-module__BZFt7q__cardNumber",
  "cardPrice": "CourseOverview-module__BZFt7q__cardPrice",
  "cardPriceUnit": "CourseOverview-module__BZFt7q__cardPriceUnit",
  "cardTitle": "CourseOverview-module__BZFt7q__cardTitle",
  "grid": "CourseOverview-module__BZFt7q__grid",
  "inner": "CourseOverview-module__BZFt7q__inner",
  "moreLink": "CourseOverview-module__BZFt7q__moreLink",
  "moreLinkBtn": "CourseOverview-module__BZFt7q__moreLinkBtn",
  "section": "CourseOverview-module__BZFt7q__section",
});
}),
"[project]/components/home/CourseOverview.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CourseOverview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/SectionTitle.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/CourseOverview.module.css [client] (css module)");
;
;
;
;
const COURSES = [
    {
        number: '１',
        title: '小学生クラス',
        meta: '月〜金 / 17:15〜18:35 / 定員8名',
        price: '13,200',
        unit: '円（税込）/ 月4回'
    },
    {
        number: '２',
        title: '中学生クラス',
        meta: '月・木・金 / 18:45〜20:10 / 定員8名',
        price: '15,400',
        unit: '円（税込）/ 月4回'
    },
    {
        number: '３',
        title: '小6 ハイレベルクラス',
        meta: '水曜日 / 18:45〜20:10 / 定員10名',
        price: '15,400',
        unit: '円（税込）/ 月4回'
    },
    {
        number: '４',
        title: '中学3年生クラス',
        meta: '9月〜3月 土曜日 / 17:00〜19:00',
        price: '16,000',
        unit: '円（税込）'
    },
    {
        number: '５',
        title: 'パーソナルレッスン',
        meta: '60分 / 2名まで同額',
        price: '6,600',
        unit: '円'
    },
    {
        number: '６',
        title: 'ラプソード計測',
        meta: '球速・打球速度を計測',
        price: '',
        unit: ''
    }
];
function CourseOverview() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].section,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inner,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    english: "COURSE & PRICE",
                    title: "コース・料金"
                }, void 0, false, {
                    fileName: "[project]/components/home/CourseOverview.js",
                    lineNumber: 54,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].grid,
                    children: COURSES.map((course)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardNumber,
                                    children: course.number
                                }, void 0, false, {
                                    fileName: "[project]/components/home/CourseOverview.js",
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardTitle,
                                    children: course.title
                                }, void 0, false, {
                                    fileName: "[project]/components/home/CourseOverview.js",
                                    lineNumber: 62,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardMeta,
                                    children: course.meta
                                }, void 0, false, {
                                    fileName: "[project]/components/home/CourseOverview.js",
                                    lineNumber: 63,
                                    columnNumber: 15
                                }, this),
                                course.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardPrice,
                                    children: [
                                        course.price,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardPriceUnit,
                                            children: course.unit
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/CourseOverview.js",
                                            lineNumber: 67,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/home/CourseOverview.js",
                                    lineNumber: 65,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, course.number, true, {
                            fileName: "[project]/components/home/CourseOverview.js",
                            lineNumber: 60,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/home/CourseOverview.js",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLink,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/course",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$CourseOverview$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLinkBtn,
                        children: "コース詳細を見る"
                    }, void 0, false, {
                        fileName: "[project]/components/home/CourseOverview.js",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/home/CourseOverview.js",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/home/CourseOverview.js",
            lineNumber: 53,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/CourseOverview.js",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = CourseOverview;
var _c;
__turbopack_context__.k.register(_c, "CourseOverview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSG",
    ()=>__N_SSG,
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SeoHead$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/SeoHead.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$HeroSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/HeroSection.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ImportantNewsBanner$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/ImportantNewsBanner.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ProSupportSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/ProSupportSection.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$OfficialMedia$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/OfficialMedia.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ColumnSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/ColumnSection.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ContentsSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/ContentsSection.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$CourseOverview$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/CourseOverview.js [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
const JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: 'SSBA - Shootingstar Baseball Academy',
    alternateName: 'シューティングスター ベースボール アカデミー',
    url: 'https://www.ssba1223.com',
    telephone: '090-1362-7517',
    email: 'ssba1223dn@gmail.com',
    address: {
        '@type': 'PostalAddress',
        streetAddress: '安武町安武本2930-6',
        addressLocality: '久留米市',
        addressRegion: '福岡県',
        postalCode: '830-0072',
        addressCountry: 'JP'
    },
    description: '福岡県久留米市の野球塾。牧原大成選手などプロ野球選手の自主トレにも対応。小学生から社会人まで個人・グループレッスン提供中。',
    sport: '野球'
};
var __N_SSG = true;
function Home({ contents }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SeoHead$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                title: "プロ野球選手の自主トレ拠点・野球塾【福岡県久留米市】",
                description: "福岡県久留米市の野球塾SSBA（シューティングスターベースボールアカデミー）。流大輔代表のもと、牧原大成・本多雄一・川崎宗則などプロ野球選手の自主トレにも対応。屋内練習場完備。久留米フューチャースターズとも連携。小学生から社会人まで個人・グループレッスン提供中。",
                keywords: "SSBA,野球塾,久留米,福岡,野球アカデミー,プロ野球選手,自主トレ,牧原大成,本多雄一,川崎宗則,流大輔,個人レッスン,少年野球,野球教室,シューティングスター,久留米フューチャースターズ,Bar Greenlight,BarGreenlight,屋内練習場,室内練習場,久留米 野球",
                canonical: "/",
                jsonLd: JSON_LD
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$HeroSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ImportantNewsBanner$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ProSupportSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$OfficialMedia$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ColumnSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ContentsSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                images: contents
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__230a851a._.js.map