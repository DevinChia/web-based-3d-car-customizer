import "./MyWorks.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects, deleteProject } from "../../services/projectService";

export default function MyWorks() {
	const [projects, setProjects] = useState([]);
	const [sortBy, setSortBy] = useState("created_at");
	const [order, setOrder] = useState("desc");
	const [carType, setCarType] = useState("All");
	const navigate = useNavigate();

	const handleEdit = (id) => {
		navigate(`/customize/${id}`);
	};

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this project?");
		if (!confirmDelete) return;
	
		const success = await deleteProject(id);
	
		if (!success) {
			alert("Gagal delete project");
			return;
		}
	
		setProjects((prev) => prev.filter((p) => p.id !== id));
	};

	const formatDate = (date) => {
		const d = new Date(date);
		const day = String(d.getDate()).padStart(2, "0");
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const year = d.getFullYear();
		return `${day}-${month}-${year}`;
	};	

	useEffect(() => {
		const fetchProjects = async () => {
			const data = await getAllProjects(sortBy, order, carType);
			setProjects(data);
		};

		fetchProjects();
	}, [sortBy, order, carType]);

	return (
		<div className="my-works">
			<h1>My Works</h1>

			{/* Controls */}
			<div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
				<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
					<option value="title">Name</option>
					<option value="created_at">Created</option>
					<option value="updated_at">Updated</option>
				</select>

				<select value={order} onChange={(e) => setOrder(e.target.value)}>
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>

				<select value={carType} onChange={(e) => setCarType(e.target.value)}>
					<option value="All">All</option>
					<option value="Sedan">Sedan</option>
					<option value="SUV">SUV</option>
					<option value="Coupe">Coupe</option>
					<option value="Hatchback">Hatchback</option>
				</select>
			</div>

			{/* Card List */}
			<div className="my-works-card-list">
				{projects.map((project) => (
					<div key={project.id} className="project-card">
						<h3>{project.title}</h3>
						<p>Car Type: {project.car_type}</p>
						<p>Created: {formatDate(project.created_at)}</p>
						<div className="project-card-actions">
							<button onClick={() => handleEdit(project.id)}>
								Edit Project
							</button>
							<button onClick={() => handleDelete(project.id)}>
								Delete Project
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}