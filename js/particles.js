// Enhanced Three.js Particle System with Windows compatibility
let scene, camera, renderer, particles;

function detectWindowsAndAdjustSettings() {
    const isWindows = navigator.userAgent.includes('Windows');
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    
    return {
        particleCount: 4000,
        pixelRatio: isWindows ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2),
        antialias: !isWindows || window.devicePixelRatio < 2,
        powerPreference: isWindows ? 'default' : 'high-performance',
        enableOptimizations: isWindows
    };
}

function createOptimizedParticleTexture() {
    const canvas = document.createElement('canvas');
    const size = 64; // Higher resolution for sharper particles
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    // Enable crisp rendering
    context.imageSmoothingEnabled = false;
    
    // Sharp core gradient
    const gradient = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/3);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(size/2, size/2, size/3, 0, Math.PI * 2);
    context.fill();
    
    // Contrasting glow - warm orange/gold to contrast dark gradient background
    const glowGradient = context.createRadialGradient(size/2, size/2, size/4, size/2, size/2, size/2);
    glowGradient.addColorStop(0, 'rgba(255, 180, 100, 0.4)'); // Warm orange
    glowGradient.addColorStop(0.6, 'rgba(255, 140, 60, 0.2)'); // Deeper orange
    glowGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    
    context.globalCompositeOperation = 'screen';
    context.fillStyle = glowGradient;
    context.beginPath();
    context.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = 'source-over';
    
    return canvas;
}

