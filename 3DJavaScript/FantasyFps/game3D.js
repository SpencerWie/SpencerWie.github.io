import * as THREE from 'three';

import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer, controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let isSprinting = false;
let canJump = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

const JumpPower = 15;
const mapShadowSize = 2048 * 2

export function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 2;

  scene = new THREE.Scene();

  scene.add(new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ));
  scene.add(new THREE.AmbientLight( 0xffffff, 0.6 ));

  const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( - 1, 2.75, 5 );
  dirLight.position.multiplyScalar( 30 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.far = 300; 
  dirLight.shadow.mapSize.width = mapShadowSize;
  dirLight.shadow.mapSize.height = mapShadowSize;
  dirLight.shadow.camera.left *= 10;
  dirLight.shadow.camera.right *= 10;
  dirLight.shadow.camera.top *= 10;
  dirLight.shadow.camera.bottom *= 10;
  dirLight.shadow.bias = -0.001;
  scene.add( dirLight );
  
  // const helper = new THREE.CameraHelper( dirLight.shadow.camera );
  // scene.add( helper );

  const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize(vWorldPosition + offset).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
  `;

  const uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 }
  };

  const skyGeo = new THREE.SphereGeometry(400, 32, 15);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.BackSide
  });

  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
  floorGeometry.rotateX(-Math.PI / 2);
  const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  scene.add(floor);

  let loader = new GLTFLoader();
  loader.load('../assets/fantasy_free_cust.glb', function (gltf) {
    const fantasyFree = gltf.scene;
    fantasyFree.traverse(function (item) {
      if (item.isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    fantasyFree.position.set(0, 0, -10);
    scene.add(fantasyFree);
    const tree = fantasyFree.getObjectByName('tree_001')
    const firTree = fantasyFree.getObjectByName('fir_001');
    if (tree && firTree) {
      for (let i = 0; i < 20; i++) {
      const clone = i > 9 ? tree.clone() : firTree.clone();
      clone.position.set(
        Math.random() * 100 - 50,
        0,
        Math.random() * 100 - 50
      );
      scene.add(clone);
      }
    }
  });

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);

  document.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  });

  controls.addEventListener('unlock', () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  });

  scene.add(controls.object);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
  switch (event.code) {
    case 'KeyW':
      moveForward = true;
      break;
    case 'KeyA':
      moveLeft = true;
      break;
    case 'KeyS':
      moveBackward = true;
      break;
    case 'KeyD':
      moveRight = true;
      break;
    case 'ShiftLeft':
      isSprinting = true;
      break;
    case 'Space':
      if(canJump) velocity.y += JumpPower;
      canJump = false;
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'KeyW':
      moveForward = false;
      break;
    case 'KeyA':
      moveLeft = false;
      break;
    case 'KeyS':
      moveBackward = false;
      break;
    case 'KeyD':
      moveRight = false;
      break;
    case 'ShiftLeft':
      isSprinting = false;
      break;
  }
}

export function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 5.0 * delta;

  direction.z = moveForward - moveBackward;
  direction.x = moveLeft - moveRight;
  direction.normalize();

  let movementSpeed = 40.0;
  if(isSprinting) movementSpeed = 80.0;

  if (moveForward || moveBackward) velocity.z -= direction.z * movementSpeed * delta;
  if (moveLeft || moveRight) velocity.x += direction.x * movementSpeed * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  controls.object.position.y += (velocity.y * delta);

  if (controls.object.position.y < 1) {
    velocity.y = 0;
    controls.object.position.y = 1;
    canJump = true;
  }

  prevTime = time;

  renderer.render(scene, camera);
}