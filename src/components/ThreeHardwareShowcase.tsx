import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Layers,
  RotateCcw,
  Router as RouterIcon,
  Server,
} from 'lucide-react';
import { Lang, Theme, TRANSLATIONS } from '../i18n';

type ModelType = 'router' | 'cctv' | 'switch';
type CameraPreset = 'iso' | 'front' | 'top';

interface ExplodablePart {
  mesh: THREE.Object3D;
  basePos: THREE.Vector3;
  explodeOffset: THREE.Vector3;
}

interface ThreeHardwareShowcaseProps {
  lang: Lang;
  theme: Theme;
}

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  iso: { pos: [3.4, 2.3, 4.1], target: [0, 0.35, 0] },
  front: { pos: [0.0, 1.0, 4.9], target: [0, 0.35, 0] },
  top: { pos: [0.0, 4.8, 1.3], target: [0, 0.2, 0] },
};

const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    grad.addColorStop(0, 'rgba(2, 6, 23, 0.52)');
    grad.addColorStop(0.55, 'rgba(2, 6, 23, 0.2)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSwitchDisplayTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#071526';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 120);
    ctx.fillStyle = '#38BDF8';
    ctx.font = '700 28px monospace';
    ctx.fillText('FK-CORE 10G SFP+', 24, 52);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 22px monospace';
    ctx.fillText('VLAN ACTIVE · LINK UP', 24, 94);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function buildRouterGroup(
  registerPart: (mesh: THREE.Object3D, explodeOffset: [number, number, number]) => void
): THREE.Group {
  const root = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.45,
    metalness: 0.25,
  });
  const topPlateMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    roughness: 0.22,
    metalness: 0.65,
    clearcoat: 0.45,
    clearcoatRoughness: 0.25,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.2,
    metalness: 0.9,
  });
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 2.2,
    roughness: 0.2,
  });

  const feetGroup = new THREE.Group();
  const footGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.08, 16);
  const footPositions: [number, number, number][] = [
    [-0.95, 0.04, -0.58],
    [0.95, 0.04, -0.58],
    [-0.95, 0.04, 0.58],
    [0.95, 0.04, 0.58],
  ];
  footPositions.forEach(([x, y, z]) => {
    const f = new THREE.Mesh(footGeo, bodyMat);
    f.position.set(x, y, z);
    f.castShadow = true;
    feetGroup.add(f);
  });
  root.add(feetGroup);
  registerPart(feetGroup, [0, -0.35, 0]);

  const shape = new THREE.Shape();
  const w = 1.15;
  const d = 0.72;
  const r = 0.12;
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r);
  shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d);
  shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r);
  shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);

  const chassisGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 3,
  });
  chassisGeo.rotateX(Math.PI / 2);
  const chassis = new THREE.Mesh(chassisGeo, bodyMat);
  chassis.position.y = 0.34;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  root.add(chassis);
  registerPart(chassis, [0, 0, 0]);

  const topPlate = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.06, 1.22), topPlateMat);
  topPlate.position.set(0, 0.39, 0);
  topPlate.castShadow = true;
  root.add(topPlate);
  registerPart(topPlate, [0, 0.55, 0]);

  const frontGroup = new THREE.Group();
  const trimBar = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.04, 0.05), trimMat);
  trimBar.position.set(0, 0.24, 0.745);
  frontGroup.add(trimBar);

  const ledGeo = new THREE.BoxGeometry(0.11, 0.024, 0.02);
  for (let i = 0; i < 5; i++) {
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(-0.48 + i * 0.24, 0.29, 0.745);
    frontGroup.add(led);
  }
  root.add(frontGroup);
  registerPart(frontGroup, [0, 0.08, 0.48]);

  const portsGroup = new THREE.Group();
  const portGeo = new THREE.BoxGeometry(0.16, 0.12, 0.06);
  const wanMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
    metalness: 0.7,
  });
  for (let i = 0; i < 4; i++) {
    const port = new THREE.Mesh(portGeo, i === 0 ? wanMat : trimMat);
    port.position.set(-0.48 + i * 0.32, 0.22, -0.74);
    portsGroup.add(port);
  }
  root.add(portsGroup);
  registerPart(portsGroup, [0, 0, -0.45]);

  const antennaPositions: [number, number, number, number][] = [
    [-0.95, 0.28, -0.68, 0.12],
    [-0.38, 0.28, -0.72, 0.05],
    [0.38, 0.28, -0.72, -0.05],
    [0.95, 0.28, -0.68, -0.12],
  ];
  antennaPositions.forEach(([x, y, z, tiltZ], idx) => {
    const antGroup = new THREE.Group();
    antGroup.position.set(x, y, z);
    antGroup.rotation.z = tiltZ;
    antGroup.rotation.x = -0.12;

    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.1, 14), trimMat);
    hinge.rotation.z = Math.PI / 2;
    antGroup.add(hinge);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.048, 1.25, 16), topPlateMat);
    mast.position.y = 0.65;
    mast.castShadow = true;
    antGroup.add(mast);

    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.032, 0.08, 16), ledMat);
    tip.position.y = 1.31;
    antGroup.add(tip);

    root.add(antGroup);
    registerPart(antGroup, [idx < 2 ? -0.35 : 0.35, 0.45, -0.42]);
  });

  return root;
}

