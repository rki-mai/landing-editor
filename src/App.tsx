import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import ProjectsPage from "./pages/ProjectsPage";
import PublicationsPage from "./pages/PublicationsPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
	const params = new URLSearchParams(window.location.search);
	const projectId = params.get("projectId");

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/edit" element={<EditorPage projectId={projectId} />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/projects" element={<ProjectsPage />} />
				<Route path="/publications" element={<PublicationsPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
