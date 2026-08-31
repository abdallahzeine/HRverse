import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function disposeScene(scene, renderer, controls, mount) {
  const geometries = new Set();
  const materials = new Set();

  scene.traverse((item) => {
    if (item.geometry) geometries.add(item.geometry);
    if (item.material) {
      const itemMaterials = Array.isArray(item.material) ? item.material : [item.material];
      itemMaterials.forEach((material) => materials.add(material));
    }
  });

  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => {
    Object.values(material).forEach((value) => {
      if (value?.isTexture) value.dispose();
    });
    material.dispose();
  });

  controls.dispose();
  renderer.setAnimationLoop(null);
  renderer.dispose();
  if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
}

export default function OfficeRoom3D() {
  const mountRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    const mount = mountRef.current;
    if (!mount) return undefined;
    let cancelled = false;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(6.85, 4.47, -7.95);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = -0.35;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(1.35, 1.35, -0.2);
    controls.addEventListener('start', () => { controls.autoRotate = false; });
    controls.update();

    const mats = {
      wall: new THREE.MeshStandardMaterial({ color: 0x0b0f14, roughness: 0.88, transparent: true, opacity: 0.28 }),
      wallDark: new THREE.MeshStandardMaterial({ color: 0x243240, roughness: 0.9, transparent: true, opacity: 0.62 }),
      floor: new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.95, transparent: true, opacity: 0.62 }),
      trim: new THREE.MeshStandardMaterial({ color: 0x151919, roughness: 0.7 }),
      wood: new THREE.MeshStandardMaterial({ color: 0xc67331, roughness: 0.62 }),
      darkWood: new THREE.MeshStandardMaterial({ color: 0x74401e, roughness: 0.7 }),
      black: new THREE.MeshStandardMaterial({ color: 0x101114, roughness: 0.74 }),
      key: new THREE.MeshStandardMaterial({ color: 0x2b3038, roughness: 0.58 }),
      metal: new THREE.MeshStandardMaterial({ color: 0xb8bcc2, metalness: 0.45, roughness: 0.35 }),
      board: new THREE.MeshStandardMaterial({ color: 0xf7fbf8, roughness: 0.5 }),
      blue: new THREE.MeshStandardMaterial({ color: 0x3677ff, roughness: 0.55 }),
      screen: new THREE.MeshStandardMaterial({ color: 0x07182b, emissive: 0x0c4f8f, emissiveIntensity: 0.55, roughness: 0.24, side: THREE.DoubleSide }),
    };

    const room = new THREE.Group();
    room.position.set(1.35, 0, -0.2);
    room.scale.setScalar(1.12);
    scene.add(room);

    const box = (size, position, material, options = {}) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      mesh.rotation.set(...(options.rotation ?? [0, 0, 0]));
      mesh.castShadow = options.cast ?? true;
      mesh.receiveShadow = options.receive ?? true;
      room.add(mesh);
      return mesh;
    };

    const sphere = (radius, position, material, scale = [1, 1, 1]) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 18), material);
      mesh.position.set(...position);
      mesh.scale.set(...scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      room.add(mesh);
      return mesh;
    };

    const cylinder = (radius, height, position, material, rotation = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 24), material);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      room.add(mesh);
      return mesh;
    };

    // Room shell
    box([8.2, 0.18, 6.2], [0, -0.09, 0], mats.floor, { receive: true, cast: false });
    const roomWalls = [
      { axis: 'z', side: -1, meshes: [box([8.2, 3.5, 0.22], [0, 1.75, -3.1], mats.wall, { cast: false }), box([8.35, 0.18, 0.28], [0, 3.48, -3.02], mats.wallDark, { cast: false })] },
      { axis: 'z', side: 1, meshes: [box([8.2, 3.5, 0.22], [0, 1.75, 3.1], mats.wall, { cast: false }), box([8.35, 0.18, 0.28], [0, 3.48, 3.02], mats.wallDark, { cast: false })] },
      { axis: 'x', side: -1, meshes: [box([0.22, 3.5, 6.2], [-4.1, 1.75, 0], mats.wall, { cast: false }), box([0.28, 0.18, 6.25], [-4.02, 3.48, 0], mats.wallDark, { cast: false })] },
      { axis: 'x', side: 1, meshes: [box([0.22, 3.5, 6.2], [4.1, 1.75, 0], mats.wall, { cast: false }), box([0.28, 0.18, 6.25], [4.02, 3.48, 0], mats.wallDark, { cast: false })] },
    ];
    const [backWall, frontWall, leftWall, rightWall] = roomWalls;

    [-3, -1.6, -0.2, 1.2, 2.6].forEach((x) => {
      backWall.meshes.push(box([0.035, 3.25, 0.05], [x, 1.72, -2.96], mats.trim, { cast: false }));
      frontWall.meshes.push(box([0.035, 3.25, 0.05], [x, 1.72, 2.96], mats.trim, { cast: false }));
    });
    [-2.1, -0.6, 0.9, 2.4].forEach((z) => {
      leftWall.meshes.push(box([0.05, 3.25, 0.035], [-3.96, 1.72, z], mats.trim, { cast: false }));
      rightWall.meshes.push(box([0.05, 3.25, 0.035], [3.96, 1.72, z], mats.trim, { cast: false }));
    });

    const grid = new THREE.GridHelper(8.2, 34, 0x9fa89d, 0xcac7bb);
    grid.position.y = 0.012;
    grid.material.opacity = 0.22;
    grid.material.transparent = true;
    room.add(grid);

    // Presentation board on left wall
    leftWall.meshes.push(box([0.06, 1.45, 1.95], [-3.88, 2.0, -1.05], mats.trim));
    leftWall.meshes.push(box([0.07, 1.22, 1.68], [-3.83, 2.0, -1.05], mats.board));
    leftWall.meshes.push(box([0.08, 0.045, 1.05], [-3.78, 2.22, -1.05], mats.blue));
    leftWall.meshes.push(box([0.08, 0.035, 1.3], [-3.78, 2.03, -1.05], mats.wallDark));
    leftWall.meshes.push(box([0.08, 0.035, 0.9], [-3.78, 1.86, -1.05], mats.wallDark));
    leftWall.meshes.push(box([0.08, 0.045, 0.55], [-3.78, 1.66, -1.05], mats.blue));

    roomWalls.forEach(({ meshes }) => {
      meshes.forEach((mesh) => {
        mesh.material = mesh.material.clone();
        mesh.material.transparent = true;
        mesh.userData.wallBaseOpacity = mesh.material.opacity;
        mesh.userData.wallFade = 1;
      });
    });

    // Office desk/table
    box([3.4, 0.18, 1.35], [0, 0.88, 0.4], mats.wood);
    box([3.48, 0.14, 1.43], [0, 0.79, 0.4], mats.darkWood);
    [[-1.48, 0.35, -0.12], [1.48, 0.35, -0.12], [-1.48, 0.35, 0.92], [1.48, 0.35, 0.92]].forEach((pos) => {
      box([0.18, 0.7, 0.18], pos, mats.darkWood);
    });
    const keyboard = new THREE.Group();
    keyboard.position.set(0.03, 1.0, 0.84);
    keyboard.rotation.y = -0.12;
    room.add(keyboard);

    const keyboardBase = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.055, 0.36), mats.black);
    keyboardBase.castShadow = true;
    keyboard.add(keyboardBase);

    const keyGeometry = new THREE.BoxGeometry(0.055, 0.022, 0.052);
    [[-0.12, 13], [-0.04, 13], [0.04, 12]].forEach(([z, count], row) => {
      const rowOffset = row * 0.012;
      for (let i = 0; i < count; i += 1) {
        const key = new THREE.Mesh(keyGeometry, mats.key);
        key.position.set((i - (count - 1) / 2) * 0.069 + rowOffset, 0.039, z);
        key.castShadow = true;
        keyboard.add(key);
      }
    });
    [-0.4, -0.32, 0.34, 0.42].forEach((x) => {
      const key = new THREE.Mesh(keyGeometry, mats.key);
      key.position.set(x, 0.039, 0.12);
      key.castShadow = true;
      keyboard.add(key);
    });
    const spacebar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.022, 0.052), mats.key);
    spacebar.position.set(0.01, 0.039, 0.12);
    spacebar.castShadow = true;
    keyboard.add(spacebar);

    // Computer on desk side
    const monitor = new THREE.Group();
    monitor.position.set(0.9, 1.45, 0.12);
    monitor.rotation.y = -0.28;
    room.add(monitor);

    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.76, 0.09), mats.black);
    screenFrame.castShadow = true;
    monitor.add(screenFrame);

    const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.58), mats.screen);
    screenFace.position.z = 0.047;
    monitor.add(screenFace);

    const screenWhite = new THREE.MeshBasicMaterial({ color: 0xeaf7ff, transparent: true, opacity: 0.82, side: THREE.DoubleSide });
    const screenBlue = new THREE.MeshBasicMaterial({ color: 0x42b7ff, side: THREE.DoubleSide });
    const screenTeal = new THREE.MeshBasicMaterial({ color: 0x45e0c1, side: THREE.DoubleSide });
    const screenPanel = new THREE.MeshBasicMaterial({ color: 0x102f4d, side: THREE.DoubleSide });
    const addScreenElement = (size, position, material) => {
      const element = new THREE.Mesh(new THREE.PlaneGeometry(...size), material);
      element.position.set(...position);
      monitor.add(element);
    };
    addScreenElement([0.98, 0.055], [0, 0.262, 0.049], screenPanel);
    addScreenElement([0.14, 0.47], [-0.42, -0.002, 0.05], screenPanel);
    addScreenElement([0.28, 0.17], [-0.19, 0.11, 0.051], screenBlue);
    addScreenElement([0.28, 0.17], [0.14, 0.11, 0.051], screenTeal);
    addScreenElement([0.28, 0.17], [-0.19, -0.12, 0.051], screenPanel);
    addScreenElement([0.28, 0.17], [0.14, -0.12, 0.051], screenPanel);
    [[-0.19, 0.13, 0.17], [0.14, 0.13, 0.15], [-0.19, -0.1, 0.18], [0.14, -0.1, 0.16]].forEach(([x, y, width]) => {
      addScreenElement([width, 0.018], [x, y, 0.052], screenWhite);
      addScreenElement([width * 0.65, 0.012], [x, y - 0.045, 0.052], screenWhite);
    });
    [0.14, 0.04, -0.06].forEach((y, index) => {
      addScreenElement([0.055, 0.018], [-0.42, y, 0.052], index === 0 ? screenTeal : screenWhite);
    });

    const webcam = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), mats.metal);
    webcam.position.set(0, 0.345, 0.052);
    monitor.add(webcam);
    const statusLight = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 6), screenTeal);
    statusLight.position.set(0.5, -0.33, 0.052);
    monitor.add(statusLight);
    const monitorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.36, 20), mats.metal);
    monitorStem.position.set(0, -0.33, -0.015);
    monitorStem.castShadow = true;
    monitor.add(monitorStem);
    const monitorBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.07, 0.32), mats.black);
    monitorBase.position.set(0, -0.49, 0.02);
    monitorBase.castShadow = true;
    monitor.add(monitorBase);

    const mouse = new THREE.Group();
    mouse.position.set(0.76, 1.025, 0.84);
    mouse.rotation.y = -0.12;
    room.add(mouse);
    const mouseShell = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), mats.black);
    mouseShell.scale.set(0.78, 0.38, 1.12);
    mouseShell.castShadow = true;
    mouse.add(mouseShell);
    [-0.043, 0.043].forEach((x) => {
      const button = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.012, 0.11), mats.key);
      button.position.set(x, 0.047, -0.035);
      button.castShadow = true;
      mouse.add(button);
    });
    const mouseWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.035, 12), mats.metal);
    mouseWheel.position.set(0, 0.064, -0.025);
    mouseWheel.rotation.z = Math.PI / 2;
    mouse.add(mouseWheel);

    // Character GLB
    box([0.86, 0.12, 0.72], [0, 0.58, 1.58], mats.black);
    box([0.86, 0.9, 0.13], [0, 1.03, 1.92], mats.black, { rotation: [-0.08, 0, 0] });
    box([0.1, 0.48, 0.72], [-0.56, 0.85, 1.55], mats.black, { rotation: [-0.04, 0, 0] });
    box([0.1, 0.48, 0.72], [0.56, 0.85, 1.55], mats.black, { rotation: [-0.04, 0, 0] });
    cylinder(0.055, 0.68, [0, 0.28, 1.58], mats.metal);

    let characterMixer = null;
    const character = new THREE.Group();
    character.position.set(0, 0.42, 1.30);
    character.rotation.y = Math.PI;
    room.add(character);

    new GLTFLoader().load('/character.glb', (gltf) => {
      if (cancelled) return;

      const model = gltf.scene;
      model.traverse((child) => {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
      });

      const boxBeforeScale = new THREE.Box3().setFromObject(model);
      model.scale.multiplyScalar(1.65 / Math.max(boxBeforeScale.max.y - boxBeforeScale.min.y, 1));

      const fittedBox = new THREE.Box3().setFromObject(model);
      const center = fittedBox.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -fittedBox.min.y, -center.z);
      character.add(model);

      if (gltf.animations.length) {
        characterMixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => characterMixer.clipAction(clip).play());
      }

      setIsReady(true);
    }, undefined, (error) => {
      console.error(error);
      if (!cancelled) setIsReady(true);
    });

    // Small office extras, like the reference image but still cheap geometry.
    box([1.18, 1.55, 0.58], [2.85, 0.78, -1.95], mats.wood);
    box([1.22, 0.05, 0.62], [2.85, 1.58, -1.95], mats.darkWood);
    box([0.72, 1.65, 0.52], [-2.9, 0.82, 1.8], mats.wood);
    box([0.76, 0.05, 0.56], [-2.9, 1.68, 1.8], mats.darkWood);
    sphere(0.12, [2.7, 1.65, -1.82], mats.blue);
    box([0.12, 0.42, 0.06], [2.35, 1.86, -1.9], mats.board);
    box([0.12, 0.36, 0.06], [2.5, 1.82, -1.9], mats.blue);
    box([0.12, 0.46, 0.06], [2.65, 1.88, -1.9], mats.wood);

    // Lighting
    scene.add(new THREE.HemisphereLight(0xffffff, 0x5f6a70, 1.35));
    const sun = new THREE.DirectionalLight(0xffffff, 3.2);
    sun.position.set(4.5, 7, 5.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 20;
    sun.shadow.camera.left = -6;
    sun.shadow.camera.right = 6;
    sun.shadow.camera.top = 6;
    sun.shadow.camera.bottom = -6;
    scene.add(sun);

    const lamp = new THREE.PointLight(0xffd7a3, 1.8, 5);
    lamp.position.set(2.55, 2.35, -0.8);
    scene.add(lamp);
    cylinder(0.035, 2.05, [2.55, 1.18, -0.8], mats.black);
    sphere(0.18, [2.55, 2.25, -0.8], new THREE.MeshStandardMaterial({ color: 0xffe2bf, emissive: 0xffbc73, emissiveIntensity: 0.8 }));

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      const isMobile = width < 640;
      camera.aspect = width / height;
      camera.fov = isMobile ? 58 : 38;
      camera.position.set(...(isMobile ? [11.5, 6.6, -14] : [6.85, 4.47, -7.95]));
      controls.enabled = !isMobile;
      camera.updateProjectionMatrix();
      controls.update();
      renderer.setSize(width, height, false);
    };

    resize();
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(mount);
    window.addEventListener('resize', resize);

    const updateWallVisibility = (delta) => {
      const cameraLocal = room.worldToLocal(camera.position.clone());
      const hiddenAxis = Math.abs(cameraLocal.x) / 4.1 > Math.abs(cameraLocal.z) / 3.1 ? 'x' : 'z';
      const hiddenSide = Math.sign(cameraLocal[hiddenAxis]) || 1;
      roomWalls.forEach(({ axis, side, meshes }) => {
        const targetFade = axis === hiddenAxis && side === hiddenSide ? 0 : 1;
        meshes.forEach((mesh) => {
          mesh.visible = true;
          mesh.userData.wallFade = THREE.MathUtils.damp(mesh.userData.wallFade, targetFade, 8, delta);
          mesh.material.opacity = mesh.userData.wallBaseOpacity * mesh.userData.wallFade;
          if (mesh.userData.wallFade < 0.01 && targetFade === 0) mesh.visible = false;
        });
      });
    };

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const time = clock.elapsedTime;
      controls.update();
      updateWallVisibility(delta);
      characterMixer?.update(delta);
      mats.screen.emissiveIntensity = 0.52 + Math.sin(time * 2.1) * 0.08;
      renderer.render(scene, camera);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      characterMixer?.stopAllAction();
      disposeScene(scene, renderer, controls, mount);
    };
  }, []);

  return (
    <div className="three-room-shell">
      <div ref={mountRef} className="three-room" aria-label="Interactive 3D office room with table, computer, board, and typing person" />
      {!isReady && (
        <div className="three-room-loader" role="status" aria-live="polite">
          <span className="three-room-loader__spinner" />
          Loading 3D room...
        </div>
      )}
    </div>
  );
}
