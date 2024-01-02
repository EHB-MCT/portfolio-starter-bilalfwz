import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const waterGoal = 8; // Dagelijks waterinname doel in glazen
let waterCount = 0;

// Water level UI-elementen
const progressElement = document.getElementById('progress');
const waterLevelElement = document.getElementById('waterLevel');

document.addEventListener('mousedown', onDrinkWater);

function onDrinkWater(event) {
  // Bereken genormaliseerde apparaatcoördinaten
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Zet raycaster op met muiscoördinaten
  raycaster.setFromCamera(mouse, camera);

  // Controleer op intersectie met een klikbaar object (voor toekomstige uitbreidingen)
  const intersects = raycaster.intersectObjects(scene.children);

  // Verhoog water teller en werk UI bij
  waterCount++;
  updateWaterUI();

  // Speel animatie af (breid de waterpeilbalk uit)
  expandWaterLevel();

  // Verander de kleur van het drinkglas bij elke klik
  const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  glassMaterial.color.set(randomColor);
  
  // Creëer waterdruppels die van boven vallen
  createRainDrops();
}

function updateWaterUI() {
  const percentage = (waterCount / waterGoal) * 100;
  waterLevelElement.style.width = `${percentage}%`;

  document.getElementById('info').innerText = `Waterinname: ${waterCount} / ${waterGoal} glazen`;
}

function expandWaterLevel() {
  // Animeer de uitbreiding van het waterpeil
  const currentWidth = parseFloat(getComputedStyle(waterLevelElement).width);
  const targetWidth = (waterCount / waterGoal) * 100;

  if (currentWidth < targetWidth) {
    requestAnimationFrame(expandWaterLevel);
    waterLevelElement.style.width = `${currentWidth + 0.1}%`;
  }
}

function createRainDrops() {
  const dropGeometry = new THREE.SphereGeometry(0.05, 32, 32); // Grootte van de waterdruppels
  const dropMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff });
  
  for (let i = 0; i < 10; i++) {
    const waterDrop = new THREE.Mesh(dropGeometry, dropMaterial);
    waterDrop.position.set(
      Math.random() * 2 - 1,   // x-coordinate within a range (-1 to 1)
      Math.random() * 2 - 1,   // y-coordinate within a range (-1 to 1)
      -1                       // z-coordinate at the back of the scene
    );
    scene.add(waterDrop);
    
    // Animate the water drop falling
    animateWaterDrop(waterDrop);
  }
}

function animateWaterDrop(waterDrop) {
  const fallSpeed = 0.02; // Snelheid waarmee de waterdruppels vallen
  
  function animate() {
    requestAnimationFrame(animate);
    
    // Move the water drop downwards
    waterDrop.position.y -= fallSpeed;
    
    // If the water drop reaches the bottom, remove it
    if (waterDrop.position.y < -2) {
      scene.remove(waterDrop);
    }
  }

  animate();
}

camera.position.z = 5;

const radiusTop = 1; // Top radius of the cylinder
const radiusBottom = 1; // Bottom radius of the cylinder
const height = 3; // Height of the cylinder
const radialSegments = 32; // Number of segments around the circumference

// Groep om cilinder en deksel te houden
const cylinderGroup = new THREE.Group();
scene.add(cylinderGroup);

const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
const glassMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
const glass = new THREE.Mesh(geometry, glassMaterial);
cylinderGroup.add(glass);

// Toevoegen van deksel bovenop de cilinder
const lidGeometry = new THREE.CircleGeometry(radiusTop, radialSegments);
const lidMaterial = new THREE.MeshBasicMaterial({ color: 0x3498db });
const lid = new THREE.Mesh(lidGeometry, lidMaterial);
lid.position.y = height / 2;
cylinderGroup.add(lid);

function animate() {
  requestAnimationFrame(animate);
  cylinderGroup.rotation.x += 0.01;
  cylinderGroup.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();













  
  