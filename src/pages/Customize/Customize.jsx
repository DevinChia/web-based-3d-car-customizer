import "./Customize.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById, updateProject } from "../../services/projectService";
import Viewer from "../../components/Viewer";

export default function Customize() {
	const { id } = useParams();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);
	const [bodyColor, setBodyColor] = useState("");
	const [rimColor, setRimColor] = useState("");
	const [originalBodyColor, setOriginalBodyColor] = useState("");
	const [originalRimColor, setOriginalRimColor] = useState("");
	const [selectedPart, setSelectedPart] = useState("body");
	const [colorHistory, setColorHistory] = useState([]);
	const [tempColor, setTempColor] = useState("#ffffff");
	const [isSaving, setIsSaving] = useState(false);
	const [isModelLoading, setIsModelLoading] = useState(true);

	const addToHistory = (color) => {
		setColorHistory((prev) => {
			const newHistory = [color, ...prev.filter((c) => c !== color)];
			return newHistory.slice(0, 4);
		});
	};

	const [toast, setToast] = useState({
		show: false,
		message: "",
		type: "success",
	});

	useEffect(() => {
		const fetchProject = async () => {
			const data = await getProjectById(id);
			setProject(data);

			setBodyColor(data.body_color);
			setRimColor(data.rim_color);
			setTempColor("#FFFFFF");

			setOriginalBodyColor(data.body_color);
			setOriginalRimColor(data.rim_color);
	
			setLoading(false);
		};

		fetchProject();
	}, [id]);

	useEffect(() => {
		if (toast.show) {
			const timer = setTimeout(() => {
				setToast((prev) => ({ ...prev, show: false }));
			}, 3000);
	
			return () => clearTimeout(timer);
		}
	}, [toast.show]);

	if (loading) return <p>Loading...</p>;
	if (!project) return <p>Project tidak ditemukan.</p>;

	const modelPath = project.model_url;

	const showToast = (message, type = "success") => {
		if (toast.show) {
			setToast((prev) => ({ ...prev, show: false }));
	
			setTimeout(() => {
				setToast({
					show: true,
					message,
					type,
				});
			}, 400);
		} else {
			setToast({
				show: true,
				message,
				type,
			});
		}
	};

	const handleSave = async () => {
		const isChanged =
			bodyColor !== originalBodyColor ||
			rimColor !== originalRimColor;

		if (!isChanged) {
			showToast("No changes to save", "info");
			return;
		}

		setIsSaving(true);

		const result = await updateProject(id, {
			body_color: bodyColor,
			rim_color: rimColor,
			updated_at: new Date().toISOString(),
		});

		if (!result) {
			setIsSaving(false);
			showToast("Failed to save", "error");
			return;
		}

		setOriginalBodyColor(bodyColor);
		setOriginalRimColor(rimColor);

		showToast("Saved successfully!", "success");

		setIsSaving(false);
	};

	return (
		<div className="viewer-container">

			<div className="sidebar">
				<h2 className="sidebar-title">{project.title}</h2>

				<hr />

				<p className="section-title">Parts</p>
				<div className="parts-container">
					<button
						disabled={isModelLoading || isSaving}
						className={`part-button ${selectedPart === "body" ? "active" : ""}`}
						onClick={() => setSelectedPart("body")}
					>
						Body
					</button>

					<button
						disabled={isModelLoading || isSaving}
						className={`part-button ${selectedPart === "rim" ? "active" : ""}`}
						onClick={() => setSelectedPart("rim")}
					>
						Rim
					</button>
				</div>

				<hr />

				<p className="section-title">Color</p>

				<div className="color-picker">
					<input
						disabled={isModelLoading || isSaving}
						type="color"
						value={tempColor}
						onChange={(e) => {
							const color = e.target.value;
							setTempColor(color);

							if (selectedPart === "body") setBodyColor(color);
							else setRimColor(color);
						}}
						onBlur={() => {
							addToHistory(tempColor);
						}}
					/>
					<p>Choose a color</p>
				</div>

				<div className="color-history">
					{colorHistory.map((color) => (
						<div
							key={color}
							className="color-box"
							style={{ backgroundColor: color }}
							onClick={() => {
								if (isModelLoading || isSaving) return;
								if (selectedPart === "body") setBodyColor(color);
								else setRimColor(color);
							}}
						/>
					))}
				</div>

				<div className="preset-colors">
					{["#ff0000", "#0000ff", "#00ff00", "#000000", "#ffffff"].map((color) => (
						<div
							key={color}
							className="color-box"
							style={{ backgroundColor: color }}
							onClick={() => {
								if (isModelLoading || isSaving) return;
								addToHistory(color);
							
								if (selectedPart === "body") setBodyColor(color);
								else setRimColor(color);
							}}
						/>
					))}
				</div>

				<button disabled={isModelLoading || isSaving} onClick={handleSave} className="save-button">
					Save
				</button>
			</div>
	
			<Viewer
				modelPath={modelPath}
				bodyColor={bodyColor}
				rimColor={rimColor}
				onLoadingChange={setIsModelLoading}
			/>

			<div className={`toast ${toast.show ? "show" : ""} ${toast.type}`}>
				{toast.message}
			</div>
			{isSaving && <div className="overlay"></div>}
		</div>
	);
}