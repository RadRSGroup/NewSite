// Three.js Particle Animation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize principle cards with animation delays
    const principleCards = document.querySelectorAll('.principle-card');
    principleCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    // Initialize project cards with animation delays
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    
    // Get the canvas container
    const container = document.getElementById('canvas-container');
    
    // Function to update sizes
    function updateSize() {
        const containerRect = container.getBoundingClientRect();
        camera.aspect = containerRect.width / containerRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRect.width, containerRect.height, false);
    }
    
    // Initial size setup
    updateSize();
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Set canvas style
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    // Create particles
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

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create line system
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        linewidth: 2
    });
    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    camera.position.z = 5;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let mouseWorldPosition = new THREE.Vector3();

    // Initialize mouse position to center of screen
    mouseX = 0; // Center X (normalized from -1 to 1)
    mouseY = 0; // Center Y (normalized from -1 to 1)
    mouseWorldPosition.set(mouseX * 5, mouseY * 5, 0);

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Convert mouse position to world space
        mouseWorldPosition.set(mouseX * 5, mouseY * 5, 0);
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate particles
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        // Mouse interaction
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;
        
        // Update particle positions
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * 0.001;
            positions[i + 1] += (Math.random() - 0.5) * 0.001;
            positions[i + 2] += (Math.random() - 0.5) * 0.001;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

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
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.attributes.position.needsUpdate = true;
        
        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', updateSize);

    // Start animation
    animate();
});