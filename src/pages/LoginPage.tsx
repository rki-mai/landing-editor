import { useState } from "react";
import { ApiClient, Unauthorized } from "../components/apiClient";
import styles from "./LoginPage.module.css";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const apiClient = new ApiClient({
		baseUrl: "",
	});

	const tokenProvider = new LocalStorageTokenProvider(apiClient);

	const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		try {
			const result = await apiClient.login({
				email,
				password,
			});

			tokenProvider.saveCredentials(result);
			window.location.href = "/";
		} catch (err) {
			if (err instanceof Unauthorized) {
				setError("Неверные данные для входа");
			} else {
				console.error(err);
			}
		}
	};

	return (
		<div className={styles.loginContainer}>
			<form className={styles.loginForm} onSubmit={handleLogin}>
				<h1>Login</h1>
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
				<button type="submit">Login</button>
				{error && <div className={styles.error}>{error}</div>}
			</form>
		</div>
	);
}
