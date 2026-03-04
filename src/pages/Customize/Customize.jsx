import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectByTitle } from "../../services/projectService";

export default function Customize() {
	const { title } = useParams();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProject = async () => {
			const data = await getProjectByTitle(title);
			setProject(data);
			setLoading(false);
		};

		fetchProject();
	}, [title]);

	if (loading) return <p>Loading...</p>;
	if (!project) return <p>Project tidak ditemukan.</p>;

	// ✅ Build path konsisten
	const modelPath = `/models/${project.model_url}`;

	return (
		<div>
			<h1>Customize Page: {project.title}</h1>
			<p>Car Type: {project.car_type}</p>
			<p>Model Path: {modelPath}</p>
		</div>
	);
}