import { useState } from "react";
import {
	ApiClient,
	HttpError,
	UserAlreadyExists,
} from "../components/apiClient";
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

export default function RegisterPage() {
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

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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
			window.location.href = "/projects";
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
			<FormHeader title="Регистрация" />
			<EmailInput onChange={setEmail} isInvalid={error !== null} />
			<PasswordInput onChange={setPassword} isInvalid={error !== null} />
			<div>
				<SubmitButton label="Зарегестрироваться" />
				{error && <ErrorMessage error={error} />}
			</div>
			<AuthLink text="Уже есть аккаунт?" linkText="Войти" href="/login" />
		</FormContainer>
	);
}