function buildCctvGroup(
  isSoftwareGl: boolean,
  registerPart: (mesh: THREE.Object3D, explodeOffset: [number, number, number]) => void
): THREE.Group {
  const root = new THREE.Group();

  const whiteShellMat = new THREE.MeshPhysicalMaterial({
    color: 0xf8fafc,
    roughness: 0.28,
    metalness: 0.15,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.35,
    metalness: 0.85,
  });
  const brushedAlumMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.22,
    metalness: 0.9,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0ea5e9,
    roughness: 0.05,
    metalness: 0.05,
    transmission: isSoftwareGl ? 0 : 0.88,
    transparent: true,
    opacity: isSoftwareGl ? 0.42 : 1,
    ior: 1.55,
    thickness: 0.6,
    clearcoat: 1.0,
    depthWrite: false,
  });
  const irLedMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.8,
    roughness: 0.3,
  });

  const baseMount = new THREE.Group();
  const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.12, 32), whiteShellMat);
  basePlate.position.y = 0.06;
  basePlate.castShadow = true;
  basePlate.receiveShadow = true;
  baseMount.add(basePlate);

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.72, 20), brushedAlumMat);
  arm.position.set(0, 0.44, -0.15);
  arm.rotation.x = 0.24;
  arm.castShadow = true;
  baseMount.add(arm);

  const swivelJoint = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), darkMetalMat);
  swivelJoint.position.set(0, 0.78, -0.05);
  baseMount.add(swivelJoint);
  root.add(baseMount);
  registerPart(baseMount, [0, -0.35, -0.35]);

  const bodyMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.35, 1.35, 28),
    whiteShellMat
  );
  bodyMesh.rotation.x = Math.PI / 2;
  bodyMesh.position.set(0, 0.94, 0.12);
  bodyMesh.castShadow = true;
  root.add(bodyMesh);
  registerPart(bodyMesh, [0, 0.15, 0]);

  const hoodGeo = new THREE.CylinderGeometry(0.44, 0.44, 1.48, 28, 1, false, -Math.PI * 0.42, Math.PI * 0.84);
  const hood = new THREE.Mesh(hoodGeo, whiteShellMat);
  hood.rotation.x = Math.PI / 2;
  hood.rotation.y = Math.PI;
  hood.position.set(0, 0.99, 0.18);
  hood.castShadow = true;
  root.add(hood);
  registerPart(hood, [0, 0.62, 0.15]);

  const opticsGroup = new THREE.Group();
  opticsGroup.position.set(0, 0.94, 0.79);

  const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.1, 28), darkMetalMat);
  bezel.rotation.x = Math.PI / 2;
  opticsGroup.add(bezel);

  const sensorBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.14, 24), brushedAlumMat);
  sensorBarrel.rotation.x = Math.PI / 2;
  sensorBarrel.position.z = 0.04;
  opticsGroup.add(sensorBarrel);

  const irGeo = new THREE.SphereGeometry(0.028, 10, 10);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const ir = new THREE.Mesh(irGeo, irLedMat);
    ir.position.set(Math.cos(angle) * 0.25, Math.sin(angle) * 0.25, 0.06);
    opticsGroup.add(ir);
  }
  root.add(opticsGroup);
  registerPart(opticsGroup, [0, 0.15, 0.55]);

  const lensGlass = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
  lensGlass.rotation.x = Math.PI / 2;
  lensGlass.position.set(0, 0.94, 0.84);
  lensGlass.renderOrder = 2;
  root.add(lensGlass);
  registerPart(lensGlass, [0, 0.15, 0.95]);

  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.84, -0.52),
    new THREE.Vector3(0.14, 0.62, -0.78),
    new THREE.Vector3(0.28, 0.24, -0.68),
    new THREE.Vector3(0.45, 0.05, -0.45),
  ]);
  const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 24, 0.032, 10, false), darkMetalMat);
  cable.castShadow = true;
  root.add(cable);
  registerPart(cable, [0.3, -0.1, -0.45]);

  return root;
}

