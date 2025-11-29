// Global THREE is used from CDN
// Configuration
const container = document.getElementById('pc-container');

if (container) {
    // Scene Setup
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x050505); // Let CSS handle background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(4, 2, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x00f0ff, 2, 10);
    blueLight.position.set(-2, 1, 2);
    scene.add(blueLight);

    const redLight = new THREE.PointLight(0xff2a2a, 2, 10);
    redLight.position.set(2, 3, -2);
    scene.add(redLight);

    // Materials
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.2,
        metalness: 0.8
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0,
        transmission: 0.9,
        thickness: 0.5,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 0.8
    });

    const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0,
        metalness: 1
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00f0ff,
        emissiveIntensity: 3
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xff2a2a,
        emissiveIntensity: 3
    });

    // Group
    const pcGroup = new THREE.Group();

    // --- CASE GEOMETRY ---
    const w = 1.2, h = 1.5, d = 1.2;

    // Chassis Frame
    function createBar(x, y, z, sx, sy, sz) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), frameMat);
        mesh.position.set(x, y, z);
        return mesh;
    }

    // Top/Bottom Plates
    pcGroup.add(createBar(0, -h / 2, 0, w, 0.05, d));
    pcGroup.add(createBar(0, h / 2, 0, w, 0.05, d));

    // Pillars
    pcGroup.add(createBar(-w / 2 + 0.05, 0, -d / 2 + 0.05, 0.1, h, 0.1)); // Back Left
    pcGroup.add(createBar(w / 2 - 0.05, 0, -d / 2 + 0.05, 0.1, h, 0.1));  // Back Right
    pcGroup.add(createBar(-w / 2 + 0.05, 0, d / 2 - 0.05, 0.1, h, 0.1));  // Front Left

    // Glass Panels
    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, h - 0.1, 0.02), glassMat);
    frontGlass.position.set(0, 0, d / 2);
    pcGroup.add(frontGlass);

    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.02, h - 0.1, d - 0.2), glassMat);
    sideGlass.position.set(w / 2, 0, 0);
    pcGroup.add(sideGlass);

    // Motherboard
    const mobo = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, h - 0.3, 0.05), pcbMat);
    mobo.position.set(0, 0, -d / 2 + 0.1);
    pcGroup.add(mobo);

    // RAM Sticks
    for (let i = 0; i < 4; i++) {
        const ram = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.1), chromeMat);
        ram.position.set(-0.2 + (i * 0.04), 0.2, -d / 2 + 0.2);
        pcGroup.add(ram);

        const ramLight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.1), neonCyan);
        ramLight.position.set(-0.2 + (i * 0.04), 0.35, -d / 2 + 0.2);
        pcGroup.add(ramLight);
    }

    // GPU
    const gpuGroup = new THREE.Group();
    const gpuBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.3), frameMat);
    gpuGroup.add(gpuBody);

    // GPU Fans
    for (let i = 0; i < 3; i++) {
        const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16), frameMat);
        fan.position.set(-0.25 + (i * 0.25), -0.06, 0);
        gpuGroup.add(fan);

        const fanLight = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.005, 8, 16), neonRed);
        fanLight.position.set(-0.25 + (i * 0.25), -0.06, 0);
        fanLight.rotation.x = Math.PI / 2;
        gpuGroup.add(fanLight);
    }

    gpuGroup.position.set(0, -0.2, -d / 2 + 0.3);
    pcGroup.add(gpuGroup);

    // CPU Cooler (AIO Block)
    const cpuBlock = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32), frameMat);
    cpuBlock.position.set(0, 0.2, -d / 2 + 0.15);
    cpuBlock.rotation.x = Math.PI / 2;
    pcGroup.add(cpuBlock);

    const cpuLogo = new THREE.Mesh(new THREE.CircleGeometry(0.1, 32), neonCyan);
    cpuLogo.position.set(0, 0.2, -d / 2 + 0.21);
    pcGroup.add(cpuLogo);

    // Tubes
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.2, -d / 2 + 0.2),
        new THREE.Vector3(0.3, 0.3, -d / 2 + 0.4),
        new THREE.Vector3(0.4, 0.6, -d / 2 + 0.2)
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
    const tube = new THREE.Mesh(tubeGeo, chromeMat);
    pcGroup.add(tube);

    scene.add(pcGroup);

    // Interaction (Cursor Move)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        // Gentle float
        const floatOffset = Math.sin(Date.now() * 0.001) * 0.05;
        pcGroup.position.y = floatOffset;

        // Cursor Rotation Logic
        targetRotationY = mouseX * 0.001;
        targetRotationX = mouseY * 0.001;

        // Smooth damping
        pcGroup.rotation.y += 0.05 * (targetRotationY - pcGroup.rotation.y);
        pcGroup.rotation.x += 0.05 * (targetRotationX - pcGroup.rotation.x);

        renderer.render(scene, camera);
    }

    // Resize
    window.addEventListener('resize', () => {
        if (container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });

    animate();
}
