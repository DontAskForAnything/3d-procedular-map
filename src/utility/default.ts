
import * as THREE from "three";
import { Sizes, Position } from "./interfaces";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function initCamera(sizes: Sizes, position: Position): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
  camera.position.set(position.x, position.y, position.z);
  return camera;
}

function initOrbitControls(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement, enableDamping: boolean = true, enableZoom: boolean = false, enablePan: boolean = false): OrbitControls {

  const controls = new OrbitControls(camera, canvas);

  controls.enableZoom = enableZoom;
  controls.enableDamping = enableDamping;
  controls.enablePan = enablePan;

  return controls;
}

function windowResize(sizes: Sizes, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
}

function initRenderer(sizes: Sizes, canvasRef: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef, antialias: true, alpha:true });
  renderer.setPixelRatio(2);
  renderer.setSize(sizes.width, sizes.height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  // @ts-ignore
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

function initLight(scene: THREE.Scene, color: THREE.Color, position: Position): THREE.PointLight {
  const light = new THREE.PointLight(color, 500, 200);
  light.position.set(position.x, position.y, position.z);

  light.castShadow = true;
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;

  scene.add(light);

  return light;
}

function loadTextures(): Record<string, THREE.Texture> {
  const textureLoader = new THREE.TextureLoader();
  const textures: Record<string, THREE.Texture> = {
    sand: textureLoader.load('./assets/sand.png'),
    grass: textureLoader.load('./assets/grass.png'),
    mountain: textureLoader.load('./assets/mountain.png'),
    rocky: textureLoader.load('./assets/rocky.png'),
    snow: textureLoader.load('./assets/snow.png'),
    wood: textureLoader.load('./assets/wood.png'),
  };
  return textures;
}
export { initCamera, initOrbitControls, windowResize, initRenderer, initLight, loadTextures };
