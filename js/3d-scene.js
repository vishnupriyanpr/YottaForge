// Yotta Forge - 3D PC Scene (Ultimate Realism - Hyte Y60 Specifics)
// Features: Vertical GPU, Braided Cables, Lian Li Style Fans, Detailed Case Vents

document.addEventListener('DOMContentLoaded', () => {
    init3DScene();
});

function init3DScene() {
    const container = document.getElementById('pc-container');

    if (!container) {
        console.error("Yotta Forge: #pc-container not found. 3D Scene initialization aborted.");
        return;
    }

    // --- Configuration ---
    const config = {
        colors: {
            bg: 0x050505,
            frame: 0x080808, // Deep Matte Black
            glass: 0xffffff,
            neonRed: 0xff0000,
            neonCyan: 0x00f0ff,
            pcb: 0x111111,
            chrome: 0xcccccc,
            copper: 0xb87333,
            plastic: 0x1a1a1a,
            cableRed: 0xcc0000,
            cableBlack: 0x111111
        },
        dims: {
            width: container.clientWidth,
            height: container.clientHeight
        },
        sensitivity: 0.003,
        autoRotateSpeed: 0.005
    };

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, config.dims.width / config.dims.height, 0.1, 1000);
    camera.position.set(4.5, 2.5, 5.5); // Zoomed in view
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(config.dims.width, config.dims.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Volumetric Red Glow (Internal)
    const internalLight = new THREE.PointLight(config.colors.neonRed, 2.5, 12);
    internalLight.position.set(0, 0, 0);
    scene.add(internalLight);

    // --- Materials ---
    const frameMat = new THREE.MeshStandardMaterial({ color: config.colors.frame, roughness: 0.8, metalness: 0.4 });
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: config.colors.glass, metalness: 0.1, roughness: 0, transmission: 0.98, thickness: 0.1, transparent: true, opacity: 0.1, side: THREE.DoubleSide
    });
    const neonRedMat = new THREE.MeshBasicMaterial({ color: config.colors.neonRed });
    const pcbMat = new THREE.MeshStandardMaterial({ color: config.colors.pcb, roughness: 0.9 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: config.colors.chrome, metalness: 0.9, roughness: 0.1 });
    const plasticMat = new THREE.MeshStandardMaterial({ color: config.colors.plastic, roughness: 0.6 });
    const cableRedMat = new THREE.MeshStandardMaterial({ color: config.colors.cableRed, roughness: 0.9 });
    const cableBlackMat = new THREE.MeshStandardMaterial({ color: config.colors.cableBlack, roughness: 0.9 });

    // --- Geometry Construction ---
    const pcGroup = new THREE.Group();

    // 1. The Case (Hyte Y60 - Ultimate Detail)
    const caseW = 2.2, caseH = 2.4, caseD = 2.0;
    const chamferSize = 0.6;
    const bottomChamberH = 0.4;

    // Bottom Chamber (Shroud)
    const shroudShape = new THREE.Shape();
    shroudShape.moveTo(-caseW / 2, -caseD / 2);
    shroudShape.lineTo(caseW / 2, -caseD / 2);
    shroudShape.lineTo(caseW / 2, caseD / 2);
    shroudShape.lineTo(-caseW / 2, caseD / 2);
    shroudShape.lineTo(-caseW / 2, -caseD / 2 + chamferSize);
    shroudShape.lineTo(-caseW / 2 + chamferSize, -caseD / 2);

    const shroudExtrude = { depth: bottomChamberH, bevelEnabled: false };
    const shroud = new THREE.Mesh(new THREE.ExtrudeGeometry(shroudShape, shroudExtrude), frameMat);
    shroud.rotation.x = Math.PI / 2;
    shroud.position.y = -caseH / 2 + bottomChamberH;
    shroud.position.z = -0.075;
    pcGroup.add(shroud);

    // Top Cap (Vented)
    const topCap = new THREE.Mesh(new THREE.ExtrudeGeometry(shroudShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 }), frameMat);
    topCap.rotation.x = Math.PI / 2;
    topCap.position.y = caseH / 2;
    topCap.position.z = -0.075;
    pcGroup.add(topCap);

    // Vents (Top) - Simulated with lines
    const ventGroup = new THREE.Group();
    for (let i = 0; i < 15; i++) {
        const ventLine = new THREE.Mesh(new THREE.BoxGeometry(caseW - 0.4, 0.02, 0.05), plasticMat);
        ventLine.position.z = -caseD / 2 + 0.3 + (i * 0.1);
        ventGroup.add(ventLine);
    }
    ventGroup.position.y = caseH / 2 + 0.05;
    pcGroup.add(ventGroup);

    // Pillars
    const pillarGeo = new THREE.BoxGeometry(0.06, caseH - bottomChamberH, 0.06);
    const p1 = new THREE.Mesh(pillarGeo, frameMat); p1.position.set(caseW / 2 - 0.03, bottomChamberH / 2, -caseD / 2 + 0.03); pcGroup.add(p1);
    const p2 = new THREE.Mesh(pillarGeo, frameMat); p2.position.set(caseW / 2 - 0.03, bottomChamberH / 2, caseD / 2 - 0.03); pcGroup.add(p2);
    const p3 = new THREE.Mesh(pillarGeo, frameMat); p3.position.set(-caseW / 2 + 0.03, bottomChamberH / 2, caseD / 2 - 0.03); pcGroup.add(p3);
    const p4 = new THREE.Mesh(pillarGeo, frameMat); p4.position.set(-caseW / 2 + chamferSize, bottomChamberH / 2, -caseD / 2 + 0.03); pcGroup.add(p4);
    const p5 = new THREE.Mesh(pillarGeo, frameMat); p5.position.set(-caseW / 2 + 0.03, bottomChamberH / 2, -caseD / 2 + chamferSize); pcGroup.add(p5);

    // Glass Panels
    const glassH = caseH - bottomChamberH - 0.1;
    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(caseW - chamferSize, glassH), glassMat);
    frontGlass.position.set(chamferSize / 2, bottomChamberH / 2, -caseD / 2);
    pcGroup.add(frontGlass);

    const sideGlass = new THREE.Mesh(new THREE.PlaneGeometry(caseD - chamferSize, glassH), glassMat);
    sideGlass.rotation.y = -Math.PI / 2;
    sideGlass.position.set(-caseW / 2, bottomChamberH / 2, chamferSize / 2);
    pcGroup.add(sideGlass);

    const cornerGlass = new THREE.Mesh(new THREE.PlaneGeometry(Math.sqrt(chamferSize ** 2 + chamferSize ** 2), glassH), glassMat);
    cornerGlass.rotation.y = -Math.PI / 4;
    cornerGlass.position.set(-caseW / 2 + chamferSize / 2, bottomChamberH / 2, -caseD / 2 + chamferSize / 2);
    pcGroup.add(cornerGlass);

    // Feet
    const footGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.1, 16);
    const f1 = new THREE.Mesh(footGeo, plasticMat); f1.position.set(caseW / 2 - 0.2, -caseH / 2 - 0.05, caseD / 2 - 0.2); pcGroup.add(f1);
    const f2 = new THREE.Mesh(footGeo, plasticMat); f2.position.set(-caseW / 2 + 0.2, -caseH / 2 - 0.05, caseD / 2 - 0.2); pcGroup.add(f2);
    const f3 = new THREE.Mesh(footGeo, plasticMat); f3.position.set(caseW / 2 - 0.2, -caseH / 2 - 0.05, -caseD / 2 + 0.2); pcGroup.add(f3);
    const f4 = new THREE.Mesh(footGeo, plasticMat); f4.position.set(-caseW / 2 + 0.4, -caseH / 2 - 0.05, -caseD / 2 + 0.2); pcGroup.add(f4);

    // 2. Fans (Lian Li Uni Fan Style - Squarer)
    function createUniFan() {
        const group = new THREE.Group();
        // Frame (Square with rounded corners)
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.1), plasticMat);

        // RGB Strips (Top/Bottom edges)
        const stripGeo = new THREE.BoxGeometry(0.38, 0.02, 0.102);
        const topStrip = new THREE.Mesh(stripGeo, neonRedMat); topStrip.position.y = 0.19;
        const botStrip = new THREE.Mesh(stripGeo, neonRedMat); botStrip.position.y = -0.19;

        // Center Hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.11, 32), chromeMat);
        hub.rotation.x = Math.PI / 2;

        group.add(frame);
        group.add(topStrip);
        group.add(botStrip);
        group.add(hub);

        // Blades
        const bladeGroup = new THREE.Group();
        for (let i = 0; i < 9; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.01), plasticMat); // Translucent plastic?
            blade.position.y = 0.1;
            blade.rotation.z = 0.3;
            const bladePivot = new THREE.Group();
            bladePivot.rotation.z = (i / 9) * Math.PI * 2;
            bladePivot.add(blade);
            bladeGroup.add(bladePivot);
        }
        bladeGroup.position.z = 0.02;
        group.add(bladeGroup);

        group.userData = { blades: bladeGroup };
        return group;
    }

    const fans = [];

    // Side Fans (Vertical Stack - Recessed)
    for (let i = 0; i < 3; i++) {
        const fan = createUniFan();
        fan.position.set(caseW / 2 - 0.4, -0.3 + (i * 0.42), 0.2);
        fan.rotation.y = -Math.PI / 2;
        pcGroup.add(fan);
        fans.push(fan);
    }

    // Top Fans (Horizontal)
    for (let i = 0; i < 3; i++) {
        const fan = createUniFan();
        fan.position.set(-0.5 + (i * 0.45), caseH / 2 - 0.15, 0.2);
        fan.rotation.x = Math.PI / 2;
        pcGroup.add(fan);
        fans.push(fan);
    }

    // Rear Fan
    const rearFan = createUniFan();
    rearFan.position.set(-caseW / 2 + 0.2, 0.5, caseD / 2 - 0.2);
    rearFan.rotation.y = Math.PI / 2;
    pcGroup.add(rearFan);
    fans.push(rearFan);

    // 3. Components (Ultimate Detail)

    // Motherboard
    const moboGroup = new THREE.Group();
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.6, 1.4), pcbMat);
    moboGroup.add(pcb);

    // VRM/IO Shield
    const ioShield = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.0, 0.3), plasticMat);
    ioShield.position.set(0.05, 0.2, -0.5);
    // RGB on IO Shield
    const ioRGB = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.8, 0.05), neonRedMat);
    ioRGB.position.set(0.05, 0.2, -0.5); // Overlap slightly
    moboGroup.add(ioShield);
    moboGroup.add(ioRGB);

    moboGroup.position.set(0.2, 0.2, 0.1);
    pcGroup.add(moboGroup);

    // Vertical GPU (The Star of the Show)
    const gpuGroup = new THREE.Group();
    // Body
    const gpuBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 0.15), plasticMat);
    gpuGroup.add(gpuBody);

    // Fans (3x)
    for (let i = 0; i < 3; i++) {
        const gFan = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.01, 16, 32), neonRedMat);
        gFan.position.set(-0.45 + (i * 0.45), 0, 0.08);
        gpuGroup.add(gFan);

        // Center cap
        const gCap = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), chromeMat);
        gCap.position.set(-0.45 + (i * 0.45), 0, 0.08);
        gpuGroup.add(gCap);
    }

    // "RADEON" Red Strip
    const gpuStrip = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.02, 0.16), neonRedMat);
    gpuStrip.position.y = 0.28;
    gpuGroup.add(gpuStrip);

    // Mount Vertical
    gpuGroup.rotation.x = -Math.PI / 2; // Flat? No, vertical facing side
    gpuGroup.rotation.y = -Math.PI / 2; // Face the side glass
    // Actually, in Hyte Y60, vertical GPU faces the FRONT/SIDE corner usually, or just straight out.
    // Let's face it towards the corner glass for maximum visibility
    gpuGroup.rotation.set(0, -Math.PI / 4, 0); // 45 deg
    // Wait, standard vertical mount is parallel to MB but offset.
    // Let's stick to parallel to side glass for now, it looks best.
    gpuGroup.rotation.set(0, 0, 0); // Reset
    gpuGroup.rotation.y = -Math.PI / 2; // Facing side
    gpuGroup.position.set(-0.2, -0.5, 0.5); // Bottom area
    pcGroup.add(gpuGroup);

    // AIO Pump (LCD Screen)
    const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 32), plasticMat);
    pump.rotation.x = Math.PI / 2;
    pump.position.set(0.25, 0.5, 0.1);

    const pumpScreen = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), neonRedMat); // Glowing red screen
    pumpScreen.position.set(0, 0.08, 0);
    pumpScreen.rotation.x = -Math.PI / 2;
    pump.add(pumpScreen);
    pcGroup.add(pump);

    // Braided Tubes
    const tubePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.25, 0.5, 0.2),
        new THREE.Vector3(0.5, 0.7, 0.5),
        new THREE.Vector3(0, 1.1, 0.2) // To top radiator
    ]);
    const tubeGeo = new THREE.TubeGeometry(tubePath, 20, 0.04, 8, false);
    const tubes = new THREE.Mesh(tubeGeo, plasticMat); // Black sleeving
    pcGroup.add(tubes);

    // Braided Power Cables (Procedural)
    function createBraidedCable(start, end, colorMat, segments = 5) {
        const cableGroup = new THREE.Group();
        const curve = new THREE.CatmullRomCurve3([
            start,
            new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2 - 0.2, (start.z + end.z) / 2), // Droop
            end
        ]);

        // Create multiple strands
        for (let i = 0; i < segments; i++) {
            const offset = (i - segments / 2) * 0.015;
            const tube = new THREE.Mesh(
                new THREE.TubeGeometry(curve, 10, 0.006, 4, false),
                colorMat
            );
            tube.position.x = offset;
            cableGroup.add(tube);
        }
        return cableGroup;
    }

    // GPU Power (Red)
    const gpuPowerStart = new THREE.Vector3(-0.2, -0.2, 0.5);
    const gpuPowerEnd = new THREE.Vector3(0.3, -0.4, 0.2); // Into grommet
    pcGroup.add(createBraidedCable(gpuPowerStart, gpuPowerEnd, cableRedMat, 8));

    // 24-Pin Mobo (Red/Black Mix)
    const moboPowerStart = new THREE.Vector3(0.2, 0.4, 0.6); // Edge of MB
    const moboPowerEnd = new THREE.Vector3(0.3, 0.4, 0.4); // Into grommet
    pcGroup.add(createBraidedCable(moboPowerStart, moboPowerEnd, cableBlackMat, 12));


    // RAM Sticks (RGB)
    for (let i = 0; i < 4; i++) {
        const ram = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.1), plasticMat);
        ram.position.set(0.4 + (i * 0.04), 0.5, -0.1);
        const ramTop = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.28, 0.02), neonRedMat);
        ramTop.position.z = 0.04;
        ram.add(ramTop);
        pcGroup.add(ram);
    }

    scene.add(pcGroup);

    // --- Interaction & Animation ---
    let mouseX = 0;
    let mouseY = 0;
    let isRightSide = false;
    let autoRotateAngle = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        isRightSide = event.clientX > window.innerWidth / 2;
        if (isRightSide) {
            mouseX = (event.clientX - (window.innerWidth * 0.75));
            mouseY = (event.clientY - windowHalfY);
        }
    });

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    setTimeout(onWindowResize, 100);

    function animate() {
        requestAnimationFrame(animate);

        // Fan Rotation
        fans.forEach(fan => {
            if (fan.userData.blades) {
                fan.userData.blades.rotation.z -= 0.3; // Spin fast
            }
        });

        // Float
        pcGroup.position.y = Math.sin(Date.now() * 0.001) * 0.05;

        // Rotation Logic
        if (isRightSide) {
            const targetY = mouseX * config.sensitivity;
            const targetX = mouseY * config.sensitivity;
            currentRotationY += 0.1 * (targetY - currentRotationY);
            currentRotationX += 0.1 * (targetX - currentRotationX);
            autoRotateAngle = currentRotationY;
        } else {
            autoRotateAngle += config.autoRotateSpeed;
            currentRotationY += 0.05 * (autoRotateAngle - currentRotationY);
            currentRotationX += 0.05 * (0 - currentRotationX);
        }

        pcGroup.rotation.y = currentRotationY;
        pcGroup.rotation.x = currentRotationX;

        renderer.render(scene, camera);
    }

    animate();
    console.log("Yotta Forge: Ultimate 3D Scene Loaded");
}
