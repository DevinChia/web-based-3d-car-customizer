import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	return (
		<div className="home">
			<div className="home-text-container">
				<h1 className="home-title">3D Car Customizer</h1>
				<p className="home-intro">
				A web-based interactive 3D car customization platform that allows users to visualize and modify vehicle models in real-time. Built using modern web technologies, this application demonstrates the implementation of React and WebGL-based rendering for immersive product visualization directly in the browser.
				</p>
			</div>
			<div className="home-buttons-container">
				<button className="home-start-customizing-button" onClick={() => navigate("/add-project")}>Start Customizing</button>
				<button className="home-view-works-button" onClick={() => navigate("/my-works")}>View Works</button>
			</div>
		</div>
	);
}