import { useState } from "react";
import { ApiClient, Unauthorized } from "../components/apiClient";
import {
	AuthLink,
	EmailInput,
	ErrorMessage,
	FormContainer,
	FormHeader,
	PasswordInput,
	SubmitButton,
} from "../components/form";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const apiClient = new ApiClient({
		baseUrl: "",
	});

	const tokenProvider = new LocalStorageTokenProvider(apiClient);

	if (tokenProvider.hasRefreshToken()) {
		window.location.href = "/projects";
	}

	const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		try {
			const result = await apiClient.login({
				email,
				password,
			});

			tokenProvider.saveCredentials(result);
			window.location.href = "/projects";
		} catch (err) {
			if (err instanceof Unauthorized) {
				setError("Неверные данные для входа");
			} else {
				console.error(err);
			}
		}
	};

	return (
		<FormContainer onSubmit={handleLogin}>
			<FormHeader title="Login" />
			<EmailInput value={email} onChange={setEmail} />
			<PasswordInput value={password} onChange={setPassword} />
			<SubmitButton label="Login" />
			{error && <ErrorMessage message={error} />}
			<AuthLink
				text="Впервые здесь?"
				linkText="Зарегистрироваться"
				href="/register"
			/>
		</FormContainer>
	);
}
