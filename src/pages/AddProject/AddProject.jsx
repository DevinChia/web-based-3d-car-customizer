import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTitleDuplicate, createProject } from "../../services/projectService";

export default function AddProject() {
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [carType, setCarType] = useState("Sedan");
	const [uploadModel, setUploadModel] = useState(false);
	const [modelFile, setModelFile] = useState(null);
	const [defaultModel, setDefaultModel] = useState("model1.glb");
	const [errorMsg, setErrorMsg] = useState("");
	const [showModal, setShowModal] = useState(false);

	const showError = (message) => {
		setErrorMsg(message);
		setShowModal(true);
	};	  

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShowModal(false);
		setErrorMsg("");

		if (!title.trim()) {
			showError("Title tidak boleh kosong.");
			return;
		}

		const duplicate = await isTitleDuplicate(title);
		if (duplicate) {
			showError("Title sudah ada, silakan gunakan yang lain.");
			return;
		}

		if (uploadModel && !modelFile) {
			showError("Silakan upload model terlebih dahulu.");
			return;
		}

		// ✅ Simpan hanya nama file, bukan blob URL
		const modelUrl = uploadModel
			? modelFile.name
			: defaultModel;

		const project = {
			title: title.trim(),
			car_type: carType,
			upload_model: uploadModel,
			model_url: modelUrl,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Insert ke Supabase
		const result = await createProject(project);
		if (!result) {
			showError("Terjadi error saat menyimpan project.");
			return;
		}

		// Redirect ke Customize page
		navigate(`/customize/${encodeURIComponent(title)}`);
	};

	const overlayStyle = {
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.5)",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	};
		
	const modalStyle = {
		background: "white",
		padding: "20px",
		borderRadius: "10px",
		width: "300px",
		textAlign: "center",
	};	  

	return (
		<div>
			<h1>Add Project</h1>
			<form
				onSubmit={handleSubmit}
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
					maxWidth: "400px",
				}}
			>
				<label>
					Title:
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</label>

				<label>
					Car Type:
					<select value={carType} onChange={(e) => setCarType(e.target.value)}>
						<option>Sedan</option>
						<option>SUV</option>
						<option>Coupe</option>
						<option>Hatchback</option>
					</select>
				</label>

				<label>
					<input
						type="checkbox"
						checked={uploadModel}
						onChange={(e) => {
							setUploadModel(e.target.checked);
							setModelFile(null);
						}}
					/>
					Upload model sendiri
				</label>

				{uploadModel && (
					<label>
						Upload file:
						<input
							type="file"
							accept=".glb,.gltf,.obj"
							onChange={(e) => setModelFile(e.target.files[0])}
						/>
					</label>
				)}

				{!uploadModel && (
					<label>
						Pilih model yang tersedia:
						<select
							value={defaultModel}
							onChange={(e) => setDefaultModel(e.target.value)}
						>
							<option value="model1.glb">Model 1</option>
							<option value="model2.glb">Model 2</option>
							<option value="model3.glb">Model 3</option>
						</select>
					</label>
				)}

				<button type="submit">Start Customizing</button>
			</form>
			{showModal && (
				<div style={overlayStyle}>
					<div style={modalStyle}>
					<h3>Error</h3>
					<p>{errorMsg}</p>
					<button onClick={() => setShowModal(false)}>OK</button>
					</div>
				</div>
			)}
		</div>
	);
}