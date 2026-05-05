import { ColorSettings, ElementSettings, IntegerSetting, TextAreaSetting } from "./element_settings";
import { type LandingElement, type TextElement } from "./types"


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


export const buildSettingsForLandingElement = (component: LandingElement, onUpdate: UpdateCallback) => {
    if (component.element === "text") {
        return buildSettingsForTextElement(component, onUpdate);
    }

    throw new Error("Unsupported element");
};