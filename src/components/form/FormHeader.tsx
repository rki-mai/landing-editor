interface FormHeaderProps {
	title: string;
}

export const FormHeader = ({ title }: FormHeaderProps) => {
	return <h1 className="text-2xl font-bold text-center">{title}</h1>;
};
