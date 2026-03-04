import { useEffect, useState } from "react";
import { getAllProjects } from "../../services/projectService";

export default function MyWorks() {
	const [projects, setProjects] = useState([]);
	const [sortBy, setSortBy] = useState("created_at");
	const [order, setOrder] = useState("desc");
	const [carType, setCarType] = useState("All");

	useEffect(() => {
		const fetchProjects = async () => {
			const data = await getAllProjects(sortBy, order, carType);
			setProjects(data);
		};

		fetchProjects();
	}, [sortBy, order, carType]);

	return (
		<div>
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
			<div style={{ display: "grid", gap: "1rem" }}>
				{projects.map((project) => (
					<div key={project.id} style={{ border: "1px solid gray", padding: "1rem" }}>
						<h3>{project.title}</h3>
						<p>Car Type: {project.car_type}</p>
						<p>Created: {new Date(project.created_at).toLocaleString()}</p>
					</div>
				))}
			</div>
		</div>
	);
}