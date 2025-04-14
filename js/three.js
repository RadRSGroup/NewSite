// Initialize Three.js scene
let scene, camera, renderer, particles, lineSystem;
let mouseX = 0;
let mouseY = 0;
let mouseWorldPosition = new THREE.Vector3();

// Create scene only when needed
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement);
    }

    // Add mouse movement listener
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseWorldPosition.set(mouseX * 5, mouseY * 5, 0);
    });
}

// Create particles with optimized geometry
function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const sizesArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount; i++) {
        // Position
        const i3 = i * 3;
        posArray[i3] = (Math.random() - 0.5) * 10;
        posArray[i3 + 1] = (Math.random() - 0.5) * 10;
        posArray[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Color - Set all particles to bright white
        colorsArray[i3] = 1.0;     // R
        colorsArray[i3 + 1] = 1.0; // G
        colorsArray[i3 + 2] = 1.0; // B

        // Size - Make particles smaller
        sizesArray[i] = Math.random() * 0.005;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create line system
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        linewidth: 2
    });
    lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);
}

// Optimized animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        // Rotate particles
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
        
        // Mouse interaction
        particles.rotation.x += mouseY * 0.0005;
        particles.rotation.y += mouseX * 0.0005;
        
        // Update particle positions
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * 0.001;
            positions[i + 1] += (Math.random() - 0.5) * 0.001;
            positions[i + 2] += (Math.random() - 0.5) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Update line connections
        const linePositions = [];
        const maxConnections = 30;
        const connectionDistance = 0.8;
        const mouseInfluenceRadius = 2.0;

        // Find particles near mouse
        const nearbyParticles = [];
        for (let i = 0; i < positions.length; i += 3) {
            const particlePos = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            );
            const distanceToMouse = particlePos.distanceTo(mouseWorldPosition);
            if (distanceToMouse < mouseInfluenceRadius) {
                nearbyParticles.push({
                    position: particlePos,
                    index: i
                });
            }
        }

        // Create connections between nearby particles
        for (let i = 0; i < nearbyParticles.length; i++) {
            const particle1 = nearbyParticles[i];
            let connections = 0;
            
            for (let j = i + 1; j < nearbyParticles.length && connections < maxConnections; j++) {
                const particle2 = nearbyParticles[j];
                const distance = particle1.position.distanceTo(particle2.position);
                
                if (distance < connectionDistance) {
                    linePositions.push(
                        particle1.position.x, particle1.position.y, particle1.position.z,
                        particle2.position.x, particle2.position.y, particle2.position.z
                    );
                    connections++;
                }
            }
        }

        // Update line geometry
        lineSystem.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    renderer.render(scene, camera);
}

// Efficient resize handler
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize only when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initScene();
    createParticles();
    animate();
    
    // Add resize listener
    window.addEventListener('resize', handleResize, { passive: true });
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (renderer) {
        renderer.dispose();
    }
    if (particles && particles.geometry) {
        particles.geometry.dispose();
    }
    if (lineSystem && lineSystem.geometry) {
        lineSystem.geometry.dispose();
    }
});