import styles from "./form.module.css";

interface SubmitButtonProps {
	label: string;
}

export const SubmitButton = ({ label }: SubmitButtonProps) => {
	return (
		<button type="submit" className={styles.button}>
			{label}
		</button>
	);
};
