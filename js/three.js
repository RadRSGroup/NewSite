// Three.js Background Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// Initialize particles with dramatically enhanced depth variation
for (let i = 0; i < particleCount; i++) {
    // Random positions with dramatically increased Z-spread and stronger clustering
    const zCluster = Math.random() < 0.4 ? 2.5 : 0.9; // Even stronger clustering
    positions[i * 3] = (Math.random() - 0.5) * 90; // Increased spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120 * zCluster; // Further increased Z-spread
    
    // Random velocities with stronger Z-based variation
    const zFactor = 1 + (positions[i * 3 + 2] / 45); // Adjusted for new Z range
    velocities[i * 3] = (Math.random() - 0.5) * 0.25 * zFactor; // Increased base velocity
    velocities[i + 1] = (Math.random() - 0.5) * 0.25 * zFactor;
    velocities[i + 2] = (Math.random() - 0.5) * 0.25 * zFactor;
    
    // Enhanced color with stronger depth-based variation
    const zPos = positions[i * 3 + 2];
    const depthBrightness = 1 - (Math.abs(zPos) / 120); // Adjusted for new Z range
    const baseBrightness = Math.random() * 0.95 + 0.05; // Higher minimum brightness
    const brightness = baseBrightness * depthBrightness;
    
    // More vibrant colors with depth
    colors[i * 3] = 0.98 + brightness * 0.02; // More saturated red
    colors[i * 3 + 1] = 0.01 + brightness * 0.02; // Further reduced green
    colors[i * 3 + 2] = 0.01 + brightness * 0.02; // Further reduced blue
    
    // Dramatically enhanced size based on Z position
    const zSizeFactor = 1 + (zPos / 12); // Further reduced denominator for much stronger size variation
    const baseSize = Math.random() * 0.15 + 0.08; // Much larger base size
    sizes[i] = baseSize * zSizeFactor; // Particles will get dramatically larger when closer
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
    ) * 30;
    
    // Increased rotation targets by 30%
    targetRotationX = mouseY * 0.78; // Increased from 0.6 by 30%
    targetRotationY = mouseX * 0.78; // Increased from 0.6 by 30%
});

camera.position.z = 25;

function animate() {
    requestAnimationFrame(animate);
    
    // Enhanced camera movement with stronger parallax
    targetX = mouseX * 0.8; // Increased from 0.7
    targetY = mouseY * 0.8; // Increased from 0.7
    camera.position.x += (targetX - camera.position.x) * 0.035; // Slower damping
    camera.position.y += (-targetY - camera.position.y) * 0.035;
    
    // Adjusted rotation damping for smoother movement with increased sensitivity
    particleSystem.rotation.x += (targetRotationX - particleSystem.rotation.x) * 0.016; // Further reduced
    particleSystem.rotation.y += (targetRotationY - particleSystem.rotation.y) * 0.016;
    
    camera.lookAt(scene.position);
    
    const positions = particles.attributes.position.array;
    const colors = particles.attributes.color.array;
    const linePositions = lineGeometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        // Enhanced mouse interaction with stronger parallax
        const dx = mouseX * 70 - x; // Increased range
        const dy = -mouseY * 70 - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Much stronger parallax effect based on Z position
        const parallaxFactor = 1 + (z / 8); // Further reduced from 10 for much stronger effect
        const force = (12 - dist) * 0.03 * mouseSpeed * parallaxFactor; // Increased force, reduced range
        
        if (dist < 12) { // Reduced interaction range
            velocities[i] += dx * force;
            velocities[i + 1] += dy * force;
        }
        
        // Update positions with enhanced parallax
        positions[i] += velocities[i] * parallaxFactor;
        positions[i + 1] += velocities[i + 1] * parallaxFactor;
        positions[i + 2] += velocities[i + 2] * parallaxFactor;
        
        // Enhanced boundary checks with increased Z range
        if (Math.abs(positions[i]) > 45) { // Increased from 40
            positions[i] = Math.sign(positions[i]) * 45;
            velocities[i] *= -0.75; // Stronger bounce
        }
        if (Math.abs(positions[i + 1]) > 45) {
            positions[i + 1] = Math.sign(positions[i + 1]) * 45;
            velocities[i + 1] *= -0.75;
        }
        if (Math.abs(positions[i + 2]) > 60) { // Increased from 50
            positions[i + 2] = Math.sign(positions[i + 2]) * 60;
            velocities[i + 2] *= -0.75;
        }
        
        // Enhanced color based on Z position, velocity, and rotation
        const speed = Math.sqrt(
            velocities[i] * velocities[i] + 
            velocities[i + 1] * velocities[i + 1] + 
            velocities[i + 2] * velocities[i + 2]
        );
        const zBrightness = 1 - (Math.abs(z) / 120); // Adjusted for new Z range
        const rotationBrightness = 1 + Math.abs(particleSystem.rotation.y) * 1.2; // Increased rotation effect
        const brightness = Math.min(speed * 30, 1) * zBrightness * rotationBrightness; // Increased speed effect
        
        colors[i] = 0.98 + brightness * 0.02;
        colors[i + 1] = 0.01 + brightness * 0.02;
        colors[i + 2] = 0.01 + brightness * 0.02;
    }
    
    // Update line positions with reduced connection distance
    const maxConnectionDistance = 15; // Reduced from previous value
    for (let i = 0; i < positions.length; i += 3) {
        linePositions[i] = positions[i];
        linePositions[i + 1] = positions[i + 1];
        linePositions[i + 2] = positions[i + 2];
        
        // Only connect particles that are closer together
        for (let j = i + 3; j < positions.length; j += 3) {
            const dx = positions[i] - positions[j];
            const dy = positions[i + 1] - positions[j + 1];
            const dz = positions[i + 2] - positions[j + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance < maxConnectionDistance) {
                // Create connection line
                linePositions[j] = positions[j];
                linePositions[j + 1] = positions[j + 1];
                linePositions[j + 2] = positions[j + 2];
            }
        }
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