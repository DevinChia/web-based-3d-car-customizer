import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Viewer({ modelPath }) {
	const mountRef = useRef(null);

	useEffect(() => {
		const mount = mountRef.current;
	
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf5f5f5);
	
		const camera = new THREE.PerspectiveCamera(
			75,
			mount.clientWidth / mount.clientHeight,
			0.1,
			1000
		);
	
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(mount.clientWidth, mount.clientHeight);

		const handleResize = () => {
			const width = mount.clientWidth;
			const height = mount.clientHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};
		  
		window.addEventListener("resize", handleResize);		  
	
		mount.appendChild(renderer.domElement);
	
		camera.position.set(0, 2, 5);
	
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.minDistance = 2;
		controls.maxDistance = 10;

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 10, 5);
		scene.add(directionalLight);

		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
	
		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};
	
		animate();
	
		return () => {
			window.removeEventListener("resize", handleResize);
			if (mount && renderer.domElement) {
				mount.removeChild(renderer.domElement);
			}
		};
	}, [modelPath]);
	

	return <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>;
}