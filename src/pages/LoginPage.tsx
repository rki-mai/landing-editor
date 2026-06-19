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

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
			<FormHeader title="Авторизация" />
			<EmailInput onChange={setEmail} isInvalid={error !== null} />
			<PasswordInput onChange={setPassword} isInvalid={error !== null} />
			<div>
				<SubmitButton label="Вход" />
				{error && <ErrorMessage error={error} />}
			</div>
			<AuthLink
				text="Впервые здесь?"
				linkText="Зарегистрироваться"
				href="/register"
			/>
		</FormContainer>
	);
}
