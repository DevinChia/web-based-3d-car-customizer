import "./Viewer.css";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Viewer({ modelPath, bodyColor, rimColor, viewMode, cameraView, onLoadingChange }) {
	const mountRef = useRef(null);
	const bodyMeshesRef = useRef([]);
	const rimMeshesRef = useRef([]);
	const originalBodyMaterialsRef = useRef([]);
	const originalRimMaterialsRef = useRef([]);
	const controlsRef = useRef(null);
	const cameraRef = useRef(null);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		onLoadingChange?.(true);

		const mount = mountRef.current;

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xEDEDED);

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

		cameraRef.current = camera;
		controlsRef.current = controls;

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

			const bodyMeshes = [];
			const wheelMeshes = [];

			model.traverse((child) => {
				if (child.isMesh) {
					const mat = child.material;

					if (mat.transparent || mat.opacity < 1) return;

					const childBox = new THREE.Box3().setFromObject(child);
					const childCenter = childBox.getCenter(new THREE.Vector3());

					const frontBackLimit = size.z * 0.35;

					const aspectRatio = size.y / size.z;
					let wheelHeightFactor;

					if (aspectRatio > 0.31) {
						wheelHeightFactor = 0.25; // suv / hatchback
					}
					else {
						wheelHeightFactor = 0.31; // sedan / coupe
					}

					const isLow = childCenter.y < finalBox.min.y + size.y * wheelHeightFactor;
					const isMiddle = Math.abs(childCenter.z) < frontBackLimit;

					const isWheelArea = isLow && isMiddle;

					// const helper = new THREE.Box3Helper(childBox, isWheelArea ? 0xff0000 : 0x00ff00);
					// scene.add(helper);

					child.material = mat.clone();

					if (isWheelArea) wheelMeshes.push(child);
					else bodyMeshes.push(child);
				}
			});

			bodyMeshesRef.current = detectBodyMeshes(bodyMeshes);
			rimMeshesRef.current = detectRimMeshes(wheelMeshes);

			originalBodyMaterialsRef.current = bodyMeshesRef.current.map(mesh => mesh.material.clone());
			originalRimMaterialsRef.current = rimMeshesRef.current.map(mesh => mesh.material.clone());

			if (bodyColor) {
				bodyMeshesRef.current.forEach((mesh) => {
					mesh.material.color.set(bodyColor);
				});
			}

			if (rimColor) {
				rimMeshesRef.current.forEach((mesh) => {
					mesh.material.map = null;
					mesh.material.color.set(rimColor);
				});
			}

			scene.add(model);

			controls.target.set(0, size.y * 0.3, 0);
			controls.update();

			updateCameraView();

			setIsLoading(false);
			onLoadingChange?.(false);
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
		if (bodyMeshesRef.current.length === 0) return;
		bodyMeshesRef.current.forEach((mesh, index) => {
			if (!bodyColor) {
				mesh.material.copy(originalBodyMaterialsRef.current[index]);
			} else {
				mesh.material.color.set(bodyColor);
			}
		});
	}, [bodyColor]);

	useEffect(() => {
		if (rimMeshesRef.current.length === 0) return;
		rimMeshesRef.current.forEach((mesh, index) => {
			if (!rimColor) {
				mesh.material.copy(originalRimMaterialsRef.current[index]);
			} else {
				mesh.material.map = null;
				mesh.material.color.set(rimColor);
			}
		});
	}, [rimColor]);

	useEffect(() => {
		updateCameraView();
	}, [viewMode, cameraView]);

	const updateCameraView = () => {
		if (!cameraRef.current || !controlsRef.current) return;
	
		const camera = cameraRef.current;
		const controls = controlsRef.current;
	
		const sideDistance = 2.1;
		const frontBackDistance = 2.8;
		const topDistance = 2.4;
		const targetY = 0.3;
	
		if (viewMode === "3d") {
			controls.enabled = true;
			controls.enableDamping = true;
			controls.enableRotate = true;
			controls.enablePan = true;
			controls.enableZoom = true;
	
			camera.up.set(0, 1, 0);
			camera.position.set(2, 0.6, 2);
			controls.target.set(0, targetY, 0);
			controls.update();
	
			return;
		}
	
		controls.enabled = false;
		controls.enableDamping = false;
		controls.reset();
		camera.up.set(0, 1, 0);
	
		switch (cameraView) {
			case "front":
				camera.position.set(0, targetY, frontBackDistance);
				break;
	
			case "back":
				camera.position.set(0, targetY, -frontBackDistance);
				break;
	
			case "left":
				camera.position.set(-sideDistance, targetY, 0);
				break;
	
			case "right":
				camera.position.set(sideDistance, targetY, 0);
				break;
	
			case "top":
				camera.position.set(0, topDistance, 0.001);
				camera.up.set(0, 0, -1);
				break;
	
			default:
				camera.position.set(0, targetY, frontBackDistance);
		}
	
		controls.target.set(0, targetY, 0);
		camera.lookAt(0, targetY, 0);
		controls.update();
	
		controls.enabled = true;
		controls.enableRotate = false;
		controls.enablePan = false;
		controls.enableZoom = true;
	};

	return (
		<div style={{ width: "100%", height: "100%", position: "relative" }}>
			<div ref={mountRef} style={{ width: "100%", height: "100%" }} />

			{isLoading && (
				<div className="viewer-loading">
					Loading Model...
				</div>
			)}
		</div>
	);
}

