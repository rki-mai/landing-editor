import styles from "./form.module.css";

interface EmailInputProps {
	value: string;
	onChange: (value: string) => void;
}

export const EmailInput = ({ value, onChange }: EmailInputProps) => {
	return (
		<input
			type="email"
			placeholder="Email"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			required
			className={styles.input}
		/>
	);
};
