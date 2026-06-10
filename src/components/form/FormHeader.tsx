import styles from "./form.module.css";

interface FormHeaderProps {
	title: string;
}

export const FormHeader = ({ title }: FormHeaderProps) => {
	return <h1 className={styles.header}>{title}</h1>;
};
