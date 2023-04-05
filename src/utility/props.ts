import * as THREE from 'three';
// @ts-ignore
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Position } from './interfaces';

function clouds(scene: THREE.Scene, maxHeight: number): void {
  let clouds = [];

  let geo = new THREE.SphereGeometry(0, 0, 0);
  let count = Math.floor(Math.pow(Math.random(), 0.45) * 5);

  for (let i = 0; i < count; i++) {
    const puff1 = new THREE.SphereGeometry(1.2, 9, 9);
    const puff2 = new THREE.SphereGeometry(1.5, 9, 9);
    const puff3 = new THREE.SphereGeometry(0.9, 9, 9);

    puff1.translate(-1.85, Math.random() * 0.3, 0);
    puff2.translate(0, Math.random() * 0.3, 0);
    puff3.translate(1.85, Math.random() * 0.3, 0);

    const cloudGeo = mergeGeometries([puff1, puff2, puff3]);
    cloudGeo.translate(
      Math.random() * 20 - 10,
      Math.random() * 7 + maxHeight,
      Math.random() * 20 - 10
    );
    cloudGeo.rotateY(Math.random() * Math.PI * 2);

    // Create a bounding box around the cloud geometry
    const cloudBox = new THREE.Box3().setFromObject(new THREE.Mesh(cloudGeo));

    // Check for overlaps between this cloud and all previous clouds
    let intersects = false;
    for (let j = 0; j < clouds.length; j++) {
      const otherCloudBox = new THREE.Box3().setFromObject(new THREE.Mesh(clouds[j]));
      if (cloudBox.intersectsBox(otherCloudBox)) {
        intersects = true;
        break;
      }
    }

    // If this cloud doesn't overlap with any previous clouds, add it to the scene
    if (!intersects) {
      geo = mergeGeometries([geo, cloudGeo]);
      // @ts-ignore
      clouds.push(cloudGeo);
    }
  }

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      envMapIntensity: 0.75,
      flatShading: true,
      transparent: true,
      opacity: 0.85,
    })
  );

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);
}

function tree(scene: THREE.Scene, height: number, position: Position): void {
  const loader = new GLTFLoader();

  // Ability to add more trees models
  let availableName = ["forest"]
  loader.load(`./assets/${availableName[Math.floor(Math.random() * availableName.length)]}.glb`, function (gltf) {
    gltf.scene.position.set(position.x, height, position.y);
    const axis = new THREE.Vector3(0, 1, 0);

    const angle = Math.random() * Math.PI * 2;

    gltf.scene.rotateOnAxis(axis, angle);

    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        const material = child.material;
        if (material instanceof THREE.MeshStandardMaterial) {
          material.metalness = 0;
          material.roughness = 1;
        }
      }
    });

    scene.add(gltf.scene);
  });
}

function sea(scene: THREE.Scene, seaHight: number,) {
  const seaMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(17, 17, seaHight, 50),
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#55aaff").convertSRGBToLinear().multiplyScalar(3),
      ior: 1.1,
      transmission: 0.9,
      roughness: 1,
    })
  );

  seaMesh.receiveShadow = true;
  seaMesh.rotation.y = -Math.PI * 0.333 * 0.5;
  seaMesh.position.set(0, seaHight / 2, 0);
  scene.add(seaMesh);
}

function createMapFloor(MAX_HEIGHT: number, textures: any, scene: THREE.Scene) {
  const mapFloor = new THREE.Mesh(
    new THREE.CylinderGeometry(18.5, 18.5, MAX_HEIGHT * 0.1, 50),
    new THREE.MeshPhysicalMaterial({
      map: textures,
      envMapIntensity: 0.1,
      side: THREE.DoubleSide,
    })
  );
  mapFloor.receiveShadow = true;
  mapFloor.position.set(0, -MAX_HEIGHT * 0.05, 0);
  scene.add(mapFloor);
}

export { clouds, tree, sea, createMapFloor };