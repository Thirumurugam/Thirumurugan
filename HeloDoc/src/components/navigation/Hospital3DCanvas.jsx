import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';
import { speak } from '../../services/speechService';
import { hospitalRoomsData } from '../../data/hospitalData';
import { 
  Eye, Layers, ZoomIn, ZoomOut, RotateCcw, 
  Accessibility, Navigation2, CheckCircle2, Volume2, Info 
} from 'lucide-react';

export const Hospital3DCanvas = ({ targetRoom = 'Room 104', onRoomSelect }) => {
  const mountRef = useRef(null);
  const { currentFloor, setCurrentFloor, currentLang, elderMode } = useApp();

  const [activeFloorFilter, setActiveFloorFilter] = useState('all'); // 'all', 'ground', 'floor1', 'floor2'
  const [wheelchairMode, setWheelchairMode] = useState(false);
  const [selectedRoomData, setSelectedRoomData] = useState(null);
  const [isRotating, setIsRotating] = useState(true);

  // References for Three.js instance
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const floorGroupsRef = useRef({ ground: null, floor1: null, floor2: null });
  const animFrameIdRef = useRef(null);
  const pathParticlesRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 340;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(elderMode ? 0x0f172a : 0x0b1329);
    sceneRef.current = scene;

    // 2. Camera: Isometric Angle
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
    camera.position.set(28, 26, 28);
    camera.lookAt(0, 4, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(25, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1.2, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // 5. Hospital Building Base Plate
    const basePlateGeo = new THREE.BoxGeometry(26, 0.6, 22);
    const basePlateMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      roughness: 0.4, 
      metalness: 0.1 
    });
    const basePlate = new THREE.Mesh(basePlateGeo, basePlateMat);
    basePlate.position.y = -0.3;
    basePlate.receiveShadow = true;
    scene.add(basePlate);

    // Grid Floor overlay
    const grid = new THREE.GridHelper(30, 20, 0x38bdf8, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // Helper: Canvas rounded rectangle
    const drawRoundRect = (ctx, x, y, width, height, radius) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    // Helper: Generates dynamic 512x512 CanvasTexture for the top surface of a room box
    const createRoomTopCanvasTexture = (roomNo, name, shortName, icon, colorHex, imageSrc, desc) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = colorHex || '#1e293b';
      ctx.fillRect(0, 0, 512, 512);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const renderContent = (img) => {
        // 1. Photographic Room Background
        if (img) {
          ctx.drawImage(img, 0, 0, 512, 512);
          // Dark high-contrast readability scrim
          const grad = ctx.createLinearGradient(0, 0, 0, 512);
          grad.addColorStop(0, 'rgba(15, 23, 42, 0.72)');
          grad.addColorStop(0.45, 'rgba(15, 23, 42, 0.40)');
          grad.addColorStop(1, 'rgba(15, 23, 42, 0.94)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 512, 512);
        } else {
          ctx.fillStyle = colorHex || '#1e293b';
          ctx.fillRect(0, 0, 512, 512);
        }

        // 2. High-Contrast Senior Room Badge Pill (at top)
        ctx.fillStyle = colorHex || '#2563eb';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        drawRoundRect(ctx, 20, 20, 472, 82, 20);
        ctx.fill();
        ctx.stroke();

        // Badge Pill Text: Icon + Room + Short Name (Elderly accessible)
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${icon || '📍'} ${roomNo} • ${shortName || roomNo}`, 256, 62);

        // 3. Room Name (Large 900 bold with drop shadow)
        ctx.font = '900 40px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 14;
        const displayName = name.length > 22 ? name.substring(0, 20) + '...' : name;
        ctx.fillText(displayName, 256, 250);

        // 4. Description / Specialty subtitle
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#7dd3fc';
        ctx.shadowBlur = 10;
        const subText = desc ? (desc.length > 26 ? desc.substring(0, 24) + '...' : desc) : '';
        ctx.fillText(subText, 256, 310);

        // 5. Senior prompt button badge at bottom
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        drawRoundRect(ctx, 70, 410, 372, 64, 16);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('📷 Real Room Photo 🔍', 256, 442);

        texture.needsUpdate = true;
      };

      if (imageSrc) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => renderContent(img);
        img.onerror = () => renderContent(null);
        img.src = imageSrc;
      } else {
        renderContent(null);
      }

      return texture;
    };

    // Helper: Generates floating billboard sprite label above the room box
    const createRoomSpriteLabel = (roomNo, shortName, icon, colorHex) => {
      const canvas = document.createElement('canvas');
      canvas.width = 280;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = colorHex || '#2563eb';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      drawRoundRect(ctx, 8, 8, 264, 74, 20);
      ctx.fill();
      ctx.stroke();

      ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 6;
      ctx.fillText(`${icon || '📍'} ${roomNo} ${shortName || ''}`.trim(), 140, 45);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3.8, 1.2, 1);
      return sprite;
    };

    // Helper: Create a Room Box with photographic top surface & floating billboard label
    const createRoomMesh = (x, y, z, w, h, d, color, name, roomNo, desc, imageSrc, icon, shortName) => {
      const group = new THREE.Group();
      
      const geo = new THREE.BoxGeometry(w, h, d);
      const isTarget = roomNo === targetRoom;
      const colorHex = '#' + (typeof color === 'number' ? color.toString(16).padStart(6, '0') : color.replace('#', ''));
      
      // Top face canvas texture with real room photo and senior badge
      const topTexture = createRoomTopCanvasTexture(roomNo, name, shortName, icon, colorHex, imageSrc, desc);

      // Side walls material
      const sideMat = new THREE.MeshStandardMaterial({
        color: isTarget ? 0x2563eb : color,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: isTarget ? 0.95 : 0.85,
        emissive: isTarget ? 0x1d4ed8 : 0x000000,
        emissiveIntensity: isTarget ? 0.4 : 0
      });

      // Top face material with real room photo
      const topMat = new THREE.MeshStandardMaterial({
        map: topTexture,
        roughness: 0.2,
        metalness: 0.1,
        emissive: isTarget ? 0x1e3a8a : 0x000000,
        emissiveIntensity: isTarget ? 0.25 : 0
      });
      
      // Three.js BoxGeometry order: [+X, -X, +Y (top), -Y, +Z, -Z]
      const materials = [sideMat, sideMat, topMat, sideMat, sideMat, sideMat];

      const mesh = new THREE.Mesh(geo, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { name, roomNo, desc, isTarget, imageSrc, icon, shortName, colorHex };
      group.add(mesh);

      // Room border outline
      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({ 
        color: isTarget ? 0x38bdf8 : 0x94a3b8, 
        linewidth: isTarget ? 3 : 1 
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      group.add(wireframe);

      // Floating 3D Billboard Sprite Label (Senior Accessible)
      const spriteLabel = createRoomSpriteLabel(roomNo, shortName, icon, colorHex);
      spriteLabel.position.set(0, h / 2 + 1.2, 0);
      group.add(spriteLabel);

      group.position.set(x, y + h / 2, z);
      return group;
    };

    // ==========================================
    // FLOOR 0: GROUND FLOOR
    // ==========================================
    const groundGroup = new THREE.Group();
    groundGroup.name = 'ground';

    // Ground Floor Slab
    const groundSlabGeo = new THREE.BoxGeometry(24, 0.3, 20);
    const groundSlabMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const groundSlab = new THREE.Mesh(groundSlabGeo, groundSlabMat);
    groundSlab.position.set(0, 0.15, 0);
    groundGroup.add(groundSlab);

    // Ground Floor Rooms
    // Entrance / Lobby
    const entrance = createRoomMesh(0, 0.3, 7, 7, 2, 4, 0x0284c7, 'Hospital Main Entrance & Reception', 'Room 002', 'Lobby, Tokens & Info Desk', '/assets/hospital-bg.jpg', '🏥', 'RECEPTION');
    groundGroup.add(entrance);

    // Emergency Trauma Ward (Room 001, Red)
    const emergencyWard = createRoomMesh(-6.5, 0.3, 3, 7, 2.4, 6, 0xd97706, '24/7 Emergency Trauma & ER', 'Room 001', 'Critical Care & Ambulance Bay', '/assets/rooms/room_icu.jpg', '🚨', 'EMERGENCY');
    groundGroup.add(emergencyWard);

    // Jan Aushadhi Generic Pharmacy (Room 004, Green)
    const pharmacy = createRoomMesh(6.5, 0.3, 3, 7, 2.2, 6, 0x059669, 'Jan Aushadhi Generic Pharmacy', 'Room 004', 'Discounted Medicines & Delivery Dispatch', '/assets/rooms/room_normal_ward.jpg', '💊', 'PHARMACY');
    groundGroup.add(pharmacy);

    // Diagnostic Pathology Lab (Room 007, Purple)
    const pathology = createRoomMesh(-6.5, 0.3, -4.5, 7, 2.2, 5.5, 0x7c3aed, 'Diagnostic Pathology Lab', 'Room 007', 'Blood, Urine & Scan Tests', '/assets/rooms/room_dermatology.jpg', '🔬', 'PATH LAB');
    groundGroup.add(pathology);

    // Radiology & X-Ray (Room 009, Teal)
    const radiology = createRoomMesh(6.5, 0.3, -4.5, 7, 2.2, 5.5, 0x0d9488, 'Radiology & X-Ray Wing', 'Room 009', 'Digital X-Ray, CT Scan, Ultrasound', '/assets/rooms/room_orthopedic.jpg', '🩻', 'X-RAY & CT');
    groundGroup.add(radiology);

    // Central Elevator A & Stairs Tower
    const elevatorTowerGeo = new THREE.BoxGeometry(3.5, 16, 3.5);
    const elevatorTowerMat = new THREE.MeshStandardMaterial({ 
      color: 0x38bdf8, 
      transparent: true, 
      opacity: 0.65, 
      metalness: 0.6,
      roughness: 0.2
    });
    const elevatorTower = new THREE.Mesh(elevatorTowerGeo, elevatorTowerMat);
    elevatorTower.position.set(0, 8, -1);
    groundGroup.add(elevatorTower);

    scene.add(groundGroup);
    floorGroupsRef.current.ground = groundGroup;

    // ==========================================
    // FLOOR 1: 1ST FLOOR (OPD & SPECIALIST CLINICS)
    // ==========================================
    const floor1Group = new THREE.Group();
    floor1Group.name = 'floor1';
    floor1Group.position.y = 4.2;

    // Floor 1 Slab
    const f1Slab = new THREE.Mesh(groundSlabGeo, groundSlabMat);
    floor1Group.add(f1Slab);

    // Room 104: Dr. Rajesh Kumar - Orthopedics (Target)
    const room104 = createRoomMesh(6.5, 0.3, 3, 7, 2.4, 6, 0x1d4ed8, 'Dr. Rajesh Kumar (MS Ortho)', 'Room 104', 'Knee Joint Pain & Arthritis Clinic', '/assets/rooms/room_orthopedic.jpg', '🦴', 'ORTHOPEDIC');
    floor1Group.add(room104);

    // Room 101: Senior Orthopedic & Joint Care
    const room101 = createRoomMesh(-6.5, 0.3, 3, 7, 2.2, 6, 0x2563eb, 'Dr. S. Venkat (Senior Ortho)', 'Room 101', 'Joint Replacement & Spine Unit', '/assets/rooms/room_orthopedic.jpg', '🦴', 'ORTHO SPINE');
    floor1Group.add(room101);

    // Room 105: General Medicine & Geriatrics
    const room105 = createRoomMesh(-6.5, 0.3, -4.5, 7, 2.2, 5.5, 0x0284c7, 'Dr. Ananya Sharma (MD)', 'Room 105', 'General Medicine, BP & Diabetes', '/assets/rooms/room_normal_ward.jpg', '🩺', 'GENERAL MED');
    floor1Group.add(room105);

    // Room 108: Ophthalmology & Eye Care
    const room108 = createRoomMesh(6.5, 0.3, -4.5, 7, 2.2, 5.5, 0x8b5cf6, 'Dr. Arvind Swamy (Ophthal)', 'Room 108', 'Cataract, Vision & Retina Care', '/assets/rooms/room_dermatology.jpg', '👁️', 'EYE CLINIC');
    floor1Group.add(room108);

    scene.add(floor1Group);
    floorGroupsRef.current.floor1 = floor1Group;

    // ==========================================
    // FLOOR 2: 2ND FLOOR (CARDIOLOGY, NEURO & ICU)
    // ==========================================
    const floor2Group = new THREE.Group();
    floor2Group.name = 'floor2';
    floor2Group.position.y = 8.4;

    // Floor 2 Slab
    const f2Slab = new THREE.Mesh(groundSlabGeo, groundSlabMat);
    floor2Group.add(f2Slab);

    // Room 201: Cardiology (Heart Clinic)
    const room201 = createRoomMesh(-6.5, 0.3, 3, 6.5, 2.2, 6, 0xef4444, 'Dr. K. Srinivas (Cardio)', 'Room 201', 'ECG, 2D Echo, Heart Failure OPD', '/assets/rooms/room_cardiology.jpg', '❤️', 'CARDIOLOGY');
    floor2Group.add(room201);

    // Room 204: Cardiac Surgery & Hypertension
    const room204 = createRoomMesh(6.5, 0.3, 3, 6.5, 2.2, 6, 0xdc2626, 'Dr. Preeti Deshmukh', 'Room 204', 'Cardiology & Preventive Heart Care', '/assets/rooms/room_cardiology.jpg', '❤️', 'HEART CARE');
    floor2Group.add(room204);

    // Room 205: Neurology & Stroke Rehab
    const room205 = createRoomMesh(-6.5, 0.3, -4.5, 5.5, 2.2, 5.5, 0x6366f1, 'Dr. Vikramaditya (Neuro)', 'Room 205', 'Brain, Nerve & Parkinson’s Care', '/assets/rooms/room_icu.jpg', '🧠', 'NEUROLOGY');
    floor2Group.add(room205);

    // Room 404: Intensive Care Unit (ICU) - Prominent critical care room
    const room404 = createRoomMesh(0, 0.3, -4.5, 6, 2.4, 5.5, 0xdc2626, 'Intensive Care Unit (ICU)', 'Room 404', 'Critical Care, Multipara Monitors & Ventilator Beds', '/assets/rooms/room_icu.jpg', '🚨', 'ICU UNIT');
    floor2Group.add(room404);

    // Room 208: Senior Inpatient Deluxe Ward
    const room208 = createRoomMesh(6.5, 0.3, -4.5, 5.5, 2.2, 5.5, 0x10b981, 'Senior Care Inpatient Ward', 'Room 208', 'Post-Op Observation & Daycare Beds', '/assets/rooms/room_normal_ward.jpg', '🛏️', 'PATIENT WARD');
    floor2Group.add(room208);

    scene.add(floor2Group);
    floorGroupsRef.current.floor2 = floor2Group;

    // ==========================================
    // FLOOR 3: 3RD FLOOR (POSTNATAL & MATERNITY WARDS)
    // ==========================================
    const floor3Group = new THREE.Group();
    floor3Group.name = 'floor3';
    floor3Group.position.y = 12.6;

    // Floor 3 Slab
    const f3Slab = new THREE.Mesh(groundSlabGeo, groundSlabMat);
    floor3Group.add(f3Slab);

    const room406 = createRoomMesh(-8, 0.3, 3, 3.8, 2.2, 6, 0xf43f5e, 'Postnatal Ward 406', 'Room 406', 'Maternity Recovery & Baby Bassinet', '/assets/rooms/room_postnatal.jpg', '👶', 'POSTNATAL');
    const room407 = createRoomMesh(-4, 0.3, 3, 3.8, 2.2, 6, 0xf43f5e, 'Postnatal Ward 407', 'Room 407', 'Postnatal Recovery & Nursing Care', '/assets/rooms/room_postnatal.jpg', '👶', 'POSTNATAL');
    const room408 = createRoomMesh(0, 0.3, 3, 3.8, 2.2, 6, 0xf43f5e, 'Postnatal Ward 408', 'Room 408', 'Pediatric & Mother Recovery Care', '/assets/rooms/room_postnatal.jpg', '👶', 'POSTNATAL');
    const room409 = createRoomMesh(4, 0.3, 3, 3.8, 2.2, 6, 0xf43f5e, 'Postnatal Ward 409', 'Room 409', 'Maternity Deluxe Recovery Suite', '/assets/rooms/room_postnatal.jpg', '👶', 'POSTNATAL');
    const room410 = createRoomMesh(8, 0.3, 3, 3.8, 2.2, 6, 0xf43f5e, 'Postnatal Ward 410', 'Room 410', 'Mother & Newborn Comfort Ward', '/assets/rooms/room_postnatal.jpg', '👶', 'POSTNATAL');
    floor3Group.add(room406, room407, room408, room409, room410);

    scene.add(floor3Group);
    floorGroupsRef.current.floor3 = floor3Group;

    // ==========================================
    // 6. ANIMATED 3D GLOWING NAVIGATION PATH
    // ==========================================
    const pathCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.6, 8.5),   // 1. Entrance Outside
      new THREE.Vector3(0, 0.6, 5.0),   // 2. Main Lobby
      new THREE.Vector3(0, 0.6, 0.0),   // 3. Elevator A Base
      new THREE.Vector3(0, 4.6, -0.5),  // 4. Elevator Rise to Floor 1
      new THREE.Vector3(2.5, 4.6, 0.0), // 5. Exit Elevator & Turn Right
      new THREE.Vector3(4.5, 4.6, 2.0), // 6. Corridor to Ortho Wing
      new THREE.Vector3(6.5, 4.6, 3.0)  // 7. Destination: Room 104
    ]);

    const tubeGeo = new THREE.TubeGeometry(pathCurve, 64, 0.16, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const pathTube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(pathTube);

    // Floating Target Beacon above Room 104
    const beaconGeo = new THREE.ConeGeometry(0.7, 1.8, 16);
    beaconGeo.rotateX(Math.PI);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0,
      metalness: 0.4
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(6.5, 8.2, 3);
    scene.add(beacon);

    // Pulsing Light at Destination
    const beaconLight = new THREE.PointLight(0x38bdf8, 2.5, 12);
    beaconLight.position.set(6.5, 8.2, 3);
    scene.add(beaconLight);

    // Start Location Beacon ("You Are Here") at Ground Entrance
    const startPinGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const startPinMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.8 });
    const startPin = new THREE.Mesh(startPinGeo, startPinMat);
    startPin.position.set(0, 1.5, 8.5);
    scene.add(startPin);

    // Floating Particles along path
    const particleCount = 24;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const pt = pathCurve.getPoint(i / particleCount);
      particlePositions[i * 3] = pt.x;
      particlePositions[i * 3 + 1] = pt.y + 0.1;
      particlePositions[i * 3 + 2] = pt.z;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      transparent: true,
      opacity: 0.9
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    pathParticlesRef.current = { particles, curve: pathCurve, count: particleCount };

    // ==========================================
    // 7. RAYCASTER & ROOM SELECTION ON CLICK
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (let hit of intersects) {
        if (hit.object.userData && hit.object.userData.roomNo) {
          const roomInfo = hit.object.userData;
          setSelectedRoomData(roomInfo);
          if (onRoomSelect) onRoomSelect(roomInfo);
          speak(`${roomInfo.name} in ${roomInfo.roomNo}. ${roomInfo.desc}.`, currentLang, elderMode);
          break;
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // ==========================================
    // 8. INTERACTIVE DRAG TO ROTATE (ORBIT)
    // ==========================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      setIsRotating(false);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const rotSpeed = 0.007;
      scene.rotation.y += deltaX * rotSpeed;
      camera.position.y = Math.max(10, Math.min(45, camera.position.y - deltaY * 0.1));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch Support for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsRotating(false);
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      scene.rotation.y += deltaX * 0.007;
      camera.position.y = Math.max(10, Math.min(45, camera.position.y - deltaY * 0.1));
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    domElem.addEventListener('touchmove', onTouchMove, { passive: true });
    domElem.addEventListener('touchend', onMouseUp);

    // ==========================================
    // 9. ANIMATION LOOP
    // ==========================================
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow gentle auto-rotation when user is not dragging
      if (isRotating) {
        scene.rotation.y += 0.002;
      }

      // Pulse the destination beacon & light
      if (beacon) {
        beacon.position.y = 7.8 + Math.sin(elapsedTime * 4) * 0.4;
        beacon.rotation.y += 0.02;
      }
      if (beaconLight) {
        beaconLight.intensity = 2.0 + Math.sin(elapsedTime * 5) * 1.0;
      }

      // Move walking dots along path
      if (pathParticlesRef.current) {
        const positions = pathParticlesRef.current.particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const tVal = (i / particleCount + (elapsedTime * 0.18)) % 1;
          const pos = pathCurve.getPoint(tVal);
          positions[i * 3] = pos.x;
          positions[i * 3 + 1] = pos.y + 0.1;
          positions[i * 3 + 2] = pos.z;
        }
        pathParticlesRef.current.particles.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      domElem.removeEventListener('click', handleCanvasClick);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      domElem.removeEventListener('touchmove', onTouchMove);
      domElem.removeEventListener('touchend', onMouseUp);
      renderer.dispose();
    };
  }, [elderMode, targetRoom]);

  // Handle floor slice filtering
  useEffect(() => {
    const groups = floorGroupsRef.current;
    if (!groups.ground || !groups.floor1 || !groups.floor2) return;

    if (activeFloorFilter === 'all') {
      groups.ground.position.y = 0;
      groups.floor1.position.y = 4.2;
      groups.floor2.position.y = 8.4;
      if (groups.floor3) groups.floor3.position.y = 12.6;
      groups.ground.visible = true;
      groups.floor1.visible = true;
      groups.floor2.visible = true;
      if (groups.floor3) groups.floor3.visible = true;
    } else if (activeFloorFilter === 'ground') {
      groups.ground.position.y = 0;
      groups.ground.visible = true;
      groups.floor1.visible = false;
      groups.floor2.visible = false;
      if (groups.floor3) groups.floor3.visible = false;
    } else if (activeFloorFilter === 'floor1') {
      groups.floor1.position.y = 0; // Bring Floor 1 to ground level for clear viewing
      groups.ground.visible = false;
      groups.floor1.visible = true;
      groups.floor2.visible = false;
      if (groups.floor3) groups.floor3.visible = false;
    } else if (activeFloorFilter === 'floor2') {
      groups.floor2.position.y = 0;
      groups.ground.visible = false;
      groups.floor1.visible = false;
      groups.floor2.visible = true;
      if (groups.floor3) groups.floor3.visible = false;
    } else if (activeFloorFilter === 'floor3') {
      if (groups.floor3) groups.floor3.position.y = 0;
      groups.ground.visible = false;
      groups.floor1.visible = false;
      groups.floor2.visible = false;
      if (groups.floor3) groups.floor3.visible = true;
    }
  }, [activeFloorFilter]);

  // Camera Reset
  const resetCamera = () => {
    if (!cameraRef.current || !sceneRef.current) return;
    cameraRef.current.position.set(28, 26, 28);
    cameraRef.current.lookAt(0, 4, 0);
    sceneRef.current.rotation.y = 0;
    setIsRotating(true);
    speak("Camera view reset to 3D isometric overview.", currentLang, elderMode);
  };

  // Top Down 2D Angle
  const setTopDownView = () => {
    if (!cameraRef.current || !sceneRef.current) return;
    cameraRef.current.position.set(0, 42, 0.1);
    cameraRef.current.lookAt(0, 0, 0);
    sceneRef.current.rotation.y = 0;
    setIsRotating(false);
    speak("Switched to Top-Down 2D Architectural View.", currentLang, elderMode);
  };

  // Focus Target Room (Room 104)
  const focusTargetRoom = () => {
    if (!cameraRef.current || !sceneRef.current) return;
    cameraRef.current.position.set(16, 14, 16);
    cameraRef.current.lookAt(6.5, 4.6, 3);
    setIsRotating(false);
    speak("Camera focused on Doctor Consultation Room 104 on the 1st Floor.", currentLang, elderMode);
  };

  return (
    <div className="hospital-3d-wrapper">
      {/* 3D Viewport Controls Top Bar */}
      <div className="canvas-control-strip">
        <div className="floor-slice-tabs">
          <button 
            className={`slice-btn ${activeFloorFilter === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveFloorFilter('all'); setCurrentFloor('floor1'); }}
          >
            🏢 All 4 Floors
          </button>
          <button 
            className={`slice-btn ${activeFloorFilter === 'ground' ? 'active' : ''}`}
            onClick={() => { setActiveFloorFilter('ground'); setCurrentFloor('ground'); }}
          >
            Ground (ER/Pharm)
          </button>
          <button 
            className={`slice-btn ${activeFloorFilter === 'floor1' ? 'active' : ''}`}
            onClick={() => { setActiveFloorFilter('floor1'); setCurrentFloor('floor1'); }}
          >
            1st (Ortho 104)
          </button>
          <button 
            className={`slice-btn ${activeFloorFilter === 'floor2' ? 'active' : ''}`}
            onClick={() => { setActiveFloorFilter('floor2'); setCurrentFloor('floor2'); }}
          >
            2nd (ICU 404/Cardio)
          </button>
          <button 
            className={`slice-btn ${activeFloorFilter === 'floor3' ? 'active' : ''}`}
            onClick={() => { setActiveFloorFilter('floor3'); setCurrentFloor('floor3'); }}
          >
            3rd (Postnatal 406-410)
          </button>
        </div>

        {/* Camera & Route Tools */}
        <div className="canvas-tools-row">
          <button 
            className="tool-action-btn"
            onClick={focusTargetRoom}
            title="Focus Destination Room 104"
          >
            <Navigation2 size={15} className="text-cyan-400" /> Focus Target
          </button>

          <button 
            className="tool-action-btn"
            onClick={setTopDownView}
            title="Top-Down Architectural View"
          >
            <Layers size={15} /> 2D Top View
          </button>

          <button 
            className="tool-action-btn"
            onClick={resetCamera}
            title="Reset 3D Angle"
          >
            <RotateCcw size={15} /> Reset 3D
          </button>

          <button 
            className={`tool-action-btn ${wheelchairMode ? 'active-wheelchair' : ''}`}
            onClick={() => {
              const next = !wheelchairMode;
              setWheelchairMode(next);
              speak(next ? "Wheelchair ramp and elevator route enabled." : "Standard walking route.", currentLang, elderMode);
            }}
            title="Wheelchair-Accessible Route (Elevator Only)"
          >
            <Accessibility size={15} /> {wheelchairMode ? 'Wheelchair: ON' : 'Wheelchair'}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className="canvas-render-container"
        style={{ width: '100%', height: '360px', position: 'relative', cursor: 'grab', borderRadius: '14px', overflow: 'hidden' }}
      >
        {/* Floating 3D Legend / Watermark */}
        <div className="canvas-hud-badge">
          <span className="live-dot"></span>
          <span>Interactive 3D Hospital Model • Touch/Drag to Rotate</span>
        </div>
      </div>

      {/* Selected Room Detail Drawer / Tooltip */}
      {selectedRoomData && (
        <div className="selected-room-hud-card">
          <div className="room-hud-header">
            {selectedRoomData.imageSrc && (
              <div className="room-hud-thumb" style={{ width: '70px', height: '54px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1.5px solid rgba(56,189,248,0.5)' }}>
                <img src={selectedRoomData.imageSrc} alt={selectedRoomData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div className="room-badge-col">
              <span className="hud-room-code" style={{ backgroundColor: selectedRoomData.colorHex || '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>
                {selectedRoomData.icon || '📍'} {selectedRoomData.roomNo} • {selectedRoomData.shortName || selectedRoomData.roomNo}
              </span>
              <h4 style={{ margin: '4px 0 2px', fontSize: '1rem', fontWeight: 800 }}>{selectedRoomData.name}</h4>
              <p className="hud-room-desc" style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>{selectedRoomData.desc}</p>
            </div>
            <button 
              className="hud-listen-btn"
              onClick={() => speak(`${selectedRoomData.name} in ${selectedRoomData.roomNo}. ${selectedRoomData.desc}`, currentLang, elderMode)}
            >
              <Volume2 size={18} />
            </button>
          </div>
          {selectedRoomData.isTarget && (
            <div className="hud-target-alert">
              <CheckCircle2 size={16} />
              <span>This is your appointment destination. Step inside and present Token #A-14.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
