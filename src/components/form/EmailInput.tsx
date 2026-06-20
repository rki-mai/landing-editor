import { FieldError, Input, Label, TextField } from "@heroui/react";

interface EmailInputProps {
	onChange: (value: string) => void;
	isInvalid?: boolean;
}

export const EmailInput = ({ isInvalid, onChange }: EmailInputProps) => {
	return (
		<TextField
			isRequired
			name="email"
			type="email"
			onChange={onChange}
			isInvalid={isInvalid}
		>
			<Label>Email</Label>
			<Input placeholder="john@example.com" variant="secondary" />
			<FieldError />
		</TextField>
	);
};
