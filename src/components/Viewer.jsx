import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Viewer({ modelPath }) {
	const mountRef = useRef(null);

	useEffect(() => {
		const mount = mountRef.current;
	
		const scene = new THREE.Scene();
	
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
	
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
	
		mount.appendChild(renderer.domElement);
	
		camera.position.set(0, 2, 5);
	
		const controls = new OrbitControls(camera, renderer.domElement);

		scene.background = new THREE.Color(0xf5f5f5);
	
		const light = new THREE.AmbientLight(0xffffff, 1);
		scene.add(light);

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
			if (mount && renderer.domElement) {
				mount.removeChild(renderer.domElement);
			}
		};
	}, [modelPath]);
	

	return <div ref={mountRef}></div>;
}