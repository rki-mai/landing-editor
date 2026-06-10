import styles from "./form.module.css";

interface PasswordInputProps {
	value: string;
	onChange: (value: string) => void;
}

export const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
	return (
		<input
			type="password"
			placeholder="Password"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			required
			className={styles.input}
		/>
	);
};
