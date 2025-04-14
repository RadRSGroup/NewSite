// Initialize Three.js scene
let scene, camera, renderer, particles, subtleParticles;
let mouseX = 0;
let mouseY = 0;
let isInteracting = false;
let rafId = null;

// Create scene
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement);
    }

    // Add mouse movement listener with throttling
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps

    function handleMouseMove(event) {
        const currentTime = performance.now();
        if (currentTime - lastTime >= throttleDelay) {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            lastTime = currentTime;
        }
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Add touch events with throttling
    document.addEventListener('touchstart', (event) => {
        isInteracting = true;
        const touch = event.touches[0];
        mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    document.addEventListener('touchmove', (event) => {
        if (isInteracting) {
            const touch = event.touches[0];
            mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isInteracting = false;
    }, { passive: true });
}

// Create main particles with reduced count
function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000; // Reduced from 2000
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 10;
        
        // Color - white with slight variation
        colorsArray[i] = 1.0;
        colorsArray[i + 1] = 1.0;
        colorsArray[i + 2] = 1.0;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

// Create subtle particles with reduced count
function createSubtleParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000; // Reduced from 2000
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 12;
        posArray[i + 1] = (Math.random() - 0.5) * 12;
        posArray[i + 2] = (Math.random() - 0.5) * 12;
        
        // Color - red
        colorsArray[i] = 1.0;
        colorsArray[i + 1] = 0.1;
        colorsArray[i + 2] = 0.1;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    subtleParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(subtleParticles);
}

// Animation loop with performance optimization
function animate() {
    rafId = requestAnimationFrame(animate);
    
    // Only rotate particles when interacting
    if (isInteracting) {
        if (particles) {
            particles.rotation.x += mouseY * 0.0005;
            particles.rotation.y += mouseX * 0.0005;
        }
        
        if (subtleParticles) {
            subtleParticles.rotation.x -= mouseY * 0.0003;
            subtleParticles.rotation.y -= mouseX * 0.0003;
        }
    }
    
    renderer.render(scene, camera);
}

// Handle window resize with debouncing
let resizeTimeout;
function onWindowResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 250);
}

// Cleanup function
function cleanup() {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
    if (renderer) {
        renderer.dispose();
    }
    if (scene) {
        scene.clear();
    }
}

// Initialize everything
function init() {
    initScene();
    createParticles();
    createSubtleParticles();
    animate();
    
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('beforeunload', cleanup);
}

// Start the application
init(); 