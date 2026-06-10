import { useState } from "react";
import {
	ApiClient,
	HttpError,
	UserAlreadyExists,
} from "../components/apiClient";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import styles from "./LoginPage.module.css";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const apiClient = new ApiClient({
		baseUrl: "",
	});

	const tokenProvider = new LocalStorageTokenProvider(apiClient);

	const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		try {
			await apiClient.register({
				email,
				password,
			});

			const result = await apiClient.login({
				email,
				password,
			});

			tokenProvider.saveCredentials(result);
			window.location.href = "/edit?projectId=exampleProject";
		} catch (err) {
			if (err instanceof UserAlreadyExists) {
				setError("Пользователь с таким email уже существует");
			} else {
				console.error("Unexpected error:", err);
			}
		}
	};

	return (
		<div className={styles.loginContainer}>
			<form className={styles.loginForm} onSubmit={handleRegister}>
				<h1>Register</h1>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">Register</button>
				{error && <div className={styles.error}>{error}</div>}
			</form>
		</div>
	);
}
