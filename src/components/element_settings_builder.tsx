import { ColorSettings, ElementSettings, IntegerSetting } from "./element_settings";
import { type LandingElement, type TextElement } from "./types"


type UpdateCallback = (updated: LandingElement) => void;


const buildSettingsForTextElement = (component: TextElement, onUpdate: UpdateCallback) => {
    const color = component.styles?.color ?? "#000000";

    return <ElementSettings>
        <IntegerSetting
            name="Font size"
            value={component.styles?.fontSize || 10}
            min={10}
            max={60}
            onChange={value => onUpdate({ ...component, styles: { ...component.styles, fontSize: value }})}
        />
        <ColorSettings
            name="Font color"
            color={color}
            onChange={value => onUpdate({ ...component, styles: { ...component.styles, color: value } })}/>
    </ElementSettings>
};


export const buildSettingsForLandingElement = (component: LandingElement, onUpdate: UpdateCallback) => {
    if (component.element === "text") {
        return buildSettingsForTextElement(component, onUpdate);
    }

    throw new Error("Unsupported element");
};