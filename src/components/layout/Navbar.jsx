import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
	return (
	<div className="navbar">
		<div className="navbar-icon">
			<svg 
				fill="#000000" 
				viewBox="0 0 24 24" 
				id="steering-wheel" 
				data-name="Flat Color" 
				xmlns="http://www.w3.org/2000/svg" 
				className="icon flat-color"
			>
				<path 
					id="primary" 
					d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,2a8,8,0,0,1,7.38,4.92A29.93,29.93,0,0,0,12,8a29.63,29.63,0,0,0-7.4.94A8,8,0,0,1,12,4ZM4,12.67l1.11-.13A4.38,4.38,0,0,1,10,16.89v2.85A8,8,0,0,1,4,12.67Zm10,7.07V16.89a4.38,4.38,0,0,1,4.86-4.35l1.11.13A8,8,0,0,1,14,19.74Z" 
					style={{ fill: "rgb(0, 0, 0)" }}
				></path>
			</svg>
		</div>
		<div className="navbar-links">
			<Link to="/">Home</Link>
			<Link to="/add-project">Add Project</Link>
			<Link to="/my-works">My Works</Link>
			<Link to="/user-guide">User Guide</Link>
		</div>
	</div>
	);
}