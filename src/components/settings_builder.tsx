import { ComponentSettings, IntegerSetting } from "./component_settings";
import { type LandingElement, type TextElement } from "./types"


type UpdateCallback = (updated: LandingElement) => void;


const buildSettingsForTextElement = (component: TextElement, onUpdate: UpdateCallback) => {
    return <ComponentSettings>
        <IntegerSetting
            name="Font size"
            value={component.styles?.fontSize || 10}
            min={10}
            onChange={value => onUpdate({ ...component, styles: { ...component.styles, fontSize: value }})}
        />
    </ComponentSettings>
};


export const buildSettingsForLandingElement = (component: LandingElement, onUpdate: UpdateCallback) => {
    if (component.element === "text") {
        return buildSettingsForTextElement(component, onUpdate);
    }

    throw new Error("Unsupported element");
};