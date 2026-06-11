import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import RegisterPage from "./pages/RegisterPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/edit" element={<EditorPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
