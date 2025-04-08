// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('canvas-container');

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x050826, 1);
container.appendChild(renderer.domElement);

// Create multiple particle systems
function createParticleSystem(color, size, count, spread) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * spread;
        positions[i + 1] = (Math.random() - 0.5) * spread;
        positions[i + 2] = (Math.random() - 0.5) * spread;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        size: size,
        color: color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    return new THREE.Points(geometry, material);
}

// Create three particle systems with different properties
const particleSystem1 = createParticleSystem(0xe31837, 0.02, 1000, 10); // Red particles
const particleSystem2 = createParticleSystem(0xffffff, 0.015, 1500, 8); // White particles
const particleSystem3 = createParticleSystem(0x0a0f4c, 0.025, 500, 12); // Blue particles

scene.add(particleSystem1);
scene.add(particleSystem2);
scene.add(particleSystem3);

camera.position.z = 5;

// Mouse interaction for parallax effect
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
    mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Smooth camera movement
    targetX = mouseX * 0.2;
    targetY = mouseY * 0.2;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Rotate particle systems at different speeds
    particleSystem1.rotation.y += 0.0003;
    particleSystem1.rotation.x += 0.0002;
    
    particleSystem2.rotation.y -= 0.0004;
    particleSystem2.rotation.x -= 0.0003;
    
    particleSystem3.rotation.y += 0.0005;
    particleSystem3.rotation.z += 0.0002;

    // Pulse effect
    const time = Date.now() * 0.001;
    particleSystem1.material.opacity = 0.4 + Math.sin(time) * 0.2;
    particleSystem2.material.opacity = 0.4 + Math.cos(time * 0.5) * 0.2;
    particleSystem3.material.opacity = 0.4 + Math.sin(time * 0.8) * 0.2;

    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Start animation
animate(); 