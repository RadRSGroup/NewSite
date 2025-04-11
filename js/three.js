// Three.js Background Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('canvas-container');

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create particle system
const particleCount = 2000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
const velocities = new Float32Array(particleCount * 3);

// Initialize particles with increased Z-spread
for (let i = 0; i < particleCount; i++) {
    // Random positions in a larger space with increased Z-spread
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // Increased from 20 to 30
    
    // Random velocities
    velocities[i * 3] = (Math.random() - 0.5) * 0.1;
    velocities[i + 1] = (Math.random() - 0.5) * 0.1;
    velocities[i + 2] = (Math.random() - 0.5) * 0.1;
    
    // Red star colors with varying brightness
    const brightness = Math.random() * 0.7 + 0.3;
    colors[i * 3] = 0.8 + brightness * 0.2;
    colors[i * 3 + 1] = 0.1 + brightness * 0.1;
    colors[i * 3 + 2] = 0.1 + brightness * 0.1;
    
    // Size based on Z position for depth effect
    const zPos = positions[i * 3 + 2];
    sizes[i] = Math.random() * 0.05 + 0.02 + (zPos / 100); // Size increases with Z position
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.9, // Increased opacity
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Create line geometry for connections
const lineGeometry = new THREE.BufferGeometry();
const linePositions = new Float32Array(particleCount * 3);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff, // Changed from 0xff0000 (red) to 0xffffff (white)
    transparent: true,
    opacity: 0.1 // Keeping the subtle opacity
});

const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lineSystem);

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let mouseSpeed = 0;

document.addEventListener('mousemove', (event) => {
    const prevMouseX = mouseX;
    const prevMouseY = mouseY;
    mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
    mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
    mouseSpeed = Math.sqrt(
        Math.pow(mouseX - prevMouseX, 2) + 
        Math.pow(mouseY - prevMouseY, 2)
    ) * 20;
});

camera.position.z = 25;

function animate() {
    requestAnimationFrame(animate);
    
    // Enhanced camera movement with parallax
    targetX = mouseX * 0.3; // Increased from 0.2
    targetY = mouseY * 0.3; // Increased from 0.2
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    const positions = particles.attributes.position.array;
    const colors = particles.attributes.color.array;
    const linePositions = lineGeometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
        const time = Date.now() * 0.001;
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        // Enhanced mouse interaction with parallax
        const dx = mouseX * 40 - x;
        const dy = -mouseY * 40 - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Parallax effect based on Z position
        const parallaxFactor = 1 + (z / 30); // Particles further back move less
        const force = (10 - dist) * 0.01 * mouseSpeed * parallaxFactor;
        
        if (dist < 10) {
            velocities[i] += dx * force;
            velocities[i + 1] += dy * force;
        }
        
        // Update positions with velocity and parallax
        positions[i] += velocities[i] * parallaxFactor;
        positions[i + 1] += velocities[i + 1] * parallaxFactor;
        positions[i + 2] += velocities[i + 2] * parallaxFactor;
        
        // Enhanced boundary checks with Z consideration
        if (Math.abs(positions[i]) > 20) {
            positions[i] = Math.sign(positions[i]) * 20;
            velocities[i] *= -0.5;
        }
        if (Math.abs(positions[i + 1]) > 20) {
            positions[i + 1] = Math.sign(positions[i + 1]) * 20;
            velocities[i + 1] *= -0.5;
        }
        if (Math.abs(positions[i + 2]) > 15) { // Increased from 10 to 15
            positions[i + 2] = Math.sign(positions[i + 2]) * 15;
            velocities[i + 2] *= -0.5;
        }
        
        // Enhanced color based on Z position and velocity
        const speed = Math.sqrt(
            velocities[i] * velocities[i] + 
            velocities[i + 1] * velocities[i + 1] + 
            velocities[i + 2] * velocities[i + 2]
        );
        const zBrightness = 1 - (Math.abs(z) / 30); // Brighter when closer
        const brightness = Math.min(speed * 15, 1) * zBrightness;
        colors[i] = 0.8 + brightness * 0.2;
        colors[i + 1] = 0.1 + brightness * 0.1;
        colors[i + 2] = 0.1 + brightness * 0.1;
    }
    
    // Update line positions
    for (let i = 0; i < positions.length; i += 3) {
        linePositions[i] = positions[i];
        linePositions[i + 1] = positions[i + 1];
        linePositions[i + 2] = positions[i + 2];
    }
    
    particles.attributes.position.needsUpdate = true;
    particles.attributes.color.needsUpdate = true;
    lineGeometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();