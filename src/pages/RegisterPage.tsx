import { useState } from "react";
import {
	ApiClient,
	HttpError,
	UserAlreadyExists,
} from "../components/apiClient";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import {
	FormContainer,
	FormHeader,
	EmailInput,
	PasswordInput,
	SubmitButton,
	ErrorMessage,
	AuthLink,
} from "../components/form";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const apiClient = new ApiClient({
		baseUrl: "",
	});

	const tokenProvider = new LocalStorageTokenProvider(apiClient);

	if (tokenProvider.hasRefreshToken()) {
		window.location.href = "/edit?projectId=exampleProject";
	}

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
			} else if (err instanceof HttpError && err.statusCode === 400) {
				setError("Ошибка: неверные данные");
			} else {
				console.error("Unexpected error:", err);
			}
		}
	};

	return (
		<FormContainer onSubmit={handleRegister}>
			<FormHeader title="Register" />
			<EmailInput value={email} onChange={setEmail} />
			<PasswordInput value={password} onChange={setPassword} />
			<SubmitButton label="Register" />
			{error && <ErrorMessage message={error} />}
			<AuthLink text="Уже есть аккаунт?" linkText="Войти" href="/login" />
		</FormContainer>
	);
}