function buildSwitchGroup(
  maxAnisotropy: number,
  registerPart: (mesh: THREE.Object3D, explodeOffset: [number, number, number]) => void
): THREE.Group {
  const root = new THREE.Group();

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.42,
    metalness: 0.78,
  });
  const topCoverMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    roughness: 0.28,
    metalness: 0.6,
    clearcoat: 0.3,
  });
  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.2,
    metalness: 0.92,
  });
  const sfpGlowMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 2.0,
    roughness: 0.2,
  });

  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.42, 1.35), chassisMat);
  mainBody.position.set(0, 0.23, 0);
  mainBody.castShadow = true;
  mainBody.receiveShadow = true;
  root.add(mainBody);
  registerPart(mainBody, [0, 0, 0]);

  const topLid = new THREE.Mesh(new THREE.BoxGeometry(2.54, 0.05, 1.28), topCoverMat);
  topLid.position.set(0, 0.465, 0);
  topLid.castShadow = true;
  root.add(topLid);
  registerPart(topLid, [0, 0.65, 0]);

  const earsGroup = new THREE.Group();
  const earGeo = new THREE.BoxGeometry(0.18, 0.42, 0.05);
  const leftEar = new THREE.Mesh(earGeo, silverMat);
  leftEar.position.set(-1.39, 0.23, 0.65);
  const rightEar = new THREE.Mesh(earGeo, silverMat);
  rightEar.position.set(1.39, 0.23, 0.65);
  earsGroup.add(leftEar, rightEar);
  root.add(earsGroup);
  registerPart(earsGroup, [0, 0, 0.45]);

  const displayTex = createSwitchDisplayTexture(maxAnisotropy);
  const lcdMat = new THREE.MeshStandardMaterial({
    map: displayTex,
    emissiveMap: displayTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.45,
    roughness: 0.15,
  });
  const lcdScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.18), lcdMat);
  lcdScreen.position.set(-0.82, 0.24, 0.678);
  lcdMat.polygonOffset = true;
  lcdMat.polygonOffsetFactor = -1;
  root.add(lcdScreen);
  registerPart(lcdScreen, [-0.2, 0.1, 0.5]);

  const portsGroup = new THREE.Group();
  const portFrameGeo = new THREE.BoxGeometry(0.11, 0.11, 0.04);
  for (let i = 0; i < 8; i++) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const port = new THREE.Mesh(portFrameGeo, silverMat);
    port.position.set(-0.2 + col * 0.16, 0.3 - row * 0.14, 0.68);
    portsGroup.add(port);
  }

  const sfpGeo = new THREE.BoxGeometry(0.16, 0.14, 0.18);
  const sfp1 = new THREE.Mesh(sfpGeo, silverMat);
  sfp1.position.set(0.75, 0.24, 0.72);
  const sfp2 = new THREE.Mesh(sfpGeo, silverMat);
  sfp2.position.set(1.0, 0.24, 0.72);

  const fiberBoot1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.12), sfpGlowMat);
  fiberBoot1.position.set(0.75, 0.24, 0.84);
  const fiberBoot2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.12), sfpGlowMat);
  fiberBoot2.position.set(1.0, 0.24, 0.84);

  portsGroup.add(sfp1, sfp2, fiberBoot1, fiberBoot2);
  root.add(portsGroup);
  registerPart(portsGroup, [0.2, 0.05, 0.55]);

  const internalGroup = new THREE.Group();
  const pcb = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.04, 1.05),
    new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.45, metalness: 0.2 })
  );
  pcb.position.set(0, 0.12, 0);
  internalGroup.add(pcb);

  const heatsink = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 0.52), silverMat);
  heatsink.position.set(0, 0.2, 0);
  internalGroup.add(heatsink);
  root.add(internalGroup);
  registerPart(internalGroup, [0, 0.3, 0]);

  return root;
}

