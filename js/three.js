// Three.js Background Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// Initialize particles with enhanced depth variation
for (let i = 0; i < particleCount; i++) {
    // Random positions with significantly increased Z-spread and stronger clustering
    const zCluster = Math.random() < 0.4 ? 1.5 : 0.7; // Stronger clustering
    positions[i * 3] = (Math.random() - 0.5) * 60; // Increased spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 70 * zCluster; // Significantly increased Z-spread
    
    // Random velocities with stronger Z-based variation
    const zFactor = 1 + (positions[i * 3 + 2] / 35); // Adjusted for new Z range
    velocities[i * 3] = (Math.random() - 0.5) * 0.15 * zFactor;
    velocities[i + 1] = (Math.random() - 0.5) * 0.15 * zFactor;
    velocities[i + 2] = (Math.random() - 0.5) * 0.15 * zFactor;
    
    // Enhanced color with stronger depth-based variation
    const zPos = positions[i * 3 + 2];
    const depthBrightness = 1 - (Math.abs(zPos) / 70); // Adjusted for new Z range
    const baseBrightness = Math.random() * 0.8 + 0.2;
    const brightness = baseBrightness * depthBrightness;
    
    // More vibrant colors with depth
    colors[i * 3] = 0.9 + brightness * 0.1;
    colors[i * 3 + 1] = 0.05 + brightness * 0.05;
    colors[i * 3 + 2] = 0.05 + brightness * 0.05;
    
    // Dramatically enhanced size based on Z position
    const zSizeFactor = 1 + (zPos / 20); // Reduced denominator for stronger size variation
    const baseSize = Math.random() * 0.08 + 0.04; // Increased base size
    sizes[i] = baseSize * zSizeFactor; // Particles will get much larger when closer
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
let targetRotationX = 0;
let targetRotationY = 0;
let mouseSpeed = 0;

document.addEventListener('mousemove', (event) => {
    const prevMouseX = mouseX;
    const prevMouseY = mouseY;
    mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
    mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
    mouseSpeed = Math.sqrt(
        Math.pow(mouseX - prevMouseX, 2) + 
        Math.pow(mouseY - prevMouseY, 2)
    ) * 30; // Increased from 25 to 30
    
    // Further increased rotation targets based on mouse position
    targetRotationX = mouseY * 0.6; // Increased from 0.4 to 0.6
    targetRotationY = mouseX * 0.6; // Increased from 0.4 to 0.6
});

camera.position.z = 25;

function animate() {
    requestAnimationFrame(animate);
    
    // Enhanced camera movement with stronger parallax
    targetX = mouseX * 0.6; // Increased from 0.5 to 0.6
    targetY = mouseY * 0.6; // Increased from 0.5 to 0.6
    camera.position.x += (targetX - camera.position.x) * 0.05; // Slightly reduced from 0.06 for smoother movement
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    
    // Enhanced rotation based on mouse position with smoother damping
    particleSystem.rotation.x += (targetRotationX - particleSystem.rotation.x) * 0.025; // Reduced from 0.03 for smoother rotation
    particleSystem.rotation.y += (targetRotationY - particleSystem.rotation.y) * 0.025;
    
    camera.lookAt(scene.position);
    
    const positions = particles.attributes.position.array;
    const colors = particles.attributes.color.array;
    const linePositions = lineGeometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        // Enhanced mouse interaction with stronger parallax
        const dx = mouseX * 50 - x; // Increased range
        const dy = -mouseY * 50 - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Stronger parallax effect based on Z position
        const parallaxFactor = 1 + (z / 15); // Increased from 20 to 15 for stronger effect
        const force = (12 - dist) * 0.02 * mouseSpeed * parallaxFactor; // Increased force and range
        
        if (dist < 12) { // Increased interaction range
            velocities[i] += dx * force;
            velocities[i + 1] += dy * force;
        }
        
        // Update positions with enhanced parallax
        positions[i] += velocities[i] * parallaxFactor;
        positions[i + 1] += velocities[i + 1] * parallaxFactor;
        positions[i + 2] += velocities[i + 2] * parallaxFactor;
        
        // Enhanced boundary checks with increased Z range
        if (Math.abs(positions[i]) > 30) { // Increased from 25
            positions[i] = Math.sign(positions[i]) * 30;
            velocities[i] *= -0.6;
        }
        if (Math.abs(positions[i + 1]) > 30) {
            positions[i + 1] = Math.sign(positions[i + 1]) * 30;
            velocities[i + 1] *= -0.6;
        }
        if (Math.abs(positions[i + 2]) > 35) { // Increased from 25 to 35
            positions[i + 2] = Math.sign(positions[i + 2]) * 35;
            velocities[i + 2] *= -0.6;
        }
        
        // Enhanced color based on Z position, velocity, and rotation
        const speed = Math.sqrt(
            velocities[i] * velocities[i] + 
            velocities[i + 1] * velocities[i + 1] + 
            velocities[i + 2] * velocities[i + 2]
        );
        const zBrightness = 1 - (Math.abs(z) / 70); // Adjusted for new Z range
        const rotationBrightness = 1 + Math.abs(particleSystem.rotation.y) * 0.8; // Increased rotation effect
        const brightness = Math.min(speed * 20, 1) * zBrightness * rotationBrightness; // Increased speed effect
        
        colors[i] = 0.9 + brightness * 0.1;
        colors[i + 1] = 0.05 + brightness * 0.05;
        colors[i + 2] = 0.05 + brightness * 0.05;
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