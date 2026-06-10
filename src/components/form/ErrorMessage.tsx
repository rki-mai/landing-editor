import styles from "./form.module.css";

interface ErrorMessageProps {
	message: string | null;
}

// TODO: Remove null
export function ErrorMessage({ message }: ErrorMessageProps) {
	if (!message) return null;
	return <div className={styles.error}>{message}</div>;
}
