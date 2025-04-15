// Three.js Particle System
let scene, camera, renderer, particles;
const particleCount = 2000;

function createRoundParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    // Create soft glowing gradient with internal structure
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    // Draw main glow
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(32, 32, 32, 0, Math.PI * 2);
    context.fill();
    
    // Add internal structure
    const innerGradient = context.createRadialGradient(32, 32, 0, 32, 32, 16);
    innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    innerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = innerGradient;
    context.beginPath();
    context.arc(32, 32, 16, 0, Math.PI * 2);
    context.fill();
    
    return canvas;
}

function initParticles() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    
    // Set canvas size and position
    const canvasContainer = document.getElementById('canvas-container');
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    canvasContainer.appendChild(renderer.domElement);

    // Particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Create particles in a simple distribution
    for (let i = 0; i < particleCount; i++) {
        // Random position in a cube
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        // Lighter color scheme with subtle variations
        const baseBlue = 0.6; // Increased base blue value for lighter appearance
        const variation = Math.random() * 0.1; // Reduced variation
        colors[i * 3] = 0.3 + variation;     // R
        colors[i * 3 + 1] = 0.3 + variation; // G
        colors[i * 3 + 2] = baseBlue + variation; // B

        // Slightly varied sizes for depth
        sizes[i] = 0.1 + Math.random() * 0.05; // Reduced size
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create round particle texture
    const particleTexture = new THREE.CanvasTexture(createRoundParticleTexture());

    // Particle material with reduced opacity
    const material = new THREE.PointsMaterial({
        size: 0.1, // Reduced size
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.7, // Reduced opacity
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

function animateParticles() {
    requestAnimationFrame(animateParticles);

    // Simple rotation with subtle variation
    const time = Date.now() * 0.001;
    particles.rotation.x += 0.0005 + Math.sin(time * 0.1) * 0.0001;
    particles.rotation.y += 0.0005 + Math.cos(time * 0.1) * 0.0001;

    renderer.render(scene, camera);
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('canvas-container')) {
        initParticles();
        animateParticles();
    }
}); 