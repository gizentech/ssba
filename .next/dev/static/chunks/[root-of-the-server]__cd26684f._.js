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
"[project]/styles/HeroSection.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "availabilityPc": "HeroSection-module__fSZHDq__availabilityPc",
  "availabilitySp": "HeroSection-module__fSZHDq__availabilitySp",
  "availabilitySpWrapper": "HeroSection-module__fSZHDq__availabilitySpWrapper",
  "bottomLink": "HeroSection-module__fSZHDq__bottomLink",
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
            const api = ("TURBOPACK compile-time value", "http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1") || 'http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1';
            fetch(`${api}/availability`).then({
                "AcademyAvailability.useEffect": (res)=>res.json()
            }["AcademyAvailability.useEffect"]).then({
                "AcademyAvailability.useEffect": (d)=>setData(d)
            }["AcademyAvailability.useEffect"]).catch({
                "AcademyAvailability.useEffect": ()=>{}
            }["AcademyAvailability.useEffect"]);
        }
    }["AcademyAvailability.useEffect"], []);
    if (!data) return null;
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
                lineNumber: 42,
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
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                DAY_LABELS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$AcademyAvailability$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].dayHeader,
                                        children: d.label
                                    }, d.key, false, {
                                        fileName: "[project]/components/home/AcademyAvailability.js",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/AcademyAvailability.js",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/home/AcademyAvailability.js",
                        lineNumber: 44,
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
                                            lineNumber: 58,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/AcademyAvailability.js",
                                        lineNumber: 57,
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
                                                lineNumber: 64,
                                                columnNumber: 23
                                            }, this)
                                        }, d.key, false, {
                                            fileName: "[project]/components/home/AcademyAvailability.js",
                                            lineNumber: 63,
                                            columnNumber: 21
                                        }, this);
                                    })
                                ]
                            }, cls.id, true, {
                                fileName: "[project]/components/home/AcademyAvailability.js",
                                lineNumber: 56,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/home/AcademyAvailability.js",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/AcademyAvailability.js",
                lineNumber: 43,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/home/AcademyAvailability.js",
        lineNumber: 34,
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
                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].availabilityPc,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$AcademyAvailability$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            visible: uiOpacity > 0
                        }, void 0, false, {
                            fileName: "[project]/components/home/HeroSection.js",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 77,
                        columnNumber: 9
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
                                        width: "28",
                                        height: "28",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "2",
                                                y: "3",
                                                width: "20",
                                                height: "14",
                                                rx: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 91,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M8 21h8M12 17v4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 92,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "コース紹介"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 89,
                                columnNumber: 11
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
                                        width: "28",
                                        height: "28",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "12",
                                                cy: "8",
                                                r: "4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 98,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M4 20c0-4 3.6-7 8-7s8 3 8 7"
                                            }, void 0, false, {
                                                fileName: "[project]/components/home/HeroSection.js",
                                                lineNumber: 99,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "指導者紹介"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/contact",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$HeroSection$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bottomLink,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "1.5",
                                        width: "28",
                                        height: "28",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/HeroSection.js",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "問い合わせ"
                                    }, void 0, false, {
                                        fileName: "[project]/components/home/HeroSection.js",
                                        lineNumber: 107,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/home/HeroSection.js",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/home/HeroSection.js",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/home/HeroSection.js",
                lineNumber: 75,
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
  "instaGrid": "OfficialMedia-module__2bYXva__instaGrid",
  "mediaColumn": "OfficialMedia-module__2bYXva__mediaColumn",
  "mediaGrid": "OfficialMedia-module__2bYXva__mediaGrid",
  "moreLink": "OfficialMedia-module__2bYXva__moreLink",
  "platformHeader": "OfficialMedia-module__2bYXva__platformHeader",
  "platformTitle": "OfficialMedia-module__2bYXva__platformTitle",
  "postOverlay": "OfficialMedia-module__2bYXva__postOverlay",
  "postThumbnail": "OfficialMedia-module__2bYXva__postThumbnail",
  "section": "OfficialMedia-module__2bYXva__section",
  "subtitle": "OfficialMedia-module__2bYXva__subtitle",
  "titleWrapper": "OfficialMedia-module__2bYXva__titleWrapper",
});
}),
"[project]/components/home/OfficialMedia.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OfficialMedia
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$SectionTitle$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/SectionTitle.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/styles/OfficialMedia.module.css [client] (css module)");
;
;
;
const TIKTOK_POSTS = [
    {
        id: 1,
        embedUrl: 'https://www.tiktok.com/@ssba_baseball',
        thumbnail: '/images/makihara_nagare.webp',
        caption: 'バッティング練習'
    },
    {
        id: 2,
        embedUrl: 'https://www.tiktok.com/@ssba_baseball',
        thumbnail: '/images/makihara_nagare.webp',
        caption: 'ピッチング指導'
    },
    {
        id: 3,
        embedUrl: 'https://www.tiktok.com/@ssba_baseball',
        thumbnail: '/images/makihara_nagare.webp',
        caption: '守備練習'
    }
];
const INSTAGRAM_POSTS = [
    {
        id: 1,
        embedUrl: 'https://www.instagram.com/ssba_baseball/',
        thumbnail: '/images/kawasaki_nagare.webp',
        caption: 'トレーニング風景'
    },
    {
        id: 2,
        embedUrl: 'https://www.instagram.com/ssba_baseball/',
        thumbnail: '/images/makihara_nagare.webp',
        caption: '選手サポート'
    },
    {
        id: 3,
        embedUrl: 'https://www.instagram.com/ssba_baseball/',
        thumbnail: '/images/honda_nagare.webp',
        caption: 'アカデミー活動'
    },
    {
        id: 4,
        embedUrl: 'https://www.instagram.com/ssba_baseball/',
        thumbnail: '/images/honda_nagare.webp',
        caption: '練習風景'
    }
];
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
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                            children: "Tiktok & Media"
                        }, void 0, false, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mediaGrid,
                    children: [
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
                                                        d: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.28z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/home/OfficialMedia.js",
                                                        lineNumber: 70,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                    lineNumber: 69,
                                                    columnNumber: 17
                                                }, this),
                                                "TikTok"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://www.tiktok.com/@ssba_baseball",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLink,
                                            children: [
                                                "他の動画を見る ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: ">"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                    lineNumber: 75,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bento} ${__TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoTiktok}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: TIKTOK_POSTS[0].embedUrl,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoLarge,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postThumbnail,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: TIKTOK_POSTS[0].thumbnail,
                                                        alt: TIKTOK_POSTS[0].caption
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/home/OfficialMedia.js",
                                                        lineNumber: 81,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postOverlay,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            viewBox: "0 0 24 24",
                                                            fill: "currentColor",
                                                            width: "40",
                                                            height: "40",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M8 5v14l11-7z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/home/OfficialMedia.js",
                                                                lineNumber: 83,
                                                                columnNumber: 89
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/home/OfficialMedia.js",
                                                            lineNumber: 83,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/home/OfficialMedia.js",
                                                        lineNumber: 82,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/home/OfficialMedia.js",
                                                lineNumber: 80,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoSmallColumn,
                                            children: TIKTOK_POSTS.slice(1).map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: post.embedUrl,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bentoSmall,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postThumbnail,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: post.thumbnail,
                                                                alt: post.caption
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/home/OfficialMedia.js",
                                                                lineNumber: 91,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postOverlay,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "currentColor",
                                                                    width: "24",
                                                                    height: "24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M8 5v14l11-7z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/home/OfficialMedia.js",
                                                                        lineNumber: 93,
                                                                        columnNumber: 93
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                                    lineNumber: 93,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/home/OfficialMedia.js",
                                                                lineNumber: 92,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/home/OfficialMedia.js",
                                                        lineNumber: 90,
                                                        columnNumber: 21
                                                    }, this)
                                                }, post.id, false, {
                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                    lineNumber: 89,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 66,
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
                                                        lineNumber: 107,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                    lineNumber: 106,
                                                    columnNumber: 17
                                                }, this),
                                                "Instagram"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://www.instagram.com/ssba_baseball/",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$styles$2f$OfficialMedia$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].moreLink,
                                            children: [
                                                "続きの投稿を見る ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: ">"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                    lineNumber: 112,
                                                    columnNumber: 26
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 104,
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
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: post.thumbnail,
                                                    alt: post.caption
                                                }, void 0, false, {
                                                    fileName: "[project]/components/home/OfficialMedia.js",
                                                    lineNumber: 119,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/home/OfficialMedia.js",
                                                lineNumber: 118,
                                                columnNumber: 19
                                            }, this)
                                        }, post.id, false, {
                                            fileName: "[project]/components/home/OfficialMedia.js",
                                            lineNumber: 117,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/home/OfficialMedia.js",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/home/OfficialMedia.js",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/home/OfficialMedia.js",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/home/OfficialMedia.js",
            lineNumber: 55,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/OfficialMedia.js",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c = OfficialMedia;
var _c;
__turbopack_context__.k.register(_c, "OfficialMedia");
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
        href: `/column`,
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
            const api = ("TURBOPACK compile-time value", "http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1") || 'http://ssba.e3.valueserver.jp/wp/wp-json/ssba/v1';
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
                            href: "/column",
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
        number: '①',
        title: '小学生クラス',
        meta: '月〜金 / 17:15〜18:35 / 定員8名',
        price: '13,200',
        unit: '円（税込）/ 月4回'
    },
    {
        number: '②',
        title: '中学生クラス',
        meta: '月・木・金 / 18:45〜20:10 / 定員8名',
        price: '15,400',
        unit: '円（税込）/ 月4回'
    },
    {
        number: '③',
        title: '小6 ハイレベルクラス',
        meta: '水曜日 / 18:45〜20:10 / 定員10名',
        price: '15,400',
        unit: '円（税込）/ 月4回'
    },
    {
        number: '④',
        title: '中学3年生クラス',
        meta: '9月〜3月 土曜日 / 17:00〜19:00',
        price: '16,000',
        unit: '円（税込）'
    },
    {
        number: '⑤',
        title: 'パーソナルレッスン',
        meta: '60分 / 2名まで同額',
        price: '6,600',
        unit: '円'
    },
    {
        number: '⑥',
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$HeroSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/home/HeroSection.js [client] (ecmascript)");
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
var __N_SSG = true;
function Home({ contents }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "SSBA - Shootingstar Baseball Academy"
                }, void 0, false, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 21,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$HeroSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ProSupportSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$OfficialMedia$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ColumnSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$home$2f$ContentsSection$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                images: contents
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 33,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__cd26684f._.js.map