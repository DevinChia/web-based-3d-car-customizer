import "./Customize.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import Viewer from "../../components/Viewer";

export default function Customize() {
	const { id } = useParams();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);
	const [bodyColor, setBodyColor] = useState("");
	const [rimColor, setRimColor] = useState("");
	const [selectedPart, setSelectedPart] = useState("body");
	const [colorHistory, setColorHistory] = useState([]);
	const [tempColor, setTempColor] = useState("#ffffff");

	const addToHistory = (color) => {
		setColorHistory((prev) => {
			const newHistory = [color, ...prev.filter((c) => c !== color)];
			return newHistory.slice(0, 4);
		});
	};

	useEffect(() => {
		const fetchProject = async () => {
			const data = await getProjectById(id);
			setProject(data);
			setLoading(false);
		};

		fetchProject();
	}, [id]);

	if (loading) return <p>Loading...</p>;
	if (!project) return <p>Project tidak ditemukan.</p>;

	const modelPath = project.model_url;

	return (
		<div className="viewer-container">
	
			{/* LEFT SIDEBAR */}
			<div className="sidebar">
				<h2 className="sidebar-title">{project.title}</h2>
	
				<hr />
	
				<p className="section-title">Parts</p>
				<div className="parts-container">
					<button
						className={`part-button ${selectedPart === "body" ? "active" : ""}`}
						onClick={() => setSelectedPart("body")}
					>
						Body
					</button>
	
					<button
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
								addToHistory(color);
							
								if (selectedPart === "body") setBodyColor(color);
								else setRimColor(color);
							}}							
						/>
					))}
				</div>
			</div>
	
			{/* VIEWER */}
			<Viewer
				modelPath={modelPath}
				bodyColor={bodyColor}
				rimColor={rimColor}
			/>
		</div>
	);
}
