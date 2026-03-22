import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function HeroModelViewer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.05, 9.7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.7);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(4, 6, 7);
    const fillLight = new THREE.DirectionalLight(0xdfeeff, 0.4);
    fillLight.position.set(-5, 3, -4);
    scene.add(ambientLight, keyLight, fillLight);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const loader = new GLTFLoader();
    let frameId = 0;
    let model;
    let poseTimer = 0;
    let isPointerActive = false;
    let lastPointerTime = performance.now();
    const pointerRotation = new THREE.Vector3(0, 0, 0);
    const pointerPosition = new THREE.Vector3(0, 0, 0);
    const pointerTargetRotation = new THREE.Vector3(0, 0, 0);
    const pointerTargetPosition = new THREE.Vector3(0, 0, 0);
    const pointerVelocity = new THREE.Vector2(0, 0);
    let lastPointerX = 0;
    let lastPointerY = 0;
    const currentRotation = new THREE.Vector3(0, 0.42, 0);
    const targetRotation = new THREE.Vector3(0, 0.42, 0);
    const currentPosition = new THREE.Vector3(0, -0.08, 0);
    const targetPosition = new THREE.Vector3(0, -0.08, 0);

    loader.load('/models/atom/scene.gltf', (gltf) => {
      const object = gltf.scene;

      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;

          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (!material) {
              return;
            }

            if ('envMapIntensity' in material) {
              material.envMapIntensity = 0;
            }

            if ('metalness' in material) {
              material.metalness = 0;
            }

            if ('roughness' in material) {
              material.roughness = 1;
            }

            if ('color' in material && material.color) {
              const hsl = {};
              material.color.getHSL(hsl);

              if (hsl.h < 0.08 || hsl.h > 0.92) {
                material.color = new THREE.Color(0xe5f1ff);
              } else if (hsl.l > 0.75) {
                material.color = new THREE.Color(0xfafcff);
              } else {
                material.color.lerp(new THREE.Color(0xdfecff), 0.4);
              }
            }

            if ('emissive' in material && material.emissive) {
              material.emissive = new THREE.Color(0x000000);
              material.emissiveIntensity = 0;
            }
          });
        }
      });

      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxAxis = Math.max(size.x, size.y, size.z);
      const scale = 5 / maxAxis;

      object.scale.setScalar(scale);
      object.position.sub(center.multiplyScalar(scale));
      object.position.y = -0.08;
      object.rotation.y = 0.42;

      model = object;
      modelGroup.add(object);
    });

    const handleResize = () => {
      if (!container) {
        return;
      }
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const handlePointerMove = (event) => {
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const now = performance.now();
      const deltaMs = Math.max(now - lastPointerTime, 16);
      const velocityX = (x - lastPointerX) / deltaMs;
      const velocityY = (y - lastPointerY) / deltaMs;
      const speed = Math.min(Math.hypot(velocityX, velocityY) * 18, 1.2);

      isPointerActive = true;
      pointerVelocity.set(velocityX, velocityY);
      pointerTargetRotation.set(
        y * -(0.14 + speed * 0.18) + velocityY * -1.4,
        x * (0.2 + speed * 0.28) + velocityX * 2.2,
        x * -(0.04 + speed * 0.08)
      );
      pointerTargetPosition.set(
        x * (0.03 + speed * 0.05),
        y * -(0.02 + speed * 0.04),
        0
      );
      lastPointerTime = now;
      lastPointerX = x;
      lastPointerY = y;
    };

    const handlePointerLeave = () => {
      isPointerActive = false;
      pointerTargetRotation.set(0, 0, 0);
      pointerTargetPosition.set(0, 0, 0);
    };

    const clock = new THREE.Clock();
    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.05);

      if (model) {
        poseTimer -= delta;

        if (poseTimer <= 0) {
          poseTimer = 0.9 + Math.random() * 1.8;
          targetRotation.set(
            (Math.random() - 0.5) * 0.95,
            0.42 + (Math.random() - 0.5) * 1.8,
            (Math.random() - 0.5) * 0.75
          );
          targetPosition.set(
            (Math.random() - 0.5) * 0.2,
            -0.08 + (Math.random() - 0.5) * 0.12,
            (Math.random() - 0.5) * 0.08
          );
        }

        currentRotation.lerp(targetRotation, delta * 1.65);
        currentPosition.lerp(targetPosition, delta * 1.45);
        pointerRotation.lerp(pointerTargetRotation, delta * (isPointerActive ? 4.2 : 2.8));
        pointerPosition.lerp(pointerTargetPosition, delta * (isPointerActive ? 4 : 2.6));

        const interactiveMix = isPointerActive ? 1 : 0;

        model.rotation.x = currentRotation.x + pointerRotation.x * interactiveMix;
        model.rotation.y = currentRotation.y + pointerRotation.y * interactiveMix;
        model.rotation.z = currentRotation.z + pointerRotation.z * interactiveMix;
        model.position.x = currentPosition.x + pointerPosition.x * interactiveMix;
        model.position.y = currentPosition.y + pointerPosition.y * interactiveMix;
        model.position.z = currentPosition.z;
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      renderer.dispose();
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose?.();
          if (Array.isArray(child.material)) {
            child.material.forEach((item) => item.dispose?.());
          } else {
            child.material?.dispose?.();
          }
        }
      });
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="hero-model-canvas" aria-hidden="true" />;
}
