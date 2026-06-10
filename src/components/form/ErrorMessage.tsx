import styles from "./form.module.css";

interface ErrorMessageProps {
	message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
	return <div className={styles.error}>{message}</div>;
}
