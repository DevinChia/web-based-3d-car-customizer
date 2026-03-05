import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";

import Home from "../pages/Home/Home";
import AddProject from "../pages/AddProject/AddProject";
import Customize from "../pages/Customize/Customize";
import MyWorks from "../pages/MyWorks/MyWorks";

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route element={<Layout />}>
					<Route path="/add-project" element={<AddProject />} />
					<Route path="/customize/:id" element={<Customize />} />
					<Route path="/my-works" element={<MyWorks />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}