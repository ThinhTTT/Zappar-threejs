/// Zappar for ThreeJS Examples
/// Instant Tracking 3D Model

// In this example we track a 3D model using instant world tracking

import * as THREE from 'three';
import * as ZapparThree from '@zappar/zappar-threejs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const model = new URL('../assets/Letter.glb', import.meta.url).href;
import './index.css';

if (ZapparThree.browserIncompatible()) {
  ZapparThree.browserIncompatibleUI();
  throw new Error('Unsupported browser');
}

const manager = new ZapparThree.LoadingManager();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const camera = new ZapparThree.Camera();

ZapparThree.permissionRequestUI().then((granted) => {
  if (granted) camera.start();
  else ZapparThree.permissionDeniedUI();
});

ZapparThree.glContextSet(renderer.getContext());
scene.background = camera.backgroundTexture;

const instantTracker = new ZapparThree.InstantWorldTracker();
const instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, instantTracker);

scene.add(instantTrackerGroup);

const gltfLoader = new GLTFLoader(manager);

gltfLoader.load(model, (gltf) => {
  
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  instantTrackerGroup.add(gltf.scene);

}, undefined, () => {
  console.log('An error ocurred loading the GLTF model');
});

// Let's add some lighting, first a directional light above the model pointing down
const directionalLight = new THREE.DirectionalLight('white', 2);
directionalLight.position.set(5, 5, 15);
directionalLight.rotation.set(0, 0, 90);
instantTrackerGroup.add(directionalLight);

const targetImage1 = new URL('../assets/Apa/apa-1.zpt', import.meta.url).href;
const tracker1 = new ZapparThree.ImageTrackerLoader(manager).load(targetImage1);
const trackerGroup1 = new ZapparThree.ImageAnchorGroup(camera, tracker1);

const targetImage2 = new URL('../assets/Apa/apa-2.zpt', import.meta.url).href;
const tracker2 = new ZapparThree.ImageTrackerLoader(manager).load(targetImage2);
const trackerGroup2 = new ZapparThree.ImageAnchorGroup(camera, tracker2);

const targetImage3 = new URL('../assets/Apa/apa-3.zpt', import.meta.url).href;
const tracker3 = new ZapparThree.ImageTrackerLoader(manager).load(targetImage3);
const trackerGroup3 = new ZapparThree.ImageAnchorGroup(camera, tracker3);


const geometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
scene.add(trackerGroup1);
scene.add(trackerGroup2);
scene.add(trackerGroup3);

let hasPlaced = 0;
tracker1.onVisible.bind(anchor =>{
  hasPlaced = 1;
  instantTrackerGroup.setAnchorPoseFromCameraOffset(trackerGroup1.position.x, trackerGroup1.position.y, -5);
  instantTrackerGroup.visible = true;
})

tracker1.onNotVisible.bind(()=>{

  hasPlaced = 0;
  instantTrackerGroup.visible = false;
  trackerGroup1.remove(cube);
  trackerGroup1.visible = false;
})

tracker2.onVisible.bind(anchor =>{
  hasPlaced = 2;
  instantTrackerGroup.visible = true;
  instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
  instantTrackerGroup.position.copy(trackerGroup2.position);
})
tracker2.onNotVisible.bind(()=>{

  hasPlaced = 0;
  instantTrackerGroup.visible = false;
})

tracker3.onVisible.bind(anchor =>{
  hasPlaced = 3;
  instantTrackerGroup.visible = true;
  instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
  instantTrackerGroup.position.copy(trackerGroup3.position);
})
tracker3.onNotVisible.bind(()=>{

  hasPlaced = 0;
  instantTrackerGroup.visible = false;
})
// Use a fun  ction to render our scene as usual
function render() {
    // if(hasPlaced == 1){
    //   instantTrackerGroup.setAnchorPoseFromCameraOffset(trackerGroup1.position.x, trackerGroup1.position.y, -5);
    //   // instantTrackerGroup.position.copy(trackerGroup1.position);
    // }
    //  if(hasPlaced == 2){
    //   instantTrackerGroup.setAnchorPoseFromCameraOffset(trackerGroup2.position.x, trackerGroup2.position.y, -5);
    // }
    //  if(hasPlaced == 3){
    //   instantTrackerGroup.setAnchorPoseFromCameraOffset(trackerGroup3.position.x, trackerGroup3.position.y, -5);
    // }
  
  // The Zappar camera must have updateFrame called every frame
  camera.updateFrame(renderer);

  // Draw the ThreeJS scene in the usual way, but using the Zappar camera
  renderer.render(scene, camera);

  // Call render() again next frame
  requestAnimationFrame(render);
}

// // Start things off
render();
