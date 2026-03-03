import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav style={{ padding: "20px", borderBottom: "1px solid #ccc" }}>
			<Link to="/" style={{ marginRight: "15px" }}>Home</Link>
			<Link to="/add-project" style={{ marginRight: "15px" }}>Add Project</Link>
			<Link to="/my-works">My Works</Link>
		</nav>
	);
}