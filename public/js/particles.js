// Three.js Particle System
let scene, camera, renderer, particles;
const particleCount = 2000;

function createRoundParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    // Create sharper gradient
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    // Draw circle with sharper edges
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(32, 32, 32, 0, Math.PI * 2);
    context.fill();
    
    return canvas;
}

function initParticles() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    
    // Set canvas size and position
    const canvasContainer = document.getElementById('canvas-container');
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    // Particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Create particles in a simple distribution
    for (let i = 0; i < particleCount; i++) {
        // Random position in a cube
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        // Color gradient from pink (top-left) to blue (bottom-right)
        const normalizedX = positions[i * 3] / 5 + 0.5; // Normalize to 0-1
        const normalizedY = positions[i * 3 + 1] / 5 + 0.5; // Normalize to 0-1
        
        // Pink color (1.0, 0.2, 0.5)
        // Blue color (0.1, 0.1, 0.3)
        colors[i * 3] = 1.0 - (normalizedX + normalizedY) * 0.45; // Red
        colors[i * 3 + 1] = 0.2 - (normalizedX + normalizedY) * 0.05; // Green
        colors[i * 3 + 2] = 0.5 - (normalizedX + normalizedY) * 0.1; // Blue
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create round particle texture
    const particleTexture = new THREE.CanvasTexture(createRoundParticleTexture());

    // Particle material with sprite texture
    const material = new THREE.PointsMaterial({
        size: 0.15,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    // Create particles
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Camera position
    camera.position.z = 5;
}

function onWindowResize() {
    const canvasContainer = document.getElementById('canvas-container');
    camera.aspect = canvasContainer.offsetWidth / canvasContainer.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
}

function animateParticles() {
    requestAnimationFrame(animateParticles);

    // Simple rotation
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('canvas-container')) {
        initParticles();
        animateParticles();
    }
}); 