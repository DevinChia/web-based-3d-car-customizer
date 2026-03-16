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
			<h1 className="viewer-title">{project.title}</h1>
			<button className="red-button" onClick={()=>setBodyColor("#ff0000")}>
				Red body
			</button>
			<button className="red-rim-button" onClick={()=>setRimColor("#ff0000")}>
				Red rim
			</button>
			<Viewer modelPath={modelPath} bodyColor={bodyColor} rimColor={rimColor}/>
		</div>
	);
}