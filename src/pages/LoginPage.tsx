import { useState } from "react";
import { ApiClient, Unauthorized } from "../components/apiClient";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import {
	FormContainer,
	FormHeader,
	EmailInput,
	PasswordInput,
	SubmitButton,
	ErrorMessage,
} from "../components/form";

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
			window.location.href = "/edit?projectId=exampleProject";
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
		</FormContainer>
	);
}
