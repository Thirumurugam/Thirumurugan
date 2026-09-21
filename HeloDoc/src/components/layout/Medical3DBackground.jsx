import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';

export const Medical3DBackground = () => {
  const containerRef = useRef(null);
  const { elderMode } = useApp();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 12, 36);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    const bluePointLight = new THREE.PointLight(0x0284c7, 2, 80);
    bluePointLight.position.set(-25, 10, 10);
    scene.add(bluePointLight);

    const cyanPointLight = new THREE.PointLight(0x00d2ff, 2.2, 80);
    cyanPointLight.position.set(25, -5, 15);
    scene.add(cyanPointLight);

    // 3. Dynamic Undulating 3D Medical Particle Wave Grid
    const numX = 50;
    const numZ = 50;
    const numParticles = numX * numZ;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const color1 = new THREE.Color(0x0284c7); // Sky blue
    const color2 = new THREE.Color(0x00d2ff); // Medical cyan
    const color3 = new THREE.Color(0x10b981); // Emerald vitality

    let idx = 0;
    for (let ix = 0; ix < numX; ix++) {
      for (let iz = 0; iz < numZ; iz++) {
        positions[idx * 3] = (ix - numX / 2) * 1.8;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = (iz - numZ / 2) * 1.8;

        const ratio = (ix + iz) / (numX + numZ);
        const c = ratio < 0.5 
          ? color1.clone().lerp(color2, ratio * 2) 
          : color2.clone().lerp(color3, (ratio - 0.5) * 2);

        colors[idx * 3] = c.r;
        colors[idx * 3 + 1] = c.g;
        colors[idx * 3 + 2] = c.b;
        idx++;
      }
    }

    const waveGeometry = new THREE.BufferGeometry();
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite using canvas texture
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
      grad.addColorStop(0.7, 'rgba(2, 132, 199, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const waveMaterial = new THREE.PointsMaterial({
      size: 0.85,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: elderMode ? 0.35 : 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const waveParticles = new THREE.Points(waveGeometry, waveMaterial);
    waveParticles.position.y = -14;
    scene.add(waveParticles);

    // 4. 3D Floating DNA Double-Helix Segment
    const dnaGroup = new THREE.Group();
    const strand1Points = [];
    const strand2Points = [];
    const totalBasePairs = 28;
    const dnaRadius = 2.4;
    const dnaHeight = 22;

    const sphereGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const strand1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const strand2Mat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      roughness: 0.3
    });
    const rungMat = new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.45
    });

    for (let i = 0; i <= totalBasePairs; i++) {
      const angle = (i / totalBasePairs) * Math.PI * 4;
      const y = (i / totalBasePairs) * dnaHeight - dnaHeight / 2;
      const x1 = Math.cos(angle) * dnaRadius;
      const z1 = Math.sin(angle) * dnaRadius;
      const x2 = Math.cos(angle + Math.PI) * dnaRadius;
      const z2 = Math.sin(angle + Math.PI) * dnaRadius;

      // Node 1
      const n1 = new THREE.Mesh(sphereGeo, strand1Mat);
      n1.position.set(x1, y, z1);
      dnaGroup.add(n1);
      strand1Points.push(new THREE.Vector3(x1, y, z1));

      // Node 2
      const n2 = new THREE.Mesh(sphereGeo, strand2Mat);
      n2.position.set(x2, y, z2);
      dnaGroup.add(n2);
      strand2Points.push(new THREE.Vector3(x2, y, z2));

      // Base Pair Rung
      const rungGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y, z1),
        new THREE.Vector3(x2, y, z2)
      ]);
      const rung = new THREE.Line(rungGeo, rungMat);
      dnaGroup.add(rung);
    }

    dnaGroup.position.set(24, 2, -6);
    dnaGroup.rotation.z = Math.PI * 0.15;
    scene.add(dnaGroup);

    // Clone a second soft DNA helix for the other side
    const dnaGroup2 = dnaGroup.clone();
    dnaGroup2.position.set(-25, 4, -8);
    dnaGroup2.rotation.z = -Math.PI * 0.12;
    scene.add(dnaGroup2);

    // 5. Floating 3D Medical Crosses
    const create3DCross = (size = 1.4) => {
      const crossGroup = new THREE.Group();
      const crossMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85
      });

      const barGeo = new THREE.BoxGeometry(size * 2.8, size * 0.8, size * 0.8);
      const vertGeo = new THREE.BoxGeometry(size * 0.8, size * 2.8, size * 0.8);

      const hBar = new THREE.Mesh(barGeo, crossMat);
      const vBar = new THREE.Mesh(vertGeo, crossMat);
      crossGroup.add(hBar);
      crossGroup.add(vBar);

      // Add a glowing halo ring around the cross
      const ringGeo = new THREE.TorusGeometry(size * 1.8, 0.05, 12, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      crossGroup.add(ring);

      return crossGroup;
    };

    const cross1 = create3DCross(1.3);
    cross1.position.set(-20, 12, -4);
    scene.add(cross1);

    const cross2 = create3DCross(0.9);
    cross2.position.set(21, 14, -2);
    scene.add(cross2);

    const cross3 = create3DCross(0.7);
    cross3.position.set(-15, -6, 2);
    scene.add(cross3);

    // 6. Floating Ambient Dust Particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 80;
      dustPositions[i + 1] = (Math.random() - 0.5) * 50;
      dustPositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.6,
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 7. Interactive Mouse / Pointer Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onPointerMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // 8. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const speedMultiplier = elderMode ? 0.4 : 1.0;

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Subtle camera parallax
      camera.position.x = currentMouseX * 5;
      camera.position.y = 12 + currentMouseY * 3.5;
      camera.lookAt(0, 0, 0);

      // Animate wave particles
      const posAttr = waveGeometry.attributes.position;
      let pIdx = 0;
      for (let ix = 0; ix < numX; ix++) {
        for (let iz = 0; iz < numZ; iz++) {
          const u = ix / numX;
          const v = iz / numZ;
          const y = (
            Math.sin(ix * 0.28 + elapsed * 1.5 * speedMultiplier) * 2.2 +
            Math.cos(iz * 0.25 + elapsed * 1.2 * speedMultiplier) * 1.8 +
            Math.sin((ix + iz) * 0.15 + elapsed * speedMultiplier) * 1.2
          );
          posAttr.array[pIdx * 3 + 1] = y;
          pIdx++;
        }
      }
      posAttr.needsUpdate = true;

      // Rotate DNA strands
      dnaGroup.rotation.y = elapsed * 0.25 * speedMultiplier;
      dnaGroup2.rotation.y = -elapsed * 0.22 * speedMultiplier;

      // Rotate Crosses
      cross1.rotation.y = elapsed * 0.4 * speedMultiplier;
      cross1.rotation.x = Math.sin(elapsed * 0.3 * speedMultiplier) * 0.2;
      cross1.position.y = 12 + Math.sin(elapsed * 0.6 * speedMultiplier) * 1.2;

      cross2.rotation.y = -elapsed * 0.5 * speedMultiplier;
      cross2.rotation.z = Math.cos(elapsed * 0.4 * speedMultiplier) * 0.2;
      cross2.position.y = 14 + Math.cos(elapsed * 0.7 * speedMultiplier) * 0.9;

      cross3.rotation.y = elapsed * 0.35 * speedMultiplier;
      cross3.position.y = -6 + Math.sin(elapsed * 0.5 * speedMultiplier) * 0.8;

      // Drift dust particles
      dustParticles.rotation.y = elapsed * 0.03 * speedMultiplier;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      waveGeometry.dispose();
      waveMaterial.dispose();
      if (container) container.innerHTML = '';
    };
  }, [elderMode]);

  return (
    <div 
      ref={containerRef} 
      className="medical-3d-background-canvas" 
      aria-hidden="true"
    />
  );
};

export default Medical3DBackground;