const containsKeyword = (text, keywords) => keywords.some(keyword => text.includes(keyword));

const groupSizes = (items, tolerance = 0.01) => {
	const groups = [];

	items.forEach(item => {
		let found = false;

		for (let group of groups) {
			if (Math.abs(group[0].size - item.size) < tolerance) {
				group.push(item);
				found = true;
				break;
			}
		}

		if (!found) {
			groups.push([item]);
		}
	});

	return groups;
};

function detectBodyMeshes(bodyMeshes) {
	let result = [];

	const bodyKeywords = [
		"body", "paint", "door", "hood", "bonnet", "fender"
	];

	const excludedBodyKeywords = [
		"glass", "window", "mirror", "seat", "interior",
		"dashboard", "engine", "lamp"
	];

	let bodyKeywordCount = 0;

	bodyMeshes.forEach((mesh) => {
		const meshName = mesh.name.toLowerCase();
		const matName = mesh.material.name.toLowerCase();

		if (
			containsKeyword(meshName, bodyKeywords) ||
			containsKeyword(matName, bodyKeywords)
		) {
			bodyKeywordCount++;
		}
	});

	const bodyKeywordRatio = bodyKeywordCount / bodyMeshes.length;
	const bodyUseNameFilter = bodyKeywordRatio > 0.6;

	bodyMeshes.forEach((mesh) => {
		const meshName = mesh.name.toLowerCase();
		const matName = mesh.material.name.toLowerCase();

		const isNonPaintPart =
			containsKeyword(meshName, excludedBodyKeywords) ||
			containsKeyword(matName, excludedBodyKeywords);

		if (bodyUseNameFilter) {
			if (isNonPaintPart) return;
			result.push(mesh);
		} else {
			if (mesh.material.roughness < 0.5) {
				result.push(mesh);
			}
		}
	});

	return result;
}

function detectRimMeshes(wheelMeshes) {
	let rimMeshes = [];

	const wheelCandidates = wheelMeshes.map(mesh => {
		const box = new THREE.Box3().setFromObject(mesh);
		const sizeVec = box.getSize(new THREE.Vector3());
		const size = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);

		return { mesh, size };
	});

	let groups = groupSizes(wheelCandidates);
	groups = groups.filter(group => group.length >= 3);

	let rimFound = false;

	if (groups.length >= 2) {
		groups.sort((a, b) => b[0].size - a[0].size);

		let tireGroup = groups[0];

		let rimGroup = groups.find((group, index) => {
			if (index === 0) return false;
			return Math.abs(group[0].size - tireGroup[0].size) > 0.02;
		});

		if (rimGroup) {
			rimGroup.forEach(({ mesh }) => rimMeshes.push(mesh));
			rimFound = true;
		}
	}

	if (!rimFound) {
		const wheelKeywords = ["wheel", "rim", "alloy", "disk", "disc"];
		const excludedWheelKeywords = ["tire", "tyre", "brake"];

		let wheelKeywordCount = 0;

		wheelMeshes.forEach((mesh) => {
			const meshName = mesh.name.toLowerCase();
			const matName = mesh.material.name.toLowerCase();

			if (
				containsKeyword(meshName, wheelKeywords) ||
				containsKeyword(matName, wheelKeywords)
			) {
				wheelKeywordCount++;
			}
		});

		const wheelKeywordRatio = wheelKeywordCount / wheelMeshes.length;
		const wheelUseNameFilter = wheelKeywordRatio > 0.4;

		wheelMeshes.forEach((mesh) => {
			const meshName = mesh.name.toLowerCase();
			const matName = mesh.material.name.toLowerCase();

			const hasWheelWord =
				containsKeyword(meshName, wheelKeywords) ||
				containsKeyword(matName, wheelKeywords);

			const hasExcludedWord =
				containsKeyword(meshName, excludedWheelKeywords) ||
				containsKeyword(matName, excludedWheelKeywords);

			const isNotRim = hasExcludedWord && !hasWheelWord;

			if (wheelUseNameFilter) {
				if (isNotRim) return;
				rimMeshes.push(mesh);
			} else {
				if (
					mesh.material.metalness > 0.6 &&
					mesh.material.roughness < 0.5
				) {
					rimMeshes.push(mesh);
				}
			}
		});
	}

	return rimMeshes;
}