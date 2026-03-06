module.exports = [
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
    '/images/IMG_9356.webp',
    '/images/IMG_9357.webp',
    '/images/IMG_9358.webp',
    '/images/IMG_9359.webp',
    '/images/IMG_9361.webp',
    '/images/makihara_nagare.webp',
    '/images/kawasaki_nagare.webp',
    '/images/honda_nagare.webp',
    '/images/nagare/nagare01.webp',
    '/images/nagare/nagare03.webp',
    '/images/nagare/nagare04.webp',
    '/images/nagare/nagare05.webp',
    '/images/nagare/nagare06.webp',
    '/images/facility.webp'
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
            lineNumber: 257,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/home/SphereBg.js",
        lineNumber: 243,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/home/SphereBg.js [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/home/SphereBg.js [ssr] (ecmascript)"));
}),
"[externals]/three [external] (three, esm_import, [project]/node_modules/three)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("three-055b82e065a9f10e");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__60d84141._.js.map