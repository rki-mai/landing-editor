import styles from "./form.module.css";

interface FormContainerProps {
	children: React.ReactNode;
	onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export function FormContainer({ children, onSubmit }: FormContainerProps) {
	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={onSubmit}>
				{children}
			</form>
		</div>
	);
}
