// Three.js Particle Animation with Windows optimizations
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Three.js particle system...');
    
    // Windows detection and optimization settings
    const isWindows = navigator.userAgent.includes('Windows');
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;
    const hasDiscreteGPU = checkForDiscreteGPU();
    
    // Adjust settings based on platform and hardware
    const settings = {
        particlesCount: isWindows ? (isLowEndDevice ? 2500 : 3500) : 5000,
        maxConnections: isWindows ? 20 : 30,
        connectionDistance: isWindows ? 0.6 : 0.8,
        mouseInfluenceRadius: isWindows ? 1.5 : 2.0,
        animationSpeed: isWindows ? 0.0003 : 0.0005,
        pixelRatio: isWindows ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2)
    };
    
    console.log('Platform detected:', isWindows ? 'Windows' : 'Other', 'Settings:', settings);
    
    function checkForDiscreteGPU() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return false;
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (!debugInfo) return false;
            
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
            return renderer.includes('nvidia') || renderer.includes('amd') || renderer.includes('radeon');
        } catch (e) {
            return false;
        }
    }

    // Initialize principle cards with animation delays
    const principleCards = document.querySelectorAll('.principle-card');
    principleCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        
        // Windows optimization
        if (isWindows) {
            card.style.transform = 'translateZ(0)';
            card.style.willChange = 'transform';
        }
    });

    // Initialize project cards with animation delays
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        
        // Windows optimization
        if (isWindows) {
            card.style.transform = 'translateZ(0)';
            card.style.willChange = 'transform';
        }
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: !isWindows || hasDiscreteGPU, // Disable antialiasing on Windows integrated graphics
        powerPreference: isWindows ? 'default' : 'high-performance',
        precision: isWindows ? 'mediump' : 'highp',
        stencil: false,
        premultipliedAlpha: false
    });
    
    // Get the canvas container
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Canvas container not found');
        return;
    }
    
    // Function to update sizes
    function updateSize() {
        const containerRect = container.getBoundingClientRect();
        camera.aspect = containerRect.width / containerRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRect.width, containerRect.height, false);
    }
    
    // Initial size setup with Windows optimization
    updateSize();
    renderer.setPixelRatio(settings.pixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Set canvas style with Windows optimizations
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    
    // Windows-specific canvas optimizations
    if (isWindows) {
        canvas.style.transform = 'translateZ(0)';
        canvas.style.willChange = 'transform';
        canvas.style.backfaceVisibility = 'hidden';
        canvas.style.imageRendering = 'auto';
        canvas.style.imageRendering = '-webkit-optimize-contrast';
        console.log('Applied Windows canvas optimizations');
    }

    // Create particles with optimized count
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(settings.particlesCount * 3);
    const colorsArray = new Float32Array(settings.particlesCount * 3);
    const sizesArray = new Float32Array(settings.particlesCount);

    console.log(`Creating ${settings.particlesCount} particles...`);

    for (let i = 0; i < settings.particlesCount; i++) {
        // Position - more structured distribution for better performance
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 3 + Math.random() * 7;
        
        posArray[i3] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i3 + 2] = radius * Math.cos(phi);

        // Color - Enhanced brightness for better visibility on Windows
        const brightness = isWindows ? 1.0 : 0.9;
        colorsArray[i3] = brightness;     // R
        colorsArray[i3 + 1] = brightness; // G
        colorsArray[i3 + 2] = brightness; // B

        // Size - Slightly larger on Windows for better visibility
        sizesArray[i] = isWindows ? 
            Math.random() * 0.008 + 0.002 : 
            Math.random() * 0.005;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        size: isWindows ? 0.008 : 0.005,
        vertexColors: true,
        transparent: true,
        opacity: isWindows ? 0.9 : 1.0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        alphaTest: isWindows ? 0.001 : 0 // Helps with rendering artifacts on Windows
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create line system with Windows optimization
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: isWindows ? 0.6 : 0.8, // Slightly more transparent on Windows
        blending: THREE.AdditiveBlending,
        linewidth: 1 // Force linewidth to 1 for Windows compatibility
    });
    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    camera.position.z = 5;

    // Mouse movement effect with Windows optimization
    let mouseX = 0;
    let mouseY = 0;
    let mouseWorldPosition = new THREE.Vector3();
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Initialize mouse position to center of screen
    mouseX = 0;
    mouseY = 0;
    mouseWorldPosition.set(0, 0, 0);

    document.addEventListener('mousemove', (event) => {
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation with Windows optimization
    let animationId;
    let lastFrameTime = 0;
    const targetFPS = isWindows ? (isLowEndDevice ? 30 : 45) : 60;
    const frameInterval = 1000 / targetFPS;
    
    function animate(currentTime) {
        animationId = requestAnimationFrame(animate);
        
        // Frame rate limiting for Windows
        if (isWindows && currentTime - lastFrameTime < frameInterval) {
            return;
        }
        lastFrameTime = currentTime;
        
        // Smooth mouse interpolation (reduced on Windows)
        const lerpFactor = isWindows ? 0.03 : 0.05;
        mouseX += (targetMouseX - mouseX) * lerpFactor;
        mouseY += (targetMouseY - mouseY) * lerpFactor;
        mouseWorldPosition.set(mouseX * 5, mouseY * 5, 0);
        
        // Rotate particles with Windows optimization
        particlesMesh.rotation.x += settings.animationSpeed;
        particlesMesh.rotation.y += settings.animationSpeed;
        
        // Mouse interaction (reduced on Windows)
        const mouseInfluence = isWindows ? 0.0003 : 0.0005;
        particlesMesh.rotation.x += mouseY * mouseInfluence;
        particlesMesh.rotation.y += mouseX * mouseInfluence;
        
        // Update particle positions (less frequent on Windows)
        const positions = particlesGeometry.attributes.position.array;
        const updateStep = isWindows ? 6 : 3; // Update fewer particles on Windows
        
        for (let i = 0; i < positions.length; i += updateStep) {
            const movement = isWindows ? 0.0005 : 0.001;
            positions[i] += (Math.random() - 0.5) * movement;
            positions[i + 1] += (Math.random() - 0.5) * movement;
            positions[i + 2] += (Math.random() - 0.5) * movement;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Update line connections with Windows optimization
        const linePositions = [];
        const nearbyParticles = [];
        
        // Find particles near mouse (fewer calculations on Windows)
        const checkStep = isWindows ? 9 : 3;
        for (let i = 0; i < positions.length; i += checkStep) {
            const particlePos = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            );
            const distanceToMouse = particlePos.distanceTo(mouseWorldPosition);
            if (distanceToMouse < settings.mouseInfluenceRadius) {
                nearbyParticles.push({
                    position: particlePos,
                    index: i
                });
            }
        }

        // Create connections between nearby particles (fewer on Windows)
        for (let i = 0; i < nearbyParticles.length; i++) {
            const particle1 = nearbyParticles[i];
            let connections = 0;
            
            for (let j = i + 1; j < nearbyParticles.length && connections < settings.maxConnections; j++) {
                const particle2 = nearbyParticles[j];
                const distance = particle1.position.distanceTo(particle2.position);
                
                if (distance < settings.connectionDistance) {
                    linePositions.push(
                        particle1.position.x, particle1.position.y, particle1.position.z,
                        particle2.position.x, particle2.position.y, particle2.position.z
                    );
                    connections++;
                }
            }
        }

        // Update line geometry
        if (linePositions.length > 0) {
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            lineGeometry.attributes.position.needsUpdate = true;
        }
        
        renderer.render(scene, camera);
    }

    // Handle window resize with debouncing
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSize();
            
            // Reapply Windows optimizations after resize
            if (isWindows) {
                renderer.setPixelRatio(settings.pixelRatio);
            }
        }, 250);
    }
    
    window.addEventListener('resize', handleResize);

    // Handle visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                console.log('Three.js animation paused (tab hidden)');
            }
        } else {
            animate(performance.now());
            console.log('Three.js animation resumed (tab visible)');
        }
    });

    // Cleanup function
    function cleanup() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        if (renderer) {
            renderer.dispose();
        }
        if (particlesGeometry) {
            particlesGeometry.dispose();
        }
        if (particlesMaterial) {
            particlesMaterial.dispose();
        }
        if (lineMaterial) {
            lineMaterial.dispose();
        }
        console.log('Three.js cleanup completed');
    }

    // Handle page unload
    window.addEventListener('beforeunload', cleanup);

    // Start animation
    console.log('Starting Three.js animation...');
    animate(performance.now());
    
    // Performance monitoring for Windows
    if (isWindows) {
        let frameCount = 0;
        let fpsCheckTime = performance.now();
        
        function checkPerformance() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - fpsCheckTime > 5000) { // Check every 5 seconds
                const fps = Math.round((frameCount * 1000) / (currentTime - fpsCheckTime));
                console.log(`Three.js FPS: ${fps}`);
                
                // Apply additional optimizations if performance is poor
                if (fps < 20) {
                    console.log('Poor performance detected, applying emergency optimizations...');
                    settings.particlesCount = Math.max(1000, settings.particlesCount * 0.7);
                    settings.maxConnections = Math.max(5, settings.maxConnections * 0.5);
                    
                    // Reduce particle material complexity
                    particlesMaterial.opacity = 0.7;
                    lineMaterial.opacity = 0.4;
                }
                
                frameCount = 0;
                fpsCheckTime = currentTime;
            }
            
            setTimeout(checkPerformance, 100);
        }
        
        setTimeout(checkPerformance, 5000); // Start monitoring after 5 seconds
    }
    
    console.log('Three.js initialization complete');
});