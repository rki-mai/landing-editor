import { ChoiceBoxSetting, ColorSettings, ElementSettings, IntegerSetting, TextAreaSetting, TextFieldSetting } from "./element_settings";
import { type ImageElement, type LandingElement, type LinkElement, type TextElement } from "./types"


type UpdateCallback = (updated: LandingElement) => void;


const buildSettingsForTextElement = (element: TextElement, onUpdate: UpdateCallback) => {
    const color = element.styles?.color ?? "#000000";

    return <ElementSettings>
        <IntegerSetting
            name="Font size"
            value={element.styles?.fontSize || 10}
            min={10}
            max={60}
            onChange={value => onUpdate({ ...element, styles: { ...element.styles, fontSize: value }})}
        />
        <ColorSettings
            name="Font color"
            color={color}
            onChange={value => onUpdate({ ...element, styles: { ...element.styles, color: value } })}
        />
        <TextAreaSetting
            name="Conent"
            value={element.value}
            onChange={value => onUpdate({ ...element, value: value })}
        />
    </ElementSettings>
};


const buildSettingsForLinkElement = (element: LinkElement, onUpdate: UpdateCallback) => {
    return <ElementSettings>
        <TextFieldSetting
            name="Content"
            value={element.value}
            onChange={value => onUpdate({ ...element, value: value })}
        />
        <TextFieldSetting
            name="URL"
            value={element.src}
            onChange={value => onUpdate({ ...element, src: value })}
        />
        <ChoiceBoxSetting
            name="Text decoration"
            value={element.styles?.textDecoration || "underline"}
            options={[
                { label: "Underline", value: "underline" },
                { label: "None", value: "none" }
            ]}
            onChange={value => onUpdate({ ...element, styles: { ...element.styles, textDecoration: value } })}
        />
    </ElementSettings>;
};


const buildSettingsForImageElement = (element: ImageElement, onUpdate: UpdateCallback) => {
    return <ElementSettings>
        <TextFieldSetting
            name="URL"
            value={element.value}
            onChange={value => onUpdate({ ...element, value: value })}
        />
        <TextFieldSetting
            name="Alt text"
            value={element.alt || ""}
            onChange={value => onUpdate({ ...element, alt: value })}
        />
        <IntegerSetting
            name="Size"
            value={element.styles?.width || 100}
            min={1}
            max={100}
            onChange={value => onUpdate({ ...element, styles: { ...element.styles, width: value } })}
        />
        <ChoiceBoxSetting
            name="Position"
            value={element.styles?.position || "left"}
            options={[
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
                { label: "Center", value: "center" },
            ]}
            onChange={value => onUpdate({ ...element, styles: { ...element.styles, position: value } })}
        />
    </ElementSettings>
};


export const buildSettingsForLandingElement = (component: LandingElement, onUpdate: UpdateCallback) => {
    switch (component.element) {
        case "text":
            return buildSettingsForTextElement(component, onUpdate);
        case "link":
            return buildSettingsForLinkElement(component, onUpdate);
        case "image":
            return buildSettingsForImageElement(component, onUpdate);
        default:
            throw new Error("Unsupported element");
    }
};
