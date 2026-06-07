import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
	const params = new URLSearchParams(window.location.search);
	const projectId = params.get("projectId");

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/edit" element={<EditorPage projectId={projectId} />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
