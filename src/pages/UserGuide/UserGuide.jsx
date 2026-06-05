import "./UserGuide.css";

export default function UserGuide() {
	return (
		<div className="user-guide">
			<div className="guide-header">
				<h1>User Guide</h1>
				<p>
					This page provides instructions for using the 3D Car
					Customizer application. Please review the guide before
					using the application for the first time.
				</p>
			</div>

			<section className="guide-section">
				<h2>Video Tutorial</h2>

				<div className="video-container">
					<iframe
						src="https://www.youtube.com/embed/6eEw7P5VqNQ"
						title="3D Car Customizer Tutorial"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			</section>

			<section className="guide-section">
				<h2>How to Use the Application</h2>

				<div className="guide-steps">
					<div className="guide-step">
						<h3>Step 1</h3>
						<p>
							Click <strong>Start Customizing</strong> from the
							home page or go to the Add Project page using the navigation.
						</p>
					</div>

					<div className="guide-step">
						<h3>Step 2</h3>
						<p>
							Enter the project information such as project name
							and vehicle type.
						</p>
					</div>

					<div className="guide-step">
						<h3>Step 3</h3>
						<p>
							Select one of the provided vehicle models or upload
							your own .glb model.
						</p>
					</div>

					<div className="guide-step">
						<h3>Step 4</h3>
						<p>Create a new customization project.</p>
					</div>

					<div className="guide-step">
						<h3>Step 5</h3>
						<p>
							Choose the vehicle part (Body or Rim) that you want
							to customize.
						</p>
					</div>

					<div className="guide-step">
						<h3>Step 6</h3>
						<p>
							Select a color using the color picker or preset
							colors.
						</p>
					</div>

					<div className="guide-step">
						<h3>Step 7</h3>
						<p>
							Switch between 2D and 3D visualization modes to
							inspect the vehicle.
						</p>
					</div>

					<div className="guide-step">
						<h3>Step 8</h3>
						<p>
							Click the Save button to store the customization
							result.
						</p>
					</div>
				</div>
			</section>

			<section className="guide-section">
				<h2>Frequently Asked Questions</h2>

				<div className="faq-list">
					<div className="faq-item">
						<h3>What file format is supported?</h3>
						<p>
							The application currently supports 3D vehicle models
							in .glb format.
						</p>
					</div>

					<div className="faq-item">
						<h3>Can I upload my own vehicle model?</h3>
						<p>
							Yes. Users can upload compatible .glb vehicle
							models.
						</p>
					</div>

					<div className="faq-item">
						<h3>Why are some parts not changing color?</h3>
						<p>
							The uploaded model may use a structure that differs
							from the expected vehicle component arrangement.
						</p>
					</div>

					<div className="faq-item">
						<h3>What is the difference between 2D and 3D mode?</h3>
						<p>
							2D mode provides fixed viewpoints, while 3D mode
							allows free camera interaction.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}