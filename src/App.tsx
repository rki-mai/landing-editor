import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
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
			</Routes>
		</BrowserRouter>
	);
}

export default App;
