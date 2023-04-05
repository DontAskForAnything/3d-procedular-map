import * as THREE from "three";

function createHex(height: number, position: THREE.Vector2): THREE.CylinderGeometry {
  let hex = new THREE.CylinderGeometry(1, 1, height, 6, 1, false);
  hex.translate(position.x, height * 0.5, position.y);
  return hex;
}

function hexMeshTexture(geo: THREE.BufferGeometry, map: THREE.Texture, envMapIntensity: number = 0.135): THREE.Mesh {
  let mat = new THREE.MeshPhysicalMaterial({
    envMapIntensity: envMapIntensity,
    flatShading: true,
    map
  });

  let mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function hexPositionConverter(x: number, z: number): THREE.Vector2 {
  return new THREE.Vector2((x + (z % 2) * 0.5) * Math.sqrt(3), z * 3 / 2)
}
export { createHex, hexMeshTexture, hexPositionConverter };