import { useState } from "react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log({ email, password });
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
			</form>
		</div>
	);
}
