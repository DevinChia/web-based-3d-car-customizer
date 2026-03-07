import "./AddProject.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTitleDuplicate, createProject, uploadModel } from "../../services/projectService";

export default function AddProject() {
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [carType, setCarType] = useState("Sedan");
	const [isUploadModel, setIsUploadModel] = useState(false);
	const [modelFile, setModelFile] = useState(null);
	const [defaultModel, setDefaultModel] = useState("toyota_camry.glb");
	const [errorMsg, setErrorMsg] = useState("");
	const [showModal, setShowModal] = useState(false);

	const MAX_FILE_SIZE = 50 * 1024 * 1024;

	const showError = (message) => {
		setErrorMsg(message);
		setShowModal(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShowModal(false);
		setErrorMsg("");

		if (!title.trim()) {
			showError("Title cannot be empty.");
			return;
		}

		const duplicate = await isTitleDuplicate(title);
		if (duplicate) {
			showError("This title is already in use. Please use another.");
			return;
		}

		if (isUploadModel && !modelFile) {
			showError("Please upload a model.");
			return;
		}

		if (isUploadModel && modelFile.size > MAX_FILE_SIZE) {
			showError("Model file is too large. Maximum size is 50 MB.");
			return;
		}		

		let modelUrl = null;

		// upload model ke storage
		if (isUploadModel) {
			modelUrl = await uploadModel(modelFile);
		
			if (!modelUrl) {
				showError("Failed to upload model.");
				return;
			}
		}		
		// pakai model default
		else {
			modelUrl = `/models/${defaultModel}`;
		}

		const project = {
			title: title.trim(),
			car_type: carType,
			upload_model: isUploadModel,
			model_url: modelUrl,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		const result = await createProject(project);
		if (!result) {
			showError("Terjadi error saat menyimpan project.");
			return;
		}

		navigate(`/customize/${result.id}`);
	};

	return (
		<div className="add-project">
			<form
				className="form-add-project"
				onSubmit={handleSubmit}
				>
				<h1>Add Project</h1>
				<div className="form-add-project-fields">
					<div className="title-field add-project-fields">
						<label>
							Title
						</label>
						<input
							className="project-title-input"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					<div className="car-type-field add-project-fields">
						<label>
							Car Type
						</label>
						<select className="car-type-selector add-project-select-field" value={carType} onChange={(e) => setCarType(e.target.value)}>
							<option>Sedan</option>
							<option>SUV</option>
							<option>Coupe</option>
							<option>Hatchback</option>
						</select>
					</div>

					<div className="upload-file-checkbox-field">
						<input
							className="upload-file-checkbox"
							type="checkbox"
							checked={isUploadModel}
							onChange={(e) => {
								setIsUploadModel(e.target.checked);
								setModelFile(null);
							}}
						/>
						<label>
							Upload Your Own Model
						</label>
					</div>

					{isUploadModel && (
						<div className="upload-file-field add-project-fields">
							<label>
								Upload File
							</label>
							<input
								className="upload-file-input"
								type="file"
								accept=".glb,.gltf,.obj"
								onChange={(e) => setModelFile(e.target.files[0])}
							/>
						</div>
					)}

					{!isUploadModel && (
						<div className="choose-model-field add-project-fields">
							<label>
								Choose a Model
							</label>
							<select
								className="choose-model-selector add-project-select-field"
								value={defaultModel}
								onChange={(e) => setDefaultModel(e.target.value)}
							>
								<option value="toyota_camry.glb">Toyota Camry</option>
								<option value="toyota_rav4.glb">Toyota RAV4</option>
								<option value="ford_mustang.glb">Ford Mustang</option>
								<option value="honda_jazz.glb">Honda Jazz</option>
							</select>
						</div>
					)}
				</div>

				<button className="project-start-customizing-button" type="submit">Start Customizing</button>
			</form>
			{showModal && (
				<div className="error-popup-background">
					<div className="error-popup">
						<h3>Error</h3>
						<p>{errorMsg}</p>
						<button onClick={() => setShowModal(false)}>OK</button>
					</div>
				</div>
			)}
		</div>
	);
}