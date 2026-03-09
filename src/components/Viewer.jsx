import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Viewer({ modelPath }) {
	console.log(modelPath)
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
	
		camera.position.set(2, 0.6, 2);
	
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.minDistance = 2;
		controls.maxDistance = 10;
		controls.enablePan = true;
		controls.screenSpacePanning = false;

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 10, 5);
		scene.add(directionalLight);

		const loader = new GLTFLoader();

		loader.load(modelPath, (gltf) => {
			const model = gltf.scene;
		
			const box = new THREE.Box3().setFromObject(model);
			const size = box.getSize(new THREE.Vector3());
		  
			const maxDim = Math.max(size.x, size.y, size.z);
			const scaleFactor = 3 / maxDim;
			model.scale.setScalar(scaleFactor);
		  
			const box2 = new THREE.Box3().setFromObject(model);
			const center2 = box2.getCenter(new THREE.Vector3());
			const size2 = box2.getSize(new THREE.Vector3());
		  
			model.position.sub(center2);
		  
			scene.add(model);
		  
			controls.target.set(0, size2.y * 0.3, 0);
			controls.update();
		});
	
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