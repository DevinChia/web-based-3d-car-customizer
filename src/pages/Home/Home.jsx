import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
	const navigate = useNavigate();
	const [showWelcome, setShowWelcome] = useState(false);

	useEffect(() => {
		const hasVisited = localStorage.getItem("hasVisited");

		if (!hasVisited) {
			setShowWelcome(true);
		}
	}, []);

	const closeWelcome = () => {
		localStorage.setItem("hasVisited", "true");
		setShowWelcome(false);
	};

	return (
		<>
			{showWelcome && (
				<div className="welcome-overlay">
					<div className="welcome-modal">
						<h2>Welcome</h2>
		
						<p>
							If this is your first time using the application,
							please read the User Guide before continuing.
						</p>
		
						<div className="welcome-actions">
							<button
								onClick={() => {
									closeWelcome();
									navigate("/user-guide");
								}}
							>
								View Guide
							</button>
		
							<button onClick={closeWelcome}>
								Continue
							</button>
						</div>
					</div>
				</div>
			)}
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
		</>
	);
}