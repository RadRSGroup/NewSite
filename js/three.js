// Three.js Background Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('canvas-container');

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create particle system
const particleCount = 2040;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
const velocities = new Float32Array(particleCount * 3);
const opacities = new Float32Array(particleCount);
const fadeStates = new Float32Array(particleCount);
const fadeSpeeds = new Float32Array(particleCount);

// Initialize particles with dramatically enhanced depth variation
for (let i = 0; i < particleCount; i++) {
    // Random positions with dramatically increased Z-spread and stronger clustering
    const clusterChance = Math.random();
    let zCluster;
    if (clusterChance < 0.3) {
        zCluster = 6.0; // Very tight clusters
    } else if (clusterChance < 0.5) {
        zCluster = 4.0; // Tight clusters
    } else if (clusterChance < 0.7) {
        zCluster = 2.0; // Medium clusters
    } else if (clusterChance < 0.85) {
        zCluster = 1.0; // Loose clusters
    } else {
        zCluster = 0.4; // Very spread out
    }
    
    // Add XY clustering with more levels
    const xyCluster = clusterChance < 0.25 ? 0.2 : 
                     (clusterChance < 0.45 ? 0.4 : 
                     (clusterChance < 0.65 ? 0.6 : 
                     (clusterChance < 0.85 ? 0.8 : 1.0))); // Five levels of XY clustering
    
    positions[i * 3] = (Math.random() - 0.5) * 100 * xyCluster;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100 * xyCluster;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 150 * zCluster;
    
    // Initialize fade states for 35 random particles
    if (i < 35) {
        fadeStates[i] = Math.random();
        fadeSpeeds[i] = Math.random() * 0.03 + 0.015;
        opacities[i] = fadeStates[i];
    } else {
        fadeStates[i] = 1;
        fadeSpeeds[i] = 0;
        opacities[i] = 1;
    }
    
    // Random velocities with stronger Z-based variation and cluster-based movement
    const zFactor = 1 + (positions[i * 3 + 2] / 50);
    const clusterSpeed = zCluster > 3.0 ? 0.7 : (zCluster > 1.5 ? 0.85 : 1.0); // More varied cluster speeds
    velocities[i * 3] = (Math.random() - 0.5) * 0.15 * zFactor * clusterSpeed;
    velocities[i + 1] = (Math.random() - 0.5) * 0.15 * zFactor * clusterSpeed;
    velocities[i + 2] = (Math.random() - 0.5) * 0.15 * zFactor * clusterSpeed;
    
    // Enhanced color with stronger depth-based variation
    const zPos = positions[i * 3 + 2];
    const depthBrightness = 1 - (Math.abs(zPos) / 150); // Adjusted for new Z range
    const baseBrightness = Math.random() * 0.9 + 0.1; // Higher minimum brightness
    const brightness = baseBrightness * depthBrightness;
    
    // More vibrant colors with depth
    colors[i * 3] = 0.99 + brightness * 0.01; // More saturated red
    colors[i * 3 + 1] = 0.005 + brightness * 0.01; // Further reduced green
    colors[i * 3 + 2] = 0.005 + brightness * 0.01; // Further reduced blue
    
    // Dramatically enhanced size based on Z position with random variation
    const zSizeFactor = 1 + (zPos / 8); // Further reduced denominator for much stronger size variation
    const randomSizeVariation = Math.random() * 0.3 + 0.7; // Random size multiplier between 0.7 and 1.0
    const baseSize = Math.random() * 0.2 + 0.1; // Much larger base size
    sizes[i] = baseSize * zSizeFactor * randomSizeVariation; // Particles will get dramatically larger when closer with random variation
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
        const particleIndex = i / 3;
        
        // Handle fading for the first 35 particles (increased from 25)
        if (particleIndex < 35) {
            fadeStates[particleIndex] += fadeSpeeds[particleIndex];
            
            // Reset particle when fully faded
            if (fadeStates[particleIndex] <= 0) {
                fadeStates[particleIndex] = 0;
                fadeSpeeds[particleIndex] = Math.abs(fadeSpeeds[particleIndex]); // Start fading in
                // Randomize position and size when reappearing
                positions[i] = (Math.random() - 0.5) * 100;
                positions[i + 1] = (Math.random() - 0.5) * 100;
                positions[i + 2] = (Math.random() - 0.5) * 150;
                sizes[particleIndex] = Math.random() * 0.3 + 0.1; // New random size
            } else if (fadeStates[particleIndex] >= 1) {
                fadeStates[particleIndex] = 1;
                fadeSpeeds[particleIndex] = -Math.abs(fadeSpeeds[particleIndex]); // Start fading out
            }
            
            opacities[particleIndex] = fadeStates[particleIndex];
        }
        
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        // Enhanced mouse interaction with stronger parallax
        const dx = mouseX * 80 - x; // Increased range
        const dy = -mouseY * 80 - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Much stronger parallax effect based on Z position
        const parallaxFactor = 1 + (z / 6); // Further reduced from 8 for much stronger effect
        const force = (10 - dist) * 0.025 * mouseSpeed * parallaxFactor; // Further reduced force from 0.03 for even smoother movement
        
        if (dist < 10) { // Reduced interaction range
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
    const maxConnectionDistance = 5.1; // Reduced by 15% from 6
    for (let i = 0; i < positions.length; i += 3) {
        // Only draw connections for visible particles
        if (opacities[i / 3] > 0.1) {
            linePositions[i] = positions[i];
            linePositions[i + 1] = positions[i + 1];
            linePositions[i + 2] = positions[i + 2];
            
            // Only connect particles that are closer together and visible
            for (let j = i + 3; j < positions.length; j += 3) {
                if (opacities[j / 3] > 0.1) {
                    const dx = positions[i] - positions[j];
                    const dy = positions[i + 1] - positions[j + 1];
                    const dz = positions[i + 2] - positions[j + 2];
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    
                    if (distance < maxConnectionDistance) {
                        linePositions[j] = positions[j];
                        linePositions[j + 1] = positions[j + 1];
                        linePositions[j + 2] = positions[j + 2];
                    }
                }
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