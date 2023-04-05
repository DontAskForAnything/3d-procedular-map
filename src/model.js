import React from 'react'
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { initCamera, initOrbitControls, initRenderer, windowResize, initLight, loadTextures } from './utility/default.ts';
import { createHex, hexMeshTexture, hexPositionConverter } from './utility/hex.ts';
import { clouds, tree, sea, createMapFloor } from './utility/props.ts';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Model() {
  const canvasRef = React.useRef();
  const [loaded,setLoaded] = React.useState(false);

  React.useEffect(() => {
    if(loaded)return
    const MAX_HEIGHT = 10;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    let textures = loadTextures()

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color( "#857255" );

    let sandBuffer = new THREE.BoxGeometry(0, 0, 0);
    let grassBuffer = new THREE.BoxGeometry(0, 0, 0);
    let mountainBuffer = new THREE.BoxGeometry(0, 0, 0);
    let rockyBuffer = new THREE.BoxGeometry(0, 0, 0);
    let snowBuffer = new THREE.BoxGeometry(0, 0, 0);


    function addHexToBuffer(height, position) {
      let hex = createHex(height, position)
      if (height < MAX_HEIGHT * 0.3) {
        sandBuffer = mergeGeometries([hex, sandBuffer])
      } else if (height < MAX_HEIGHT * 0.5) {
        grassBuffer = mergeGeometries([hex, grassBuffer])
        if (Math.random() > 0.8)
          tree(scene, height, position)
      } else if (height < MAX_HEIGHT * 0.7) {
        mountainBuffer = mergeGeometries([hex, mountainBuffer])
      } else if (height < MAX_HEIGHT * 0.8) {
        rockyBuffer = mergeGeometries([hex, rockyBuffer])
      } else {
        snowBuffer = mergeGeometries([hex, snowBuffer])
      }
    }

    const noise2D = createNoise2D();

    for (let i = -10; i <= 10; i++) {
      for (let j = -10; j <= 10; j++) {
        let pos = hexPositionConverter(i, j)
        if (pos.length() > 16) continue;
        addHexToBuffer(Math.pow((noise2D(i * 0.1, j * 0.1) + 1) * .5, 1.5) * MAX_HEIGHT, pos)
      }
    }

    let sandMesh = hexMeshTexture(sandBuffer, textures.sand)
    let grassMesh = hexMeshTexture(grassBuffer, textures.grass)
    let mountainMesh = hexMeshTexture(mountainBuffer, textures.mountain)
    let rockyMesh = hexMeshTexture(rockyBuffer, textures.rocky)
    let snowMesh = hexMeshTexture(snowBuffer, textures.snow)

    // let dirtMesh = hexMeshTexture(dirt,textures.dirt)
    scene.add(sandMesh, grassBuffer, grassMesh, mountainMesh, rockyMesh, snowMesh)

    sea(scene, MAX_HEIGHT * 0.3);
    clouds(scene, MAX_HEIGHT + 1);

    const camera = initCamera(sizes, { x: 0, y: 70, z: 60 })
    scene.add(camera, MAX_HEIGHT);

    // New Renderer
    const renderer = initRenderer(sizes, canvasRef.current);

    initLight(scene, new THREE.Color("#FFCB8E"), { x: 15, y: 25, z: 15 });
    initLight(scene, new THREE.Color("#FFCB8E"), { x: -15, y: 25, z: -15 });

    // Controls
    const control = initOrbitControls(camera, canvasRef.current)

    // Create the circle
    var radius = 10;

    var plane;
    let mixer; // declare the mixer variable outside of the loader function
    const clock = new THREE.Clock();
    // Load the glTF file
    const loader = new GLTFLoader();
    loader.load('./assets/plane.glb', function (gltf) {
      // Set the position of the loaded object
      gltf.scene.position.set(10, 15, 0);

      // Get the animation mixer and clips from the glTF scene
      mixer = new THREE.AnimationMixer(gltf.scene);
      const clips = gltf.animations;

      // Play the first animation clip in the clips array on loop
      const clip = clips[0];
      const action = mixer.clipAction(clip);
      action.loop = THREE.LoopRepeat;
      action.clampWhenFinished = true;
      action.play();

      // Traverse the scene and set material properties
      gltf.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          const material = child.material;
          if (material instanceof THREE.MeshStandardMaterial) {
            material.metalness = 0;
            material.roughness = 1;
          }
        }
      });

      // Set the loaded object as the `plane` variable and add it to the scene
      plane = gltf.scene;
      scene.add(plane);
    });

    createMapFloor(MAX_HEIGHT, textures.wood, scene);

    // Window resize listener    
    window.addEventListener('resize', () => { windowResize(sizes, camera, renderer); });
    var angle = 0;
    // Render loop
    function animate() {
      camera.position.y = 60
      const deltaSeconds = clock.getDelta();
      if (mixer) {
        mixer.update(deltaSeconds);
      }
      if (plane) {
        angle += 0.005;
        var x = radius * Math.cos(angle);
        var z = radius * Math.sin(angle);
        var position = new THREE.Vector3();
        position.set(x, 15, z);
        plane.position.copy(position);
        var direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
        plane.lookAt(position.clone().add(direction));
      }

      requestAnimationFrame(animate);
      control.update();
      renderer.render(scene, camera);
    }
    animate();
    setLoaded(true);
  }, [loaded]);

  return (<canvas ref={canvasRef} />);
}

export default Model;