// Initialize Three.js scene
let scene, camera, renderer, particles;

// Create scene only when needed
function initScene() {
    // Create scene
    scene = new THREE.Scene();
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    
    // Setup renderer with alpha
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Add to container
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement);
    }
}

// Create particles with optimized geometry
function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 5000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
        
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Optimized animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0001;
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
    // Defer initialization slightly to prioritize critical content
    requestAnimationFrame(() => {
        initScene();
        createParticles();
        animate();
        
        // Add resize listener
        window.addEventListener('resize', handleResize, { passive: true });
    });
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (renderer) {
        renderer.dispose();
    }
    if (geometry) {
        geometry.dispose();
    }
    if (material) {
        material.dispose();
    }
});