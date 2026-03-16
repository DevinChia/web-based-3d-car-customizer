import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { roughness } from "three/tsl";

export default function Viewer({ modelPath, bodyColor, rimColor }) {
	const mountRef = useRef(null);
	const bodyMeshesRef = useRef([]);
	const rimMeshesRef = useRef([]);

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

		bodyMeshesRef.current = [];
		rimMeshesRef.current = [];

		loader.load(modelPath, (gltf) => {
			const model = gltf.scene;
			
			const totalBox = new THREE.Box3().setFromObject(model);
			const totalSize = totalBox.getSize(new THREE.Vector3());

			const maxDim = Math.max(totalSize.x, totalSize.y, totalSize.z);
			const scaleFactor = 3 / maxDim;
			model.scale.setScalar(scaleFactor);

			const box = new THREE.Box3().setFromObject(model);
			const size = box.getSize(new THREE.Vector3());
			const center = box.getCenter(new THREE.Vector3());
			model.position.sub(center);

			const finalBox = new THREE.Box3().setFromObject(model);

			// const helper = new THREE.Box3Helper(finalBox, 0xff0000);
			// scene.add(helper);

			const bodyMeshes = [];
			const wheelMeshes = [];
		  
			model.traverse((child) => {
				if (child.isMesh) {
					const mat = child.material;

					if (mat.transparent || mat.opacity < 1) return;

					const childBox = new THREE.Box3().setFromObject(child);
					const childCenter = childBox.getCenter(new THREE.Vector3());
					const childSize = childBox.getSize(new THREE.Vector3());

					const frontBackLimit = size.z * 0.35;

					const isLow = childCenter.y < finalBox.min.y + size.y * 0.25;
					const isMiddle = Math.abs(childCenter.z) < frontBackLimit;

					const isWheelArea = isLow && isMiddle;

					const helper = new THREE.Box3Helper(childBox, isWheelArea ? 0xff0000 : 0x00ff00);
					scene.add(helper);

					child.material = mat.clone();
					
					if (isWheelArea) {
						wheelMeshes.push(child);
					}
					else {
						bodyMeshes.push(child);
					}
				}
			});

			let keywordCount = 0;

			const bodyKeywords = [
				"body",
				"paint",
				"door",
				"hood",
				"bonnet",
				"fender"
			]

			const excludedBodyKeywords = [
				"glass",
				"window",
				"mirror",
				"seat",
				"interior",
				"dashboard",
				"exhaust",
				"engine",
				"light",
				"lamp"
			]

			const containsKeyword = (text, keywords) => keywords.some(keyword => text.includes(keyword));

			bodyMeshes.forEach((mesh) => {
				const meshName = mesh.name.toLowerCase();
				const matName = mesh.material.name.toLowerCase();

				if (
					containsKeyword(meshName, bodyKeywords) ||
					containsKeyword(matName, bodyKeywords)
				) {
					keywordCount++;
				}
			});

			const keywordRatio = keywordCount / bodyMeshes.length;
			const useNameFilter = keywordRatio > 0.5;

			bodyMeshes.forEach((mesh) => {
				const meshName = mesh.name.toLowerCase();
				const matName = mesh.material.name.toLowerCase();
			
				const isNonPaintPart =
					containsKeyword(meshName, excludedBodyKeywords) ||
					containsKeyword(matName, excludedBodyKeywords);
			
				if (useNameFilter) {
					if (isNonPaintPart) return;
					bodyMeshesRef.current.push(mesh);
				}
				else {
					if (
						mesh.material.roughness < 0.5
					) {
						bodyMeshesRef.current.push(mesh);
					}
				}
			});

			let hasTireKeyword = false;

			wheelMeshes.forEach((mesh) => {
				const meshName = mesh.name.toLowerCase();
				const matName = mesh.material.name.toLowerCase();
				if (
					meshName.includes("tire") ||
					meshName.includes("tyre") ||
					matName.includes("tire") ||
					matName.includes("tyre")
				) {
					hasTireKeyword = true;
				}
			});

			wheelMeshes.forEach((mesh) => {
				const meshName = mesh.name.toLowerCase();
				const matName = mesh.material.name.toLowerCase();

				const isTire =
					meshName.includes("tire") ||
					meshName.includes("tyre") ||
					matName.includes("tire") ||
					matName.includes("tyre");

				if (hasTireKeyword) {
					if (isTire) return;
					rimMeshesRef.current.push(mesh);
				} else {
					if (mesh.material.metalness > 0.3 && mesh.material.roughness < 0.31) {
						rimMeshesRef.current.push(mesh);
					}
				}
			});

			scene.add(model);
		  
			controls.target.set(0, size.y * 0.3, 0);
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

	useEffect(() => {
		bodyMeshesRef.current.forEach((mesh) => {
			mesh.material.color.set(bodyColor);
		});
	}, [bodyColor]);
	
	useEffect(() => {
		rimMeshesRef.current.forEach((mesh) => {
			mesh.material.map = null;
			mesh.material.color.set(rimColor);
		});
	}, [rimColor]);	
	
	return <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>;
}