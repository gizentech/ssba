import { useEffect, useRef } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  TextureLoader,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  DoubleSide,
  SRGBColorSpace,
  Vector3,
  Quaternion,
} from 'three';

const SPHERE_IMAGES = [
  '/images/IMG_9358.webp',
  '/images/IMG_9359.webp',
  '/images/IMG_9361.webp',
  '/images/makihara_nagare.webp',
  '/images/kawasaki_nagare.webp',
  '/images/honda_nagare.webp',
  '/images/nagare/nagare01.avif',
  '/images/nagare/nagare03.avif',
  '/images/nagare/nagare04.avif',
  '/images/nagare/nagare05.avif',
  '/images/nagare/nagare06.avif',
  '/images/facility.avif',
];

// フィボナッチ球体アルゴリズム
function fibonacciSphere(count) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push({
      x: Math.cos(theta) * radius,
      y: y,
      z: Math.sin(theta) * radius,
    });
  }
  return points;
}

// ジオメトリを全カードで共有（saichu.jpと同じ手法）
const sharedGeometry = new PlaneGeometry(0.8, 0.57);
const sharedPoints = fibonacciSphere(36);

export default function SphereBg() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGLサポートチェック
    let renderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      return;
    }

    if (!renderer.getContext()) {
      console.warn('WebGL context not available');
      renderer.dispose();
      return;
    }

    const scene = new Scene();

    const camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
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
    const handleScroll = () => {
      const vh = window.innerHeight;
      scrollProgress = Math.min(1, Math.max(0, (window.scrollY - vh * 0.5) / (vh * 0.5)));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const sphereGroup = new Group();
    scene.add(sphereGroup);

    const loader = new TextureLoader();
    const sphereRadius = 2.2;

    const materials = [];
    const meshes = [];

    // アニメーションループで再利用するベクトル（GC削減）
    const worldUp = new Vector3(0, 1, 0);
    const localUp = new Vector3(0, 1, 0);
    const tempQuat = new Quaternion();
    const tempVec = new Vector3();

    sharedPoints.forEach((point, i) => {
      const imgSrc = SPHERE_IMAGES[i % SPHERE_IMAGES.length];

      const material = new MeshBasicMaterial({
        side: DoubleSide,
        transparent: true,
        opacity: 0,
        visible: false,
      });
      materials.push(material);

      if (imgSrc) {
        loader.load(
          imgSrc,
          (texture) => {
            texture.colorSpace = SRGBColorSpace;
            material.map = texture;
            material.visible = true;
            material.needsUpdate = true;
          },
          undefined,
          () => {}
        );
      }

      // ジオメトリを共有して生成コストを削減
      const mesh = new Mesh(sharedGeometry, material);
      mesh.position.set(
        point.x * sphereRadius,
        point.y * sphereRadius,
        point.z * sphereRadius
      );
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

    const animate = () => {
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

      for (let i = 0; i < meshes.length; i++) {
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

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      cancelAnimationFrame(animationId);
    });
    canvas.addEventListener('webglcontextrestored', () => {
      startTime = performance.now();
      prevElapsed = 0;
      animate();
    });

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.traverse((obj) => {
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

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 0,
        backgroundImage: 'url(/images/p2_bg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.55)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>
  );
}
