import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Drawer } from "./drawer";
import styles from "./element_settings.module.css";

const SettingContainer = ({
	children,
	multiline,
}: {
	children: React.ReactNode[];
	multiline?: boolean;
}) => {
	const inlineClass = multiline ? styles.multilineField : styles.inlineField;

	return (
		<div className={`${styles.settingContainer} ${inlineClass}`}>
			{children}
		</div>
	);
};

const SettingName = ({ name }: { name: string }) => {
	return <div className={styles.settingContainerName}>{name}</div>;
};

const SettingValue = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	return <div className={styles.settingContainerValue}>{children}</div>;
};

const ColorPicker = ({
	color,
	onChange,
}: {
	color: string;
	onChange: (value: string) => void;
}) => {
	const [isFocused, setIsFocused] = useState<boolean>(false);

	return (
		<SettingValue>
			<div
				className={styles.colorInputPreview}
				style={{ backgroundColor: color }}
				onClick={() => setIsFocused(true)}
			/>
			{isFocused && (
				<div
					className={styles.colorInputPicker}
					onBlur={() => setIsFocused(false)}
				>
					<HexColorPicker color={color} onChange={onChange} />
				</div>
			)}
		</SettingValue>
	);
};

export const IntegerSetting = ({
	name,
	value,
	min,
	max,
	onChange,
}: {
	name: string;
	value: number;
	min?: number;
	max?: number;
	onChange: (value: number) => void;
}) => {
	return (
		<SettingContainer>
			<SettingName name={name} />
			<SettingValue>
				<div className={styles.inputField}>
					<input
						type="number"
						min={min}
						max={max}
						onChange={(e) => onChange(parseFloat(e.target.value))}
						value={value}
					/>
				</div>
			</SettingValue>
		</SettingContainer>
	);
};

export const ColorSettings = ({
	name,
	color,
	onChange,
}: {
	name: string;
	color: string;
	onChange: (value: string) => void;
}) => {
	return (
		<SettingContainer>
			<SettingName name={name} />
			<ColorPicker color={color} onChange={onChange} />
		</SettingContainer>
	);
};

export const TextAreaSetting = ({
	name,
	value,
	onChange,
}: {
	name: string;
	value: string;
	onChange: (value: string) => void;
}) => {
	return (
		<SettingContainer multiline={true}>
			<SettingName name={name} />
			<SettingValue>
				<textarea
					className={styles.textArea}
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			</SettingValue>
		</SettingContainer>
	);
};

export const TextFieldSetting = ({
	name,
	value,
	onChange,
}: {
	name: string;
	value: string;
	onChange: (value: string) => void;
}) => {
	return (
		<SettingContainer>
			<SettingName name={name} />
			<SettingValue>
				<div className={styles.inputField}>
					<input
						type="text"
						value={value}
						onChange={(e) => onChange(e.target.value)}
					/>
				</div>
			</SettingValue>
		</SettingContainer>
	);
};

export const ChoiceBoxSetting = <T extends string>({
	name,
	value,
	options,
	onChange,
}: {
	name: string;
	value: T;
	options: { label: string; value: T }[];
	onChange: (value: T) => void;
}) => {
	return (
		<SettingContainer>
			<SettingName name={name} />
			<SettingValue>
				<div className={styles.inputField}>
					<select value={value} onChange={(e) => onChange(e.target.value as T)}>
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</SettingValue>
		</SettingContainer>
	);
};

export const ElementSettings = ({
	children,
	onClose,
}: {
	children: React.ReactNode | React.ReactNode[];
	onClose: () => void;
}) => {
	return (
		<Drawer title="Настройки" onClose={onClose}>
			{children}
		</Drawer>
	);
};