export function ThreeHardwareShowcase({ lang, theme }: ThreeHardwareShowcaseProps) {
  const t = TRANSLATIONS[lang].hardware3d;
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<ModelType>('router');
  const [exploded, setExploded] = useState(false);
  const [preset, setPreset] = useState<CameraPreset>('iso');
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [webglError, setWebglError] = useState(false);

  const activeModelRef = useRef<ModelType>(activeModel);
  const explodedRef = useRef<boolean>(exploded);
  const themeRef = useRef<Theme>(theme);
  const sceneEnvRefs = useRef<{
    scene: THREE.Scene;
    darkGrid: THREE.GridHelper;
    lightGrid: THREE.GridHelper;
  } | null>(null);

  const cameraTransitionRef = useRef<{
    active: boolean;
    targetPos: THREE.Vector3;
    targetLook: THREE.Vector3;
  }>({
    active: false,
    targetPos: new THREE.Vector3(...CAMERA_PRESETS.iso.pos),
    targetLook: new THREE.Vector3(...CAMERA_PRESETS.iso.target),
  });

  useEffect(() => {
    activeModelRef.current = activeModel;
  }, [activeModel]);

  useEffect(() => {
    explodedRef.current = exploded;
  }, [exploded]);

  useEffect(() => {
    themeRef.current = theme;
    const refs = sceneEnvRefs.current;
    if (!refs) return;
    const bgHex = theme === 'light' ? 0xe2e8f0 : 0x060b16;
    refs.scene.background = new THREE.Color(bgHex);
    refs.scene.fog = new THREE.FogExp2(bgHex, 0.048);
    refs.lightGrid.visible = theme === 'light';
    refs.darkGrid.visible = theme === 'dark';
  }, [theme]);

  const handleSelectPreset = (nextPreset: CameraPreset) => {
    setPreset(nextPreset);
    const cfg = CAMERA_PRESETS[nextPreset];
    cameraTransitionRef.current = {
      active: true,
      targetPos: new THREE.Vector3(...cfg.pos),
      targetLook: new THREE.Vector3(...cfg.target),
    };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const handleContextRestored = () => {
      setWebglError(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    const initialBg = themeRef.current === 'light' ? 0xe2e8f0 : 0x060b16;
    scene.background = new THREE.Color(initialBg);
    scene.fog = new THREE.FogExp2(initialBg, 0.048);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      50
    );
    camera.position.set(...CAMERA_PRESETS.iso.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.iso.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.4;
    controls.maxDistance = 7.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.autoRotate = !isSoftwareGl && !prefersReducedMotion;
    controls.autoRotateSpeed = 0.85;

    controls.addEventListener('start', () => {
      cameraTransitionRef.current.active = false;
    });

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4, 6.5, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -3.2;
    keyLight.shadow.camera.right = 3.2;
    keyLight.shadow.camera.top = 3.2;
    keyLight.shadow.camera.bottom = -3.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    rimLight.position.set(-4.5, 3.2, -4.0);
    scene.add(rimLight);

    const stageGroup = new THREE.Group();
    const darkGrid = new THREE.GridHelper(14, 28, 0x1e293b, 0x0f172a);
    darkGrid.position.y = -0.004;
    darkGrid.visible = themeRef.current === 'dark';

    const lightGrid = new THREE.GridHelper(14, 28, 0x94a3b8, 0xcbd5e1);
    lightGrid.position.y = -0.004;
    lightGrid.visible = themeRef.current === 'light';

    stageGroup.add(darkGrid, lightGrid);
    sceneEnvRefs.current = { scene, darkGrid, lightGrid };

    const shadowTex = createContactShadowTexture();
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 3.8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.72,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.002;
    stageGroup.add(contactShadow);
    scene.add(stageGroup);

    const explodableParts: Record<ModelType, ExplodablePart[]> = {
      router: [],
      cctv: [],
      switch: [],
    };

    const registerFor =
      (type: ModelType) =>
      (mesh: THREE.Object3D, offset: [number, number, number]) => {
        explodableParts[type].push({
          mesh,
          basePos: mesh.position.clone(),
          explodeOffset: new THREE.Vector3(...offset),
        });
      };

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const modelGroups: Record<ModelType, THREE.Group> = {
      router: buildRouterGroup(registerFor('router')),
      cctv: buildCctvGroup(isSoftwareGl, registerFor('cctv')),
      switch: buildSwitchGroup(maxAnisotropy, registerFor('switch')),
    };

    (Object.keys(modelGroups) as ModelType[]).forEach((key) => {
      modelGroups[key].visible = key === activeModelRef.current;
      scene.add(modelGroups[key]);
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let explodeFactor = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);

      const currentModel = activeModelRef.current;
      (Object.keys(modelGroups) as ModelType[]).forEach((key) => {
        modelGroups[key].visible = key === currentModel;
      });

      const targetExplode = explodedRef.current ? 1 : 0;
      explodeFactor = THREE.MathUtils.damp(explodeFactor, targetExplode, 6.5, delta);
      explodableParts[currentModel].forEach((part) => {
        part.mesh.position.set(
          part.basePos.x + part.explodeOffset.x * explodeFactor,
          part.basePos.y + part.explodeOffset.y * explodeFactor,
          part.basePos.z + part.explodeOffset.z * explodeFactor
        );
      });

      if (cameraTransitionRef.current.active) {
        _camTargetPos.copy(cameraTransitionRef.current.targetPos);
        _camTargetLook.copy(cameraTransitionRef.current.targetLook);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, 6, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, 6, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, 6, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _camTargetLook.x, 6, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _camTargetLook.y, 6, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _camTargetLook.z, 6, delta);

        if (camera.position.distanceTo(_camTargetPos) < 0.02) {
          cameraTransitionRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || disposed) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      sceneEnvRefs.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material?.dispose();
          }
        }
      });
      envTarget.dispose();
      shadowTex.dispose();
      renderer.dispose();
    };
  }, []);

  const info = t.models[activeModel];

  return (
    <div className="relative rounded-2xl sm:rounded-3xl bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 shadow-xl sm:shadow-2xl overflow-hidden">
      {/* Minimal Spec Title Header: stacked neatly on mobile, floating overlay on sm+ */}
      <div className="relative sm:pointer-events-none sm:absolute sm:top-6 sm:start-6 z-10 sm:max-w-md p-2.5 pb-0 sm:p-0">
        <div className="w-full sm:w-auto sm:inline-block rounded-2xl bg-white/95 dark:bg-slate-900/95 sm:dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-sm">
          <p className="text-[11px] font-semibold tracking-wide text-sky-700 dark:text-sky-400">
            {t.inspectorBadge}
          </p>
          <h3 className="font-display text-sm sm:text-xl font-bold text-slate-950 dark:text-white tracking-tight mt-0.5">
            {info.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 hidden sm:block">
            {info.subtitle}
          </p>
          <p dir="ltr" className="font-mono text-[10px] sm:text-[11px] text-sky-700 dark:text-sky-300/90 mt-1 rtl:text-right sm:rtl:text-left">
            {info.specs}
          </p>
        </div>
      </div>

      {/* Isolated WebGL Viewport Container */}
      {webglError ? (
        <div className="h-[250px] sm:h-[470px] lg:h-[520px] flex flex-col items-center justify-center p-6 text-center bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
          <Server className="w-10 h-10 text-sky-600 dark:text-sky-400 mb-3" />
          <p className="font-display text-base sm:text-lg font-bold text-slate-950 dark:text-white">{info.title}</p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md">{info.subtitle}</p>
        </div>
      ) : (
        <div
          ref={mountRef}
          className="w-full h-[250px] sm:h-[470px] lg:h-[520px] cursor-grab active:cursor-grabbing"
          aria-label={`Interactive 3D view of ${info.title}.`}
        />
      )}

      {/* Collapsible Unified Bottom Control Dock */}
      <div
        dir="ltr"
        className="relative sm:absolute sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 z-10 w-full sm:w-auto sm:max-w-[94%] flex flex-col items-center px-2.5 pb-2.5 sm:p-0 bg-slate-200 dark:bg-slate-950 sm:bg-transparent sm:dark:bg-transparent"
      >
        <button
          type="button"
          onClick={() => setControlsCollapsed((prev) => !prev)}
          className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
        >
          {controlsCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{t.showControls}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{t.hideControls}</span>
            </>
          )}
        </button>

        {!controlsCollapsed && (
          <div className="w-full sm:w-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 p-1.5 sm:px-3 sm:py-2 shadow-xl sm:shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-3">
            {/* Hardware Model Switcher */}
            <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-950/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveModel('router')}
                className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 min-h-[40px] sm:min-h-[36px] rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer leading-tight text-center ${
                  activeModel === 'router'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <RouterIcon className="w-3.5 h-3.5 shrink-0 hidden xs:inline sm:inline" />
                <span>{t.models.router.label}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModel('cctv')}
                className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 min-h-[40px] sm:min-h-[36px] rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer leading-tight text-center ${
                  activeModel === 'cctv'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5 shrink-0 hidden xs:inline sm:inline" />
                <span>{t.models.cctv.label}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModel('switch')}
                className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 min-h-[40px] sm:min-h-[36px] rounded-lg text-[11px] sm:text-xs font-medium transition-colors cursor-pointer leading-tight text-center ${
                  activeModel === 'switch'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                <Server className="w-3.5 h-3.5 shrink-0 hidden xs:inline sm:inline" />
                <span>{t.models.switch.label}</span>
              </button>
            </div>

            <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700/80" />

            {/* Exploded View & Camera Angle Controls */}
            <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setExploded((prev) => !prev)}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-2 min-h-[40px] sm:min-h-[36px] rounded-xl text-[11px] sm:text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  exploded
                    ? 'bg-sky-600/15 border-sky-500 text-sky-700 dark:text-sky-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>{exploded ? t.assemble : t.explode}</span>
              </button>

              <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 dark:bg-slate-950/70 p-1 rounded-xl">
                {(['iso', 'front', 'top'] as CameraPreset[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`px-2 sm:px-2.5 py-1.5 min-h-[34px] rounded-lg text-[10px] sm:text-[11px] font-medium tracking-wide transition-colors cursor-pointer ${
                      preset === p
                        ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {t.presets[p]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setExploded(false);
                    handleSelectPreset('iso');
                  }}
                  aria-label="Reset 3D camera view"
                  className="p-1.5 min-h-[34px] min-w-[34px] flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
