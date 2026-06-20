import { FieldError, Input, Label, TextField } from "@heroui/react";

interface PasswordInputProps {
	onChange: (value: string) => void;
	isInvalid?: boolean;
}

export const PasswordInput = ({ isInvalid, onChange }: PasswordInputProps) => {
	return (
		<TextField
			isRequired
			name="password"
			type="password"
			onChange={onChange}
			isInvalid={isInvalid}
		>
			<Label>Password</Label>
			<Input placeholder="Enter your password" variant="secondary" />
			<FieldError />
		</TextField>
	);
};
