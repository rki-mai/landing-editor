import {
	ColorArea,
	ColorField,
	ColorPicker,
	ColorSlider,
	ColorSwatch,
	Input,
	type Key,
	Label,
	ListBox,
	NumberField,
	Select,
	TextArea,
	TextField,
} from "@heroui/react";
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
	return (
		<div className={`flex items-center ${styles.settingContainerName}`}>
			<Label className="font-normal">{name}</Label>
		</div>
	);
};

const SettingValue = ({
	children,
}: {
	children: React.ReactNode | React.ReactNode[];
}) => {
	return <div className={styles.settingContainerValue}>{children}</div>;
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
				<div>
					<NumberField
						name="number-field"
						onChange={(value) => onChange(value)}
						value={value}
						variant="secondary"
						minValue={min}
						maxValue={max}
					>
						<NumberField.Group>
							<NumberField.DecrementButton />
							<NumberField.Input />
							<NumberField.IncrementButton />
						</NumberField.Group>
					</NumberField>
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
			<SettingValue>
				<ColorPicker
					value={color}
					onChange={(value) => onChange(value.toString("hex"))}
				>
					<ColorPicker.Trigger>
						<ColorSwatch size="sm" className="rounded-full" />
					</ColorPicker.Trigger>
					<ColorPicker.Popover>
						<ColorArea
							aria-label="Color area"
							className="max-w-full"
							colorSpace="hsb"
							xChannel="saturation"
							yChannel="brightness"
						>
							<ColorArea.Thumb />
						</ColorArea>
						<ColorSlider
							aria-label="Hue slider"
							channel="hue"
							className="flex-1"
							colorSpace="hsb"
						>
							<ColorSlider.Track>
								<ColorSlider.Thumb />
							</ColorSlider.Track>
						</ColorSlider>
						<ColorField aria-label="Color field">
							<ColorField.Group variant="secondary">
								<ColorField.Prefix>
									<ColorSwatch className="rounded-full" size="xs" />
								</ColorField.Prefix>
								<ColorField.Input />
							</ColorField.Group>
						</ColorField>
					</ColorPicker.Popover>
				</ColorPicker>
			</SettingValue>
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
				<TextArea
					className="w-full"
					variant="secondary"
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
					<TextField variant="secondary" value={value} onChange={onChange}>
						<Input />
					</TextField>
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
	const validateKey = (key: Key | null) => {
		for (const option of options) {
			if (key === option.value) {
				return key as T;
			}
		}

		throw new Error(`Unknown key type ${key}`);
	};

	return (
		<SettingContainer>
			<SettingName name={name} />
			<SettingValue>
				<div className={styles.inputField}>
					<Select
						variant="secondary"
						onChange={(e) => onChange(validateKey(e))}
						value={value}
						className="min-w-30"
					>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox>
								{options.map((option) => (
									<ListBox.Item id={option.value} textValue={option.value}>
										{option.label}
										<ListBox.ItemIndicator />
									</ListBox.Item>
								))}
							</ListBox>
						</Select.Popover>
					</Select>
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