function initParticles() {
    const settings = detectWindowsAndAdjustSettings();
    
    // Force hardware acceleration detection
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    const debugInfo = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Renderer with Windows-optimized settings
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: settings.antialias,
        powerPreference: settings.powerPreference,
        precision: 'mediump', // Use medium precision for better Windows compatibility
        stencil: false,
        depth: true,
        premultipliedAlpha: false
    });
    
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) return;
    
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.setPixelRatio(settings.pixelRatio);
    renderer.setClearColor(0x000000, 0);
    
    // Force canvas image rendering settings for Windows
    const canvas = renderer.domElement;
    canvas.style.imageRendering = 'auto';
    canvas.style.imageRendering = '-webkit-optimize-contrast';
    
    // Force hardware acceleration
    if (settings.enableOptimizations) {
        canvas.style.transform = 'translateZ(0)';
        canvas.style.willChange = 'transform';
    }
    
    canvasContainer.appendChild(canvas);

    // Optimized particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(settings.particleCount * 3);
    const colors = new Float32Array(settings.particleCount * 3);
    const sizes = new Float32Array(settings.particleCount);

    // Initialize particle rotations and sparkle states
    particleRotations = [];
    sparkleStates = [];
    
    // Create particles with better distribution
    for (let i = 0; i < settings.particleCount; i++) {
        // Initialize individual particle rotation
        particleRotations.push({
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * 2,
            speedX: (Math.random() - 0.5) * 0.008,
            speedY: (Math.random() - 0.5) * 0.008,
            speedZ: (Math.random() - 0.5) * 0.008
        });
        
        // Initialize sparkle state
        sparkleStates.push({
            isSparkle: Math.random() > 0.9, // 10% chance to be sparkle
            fadePhase: Math.random() * Math.PI * 2,
            fadeSpeed: 0.02 + Math.random() * 0.03,
            intensity: 0,
            maxIntensity: 0.8 + Math.random() * 0.4
        });
        // Use a more structured distribution for better visual consistency
        const phi = Math.acos(-1 + (2 * i) / settings.particleCount);
        const theta = Math.sqrt(settings.particleCount * Math.PI) * phi;
        
        const radius = 9.5 + Math.random() * 3; // Increased radius for better space visibility
        positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
        positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Enhanced blue spectrum with minimal white
        const colorPhase = i / settings.particleCount * Math.PI * 2;
        const variation = Math.random() * 0.15;
        colors[i * 3] = 0.1 + Math.sin(colorPhase) * 0.2 + variation;     // R - low red
        colors[i * 3 + 1] = 0.3 + Math.cos(colorPhase) * 0.3 + variation; // G - moderate green
        colors[i * 3 + 2] = 0.8 + Math.sin(colorPhase + 1) * 0.2 + variation; // B - high blue

        // Varied sizes with minimum threshold
        // Increased size distribution with sparkle sizing
        const sizeVariation = Math.random();
        if (sizeVariation > 0.95) {
            sizes[i] = 0.25 + Math.random() * 0.15; // Large sparkles
        } else if (sizeVariation > 0.85) {
            sizes[i] = 0.18 + Math.random() * 0.08; // Medium particles
        } else {
            sizes[i] = Math.max(0.04, 0.08 + Math.random() * 0.08); // Small particles
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create optimized texture with glow
    const particleTexture = new THREE.CanvasTexture(createOptimizedParticleTexture());
    particleTexture.generateMipmaps = false;
    particleTexture.minFilter = THREE.LinearFilter;
    particleTexture.magFilter = THREE.LinearFilter;

    // Optimized material
    const material = new THREE.PointsMaterial({
        size: 0.12,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        alphaTest: 0.001 // Helps with rendering artifacts on some Windows systems
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 15; // Move camera back for larger view
}

// Throttled animation for better Windows performance
let animationId;
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// Particle rotation and sparkle tracking
let particleRotations = [];
let sparkleStates = [];

function animateParticles(currentTime) {
    animationId = requestAnimationFrame(animateParticles);

    // Throttle frame rate on Windows for smoother performance
    if (currentTime - lastFrameTime < frameInterval) {
        return;
    }
    lastFrameTime = currentTime;

    if (!particles) return;

    // Slower, gentler swirl rotation
    const time = currentTime * 0.0002; // Slower time scale
    particles.rotation.x += 0.0008; // Gentle continuous X rotation
    particles.rotation.y += 0.0012; // Slightly faster Y rotation for swirl
    particles.rotation.z = Math.cos(time * 0.2) * 0.02; // Reduced Z oscillation

    // Enhanced particle movement with individual rotations
    const positions = particles.geometry.attributes.position.array;
    const colors = particles.geometry.attributes.color.array;
    const settings = detectWindowsAndAdjustSettings();
    const step = 3; // Process every particle for full effect
    
    for (let i = 0; i < positions.length; i += step) {
        const particleIndex = i / 3;
        if (particleIndex >= particleRotations.length) continue;
        
        const rotation = particleRotations[particleIndex];
        
        // Update individual particle rotations
        rotation.x += rotation.speedX;
        rotation.y += rotation.speedY;
        rotation.z += rotation.speedZ;
        
        // Gentler wave movement with rotation influence
        const waveX = Math.sin(time + rotation.x) * 0.002;
        const waveY = Math.cos(time + rotation.y) * 0.002;
        const waveZ = Math.sin(time * 0.5 + rotation.z) * 0.001;
        
        positions[i] += waveX;
        positions[i + 1] += waveY;
        positions[i + 2] += waveZ;
        
        // Sparkle effect with fade-in/fade-out
        const sparkle = sparkleStates[particleIndex];
        if (sparkle.isSparkle) {
            sparkle.fadePhase += sparkle.fadeSpeed;
            sparkle.intensity = Math.sin(sparkle.fadePhase) * sparkle.maxIntensity;
            
            // Reset sparkle cycle
            if (sparkle.fadePhase > Math.PI * 2) {
                sparkle.fadePhase = 0;
                sparkle.isSparkle = Math.random() > 0.85; // Chance to continue sparkling
            }
        } else {
            sparkle.intensity *= 0.95; // Fade out non-sparkles
            if (Math.random() > 0.998) sparkle.isSparkle = true; // Random sparkle activation
        }
        
        // Color transitions with contrasting glow and sparkle
        const colorPhase = time * 0.2 + rotation.x + rotation.y;
        const baseGlow = Math.sin(time * 0.3 + particleIndex * 0.1) * 0.15 + 0.85;
        const sparkleBoost = 1 + sparkle.intensity * 2;
        
        // Warm contrasting colors (orange/gold) mixed with blue base
        const warmContrast = sparkle.intensity * 0.6;
        colors[i] = ((0.1 + Math.sin(colorPhase) * 0.15) * baseGlow + warmContrast) * sparkleBoost;         // R
        colors[i + 1] = ((0.3 + Math.cos(colorPhase + 1) * 0.2) * baseGlow + warmContrast * 0.7) * sparkleBoost; // G
        colors[i + 2] = ((0.75 + Math.sin(colorPhase + 2) * 0.2) * baseGlow - warmContrast * 0.3) * sparkleBoost; // B
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
}

// Handle window resize with debouncing
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const container = document.getElementById('canvas-container');
        if (!container || !camera || !renderer) return;
        
        const containerRect = container.getBoundingClientRect();
        
        camera.aspect = containerRect.width / containerRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRect.width, containerRect.height, false);
    }, 250);
}

// Cleanup function
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (renderer) {
        renderer.dispose();
    }
    if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('canvas-container')) {
        initParticles();
        animateParticles(0);
        
        window.addEventListener('resize', handleResize);
        window.addEventListener('beforeunload', cleanup);
    }
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    } else {
        animateParticles(0);
    }
});