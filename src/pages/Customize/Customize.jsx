import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../../services/projectService";

export default function Customize() {
	const { id } = useParams();
	const [project, setProject] = useState(null);
	const [loading, setLoading] = useState(true);

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

	const modelPath = `/models/${project.model_url}`;

	return (
		<div>
			<h1>Customize Page: {project.title}</h1>
			<p>Car Type: {project.car_type}</p>
			<p>Model Path: {modelPath}</p>
		</div>
	);
}