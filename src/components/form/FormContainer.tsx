import { Form, Surface } from "@heroui/react";
import styles from "./form.module.css";

interface FormContainerProps {
	children: React.ReactNode;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const FormContainer = ({ children, onSubmit }: FormContainerProps) => {
	return (
		<div className={styles.container}>
			<Surface className="border rounded-4xl" variant="default">
				<Form className="flex w-96 flex-col gap-8 p-10" onSubmit={onSubmit}>
					{children}
				</Form>
			</Surface>
		</div>
	);
};
