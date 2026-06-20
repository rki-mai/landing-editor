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
	const [isInvalid, setIsInvalid] = useState<true | undefined>(undefined);

	const apiClient = new ApiClient({
		baseUrl: "",
	});

	const tokenProvider = new LocalStorageTokenProvider(apiClient);

	if (tokenProvider.hasRefreshToken()) {
		window.location.href = "/projects";
	}

	const resetIsInvalidOnChange = (onChange: (value: string) => void) => {
		return (value: string) => {
			setIsInvalid(undefined);
			onChange(value);
			setError(null);
		};
	};

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
				setIsInvalid(true);
			} else if (err instanceof HttpError && err.statusCode === 400) {
				setError("Ошибка: неверные данные");
				setIsInvalid(true);
			} else {
				console.error("Unexpected error:", err);
			}
		}
	};

	return (
		<FormContainer onSubmit={handleRegister}>
			<FormHeader title="Регистрация" />
			<EmailInput
				onChange={resetIsInvalidOnChange(setEmail)}
				isInvalid={isInvalid}
			/>
			<PasswordInput
				onChange={resetIsInvalidOnChange(setPassword)}
				isInvalid={isInvalid}
			/>
			<div>
				<SubmitButton label="Зарегистрироваться" />
				{error && <ErrorMessage error={error} />}
			</div>
			<AuthLink text="Уже есть аккаунт?" linkText="Войти" href="/login" />
		</FormContainer>
	);
}
