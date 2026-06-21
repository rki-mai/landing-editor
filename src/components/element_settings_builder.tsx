import { Bold, Italic, Underline } from "@gravity-ui/icons";
import {
	ChoiceBoxSetting,
	ColorSettings,
	ElementSettings,
	FlagButtonSetting,
	FlagButtonSettingsGroup,
	IntegerSetting,
	TextAreaSetting,
	TextFieldSetting,
} from "./element_settings";
import {
	type ButtonElement,
	type ImageElement,
	type LandingElement,
	type LinkElement,
	type TextElement,
} from "./types";

type UpdateCallback = (updated: LandingElement) => void;
type CloseCallback = () => void;

const buildSettingsForTextElement = (
	element: TextElement,
	onUpdate: UpdateCallback,
	onClose: CloseCallback,
) => {
	const color = element.styles?.color ?? "#000000";

	return (
		<ElementSettings onClose={onClose}>
			<IntegerSetting
				name="Font size"
				value={element.styles?.fontSize || 10}
				min={10}
				max={60}
				onChange={(value) =>
					onUpdate({
						...element,
						styles: { ...element.styles, fontSize: value },
					})
				}
			/>
			<ColorSettings
				name="Font color"
				color={color}
				onChange={(value) =>
					onUpdate({ ...element, styles: { ...element.styles, color: value } })
				}
			/>
			<FlagButtonSettingsGroup name="Style">
				<FlagButtonSetting
					id="bold"
					onChange={(value) =>
						onUpdate({ ...element, styles: { ...element.styles, bold: value } })
					}
					value={element.styles?.bold || false}
				>
					<Bold />
				</FlagButtonSetting>
				<FlagButtonSetting
					id="italic"
					onChange={(value) =>
						onUpdate({
							...element,
							styles: { ...element.styles, italic: value },
						})
					}
					value={element.styles?.italic || false}
				>
					<Italic />
				</FlagButtonSetting>
				<FlagButtonSetting
					id="underline"
					onChange={(value) => {
						console.log("Updated value: ", value);
						onUpdate({
							...element,
							styles: { ...element.styles, underline: value },
						});
					}}
					value={element.styles?.underline || false}
				>
					<Underline />
				</FlagButtonSetting>
			</FlagButtonSettingsGroup>
			<TextAreaSetting
				name="Content"
				value={element.value}
				onChange={(value) => onUpdate({ ...element, value: value })}
			/>
		</ElementSettings>
	);
};

const buildSettingsForLinkElement = (
	element: LinkElement,
	onUpdate: UpdateCallback,
	onClose: () => void,
) => {
	return (
		<ElementSettings onClose={onClose}>
			<TextFieldSetting
				name="Content"
				value={element.value}
				onChange={(value) => onUpdate({ ...element, value: value })}
			/>
			<TextFieldSetting
				name="URL"
				value={element.src}
				onChange={(value) => onUpdate({ ...element, src: value })}
			/>
			<ChoiceBoxSetting
				name="Text decoration"
				value={element.styles?.textDecoration || "underline"}
				options={[
					{ label: "Underline", value: "underline" },
					{ label: "None", value: "none" },
				]}
				onChange={(value) =>
					onUpdate({
						...element,
						styles: { ...element.styles, textDecoration: value },
					})
				}
			/>
		</ElementSettings>
	);
};

const buildSettingsForButtonElement = (
	element: ButtonElement,
	onUpdate: UpdateCallback,
	onClose: CloseCallback,
) => {
	return (
		<ElementSettings onClose={onClose}>
			<TextFieldSetting
				name="Text"
				value={element.value}
				onChange={(value) => onUpdate({ ...element, value: value })}
			/>
			<TextFieldSetting
				name="URL"
				value={element.src}
				onChange={(value) => onUpdate({ ...element, src: value })}
			/>
			<ColorSettings
				name="Background color"
				color={element.styles?.backgroundColor || "#007bff"}
				onChange={(value) =>
					onUpdate({
						...element,
						styles: { ...element.styles, backgroundColor: value },
					})
				}
			/>
			<ColorSettings
				name="Color"
				color={element.styles?.color || "#ffffff"}
				onChange={(value) =>
					onUpdate({ ...element, styles: { ...element.styles, color: value } })
				}
			/>
		</ElementSettings>
	);
};

const buildSettingsForImageElement = (
	element: ImageElement,
	onUpdate: UpdateCallback,
	onClose: CloseCallback,
) => {
	return (
		<ElementSettings onClose={onClose}>
			<TextFieldSetting
				name="URL"
				value={element.value}
				onChange={(value) => onUpdate({ ...element, value: value })}
			/>
			<TextFieldSetting
				name="Alt text"
				value={element.alt || ""}
				onChange={(value) => onUpdate({ ...element, alt: value })}
			/>
			<IntegerSetting
				name="Size"
				value={element.styles?.width || 100}
				min={1}
				max={100}
				onChange={(value) =>
					onUpdate({ ...element, styles: { ...element.styles, width: value } })
				}
			/>
			<ChoiceBoxSetting
				name="Position"
				value={element.styles?.position || "left"}
				options={[
					{ label: "Left", value: "left" },
					{ label: "Right", value: "right" },
					{ label: "Center", value: "center" },
				]}
				onChange={(value) =>
					onUpdate({
						...element,
						styles: { ...element.styles, position: value },
					})
				}
			/>
		</ElementSettings>
	);
};

export const buildSettingsForLandingElement = (
	component: LandingElement,
	onUpdate: UpdateCallback,
	onClose: CloseCallback,
) => {
	switch (component.element) {
		case "text":
			return buildSettingsForTextElement(component, onUpdate, onClose);
		case "link":
			return buildSettingsForLinkElement(component, onUpdate, onClose);
		case "image":
			return buildSettingsForImageElement(component, onUpdate, onClose);
		case "button":
			return buildSettingsForButtonElement(component, onUpdate, onClose);
		default:
			throw new Error("Unsupported element");
	}
};
