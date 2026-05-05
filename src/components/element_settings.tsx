import React, { useState } from 'react';
import styles from './element_settings.module.css'
import closeButton from '../assets/close-btn.png'
import { HexColorPicker } from 'react-colorful';

const Header = () => {
    return <div className={styles.settingsHeader}>
        <div className={styles.settingsHeaderTitle}>Component settings</div>
        <div className={styles.settingsCloseIcon}>
            <img style={{ width: "100%", display: "block" }} src={closeButton} />
        </div>
    </div>
};

const Body = ({ children }: {children: React.ReactNode | React.ReactNode[]}) => {
    return <div>{children}</div>
};

const SettingContainer = ({ children, multiline }: { children: React.ReactNode[], multiline?: boolean }) => {
    const inlineClass = multiline ? styles.multilineField : styles.inlineField;

    return <div className={`${styles.settingContainer} ${inlineClass}`}>
        {children}
    </div>
};

const SettingName = ({ name }: { name: string }) => {
    return <div className={styles.settingContainerName}>
        {name}
    </div>;
};

const SettingValue = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
    return <div className={styles.settingContainerValue}>
        {children}
    </div>;
};

const ColorPicker = ({ color, onChange }: {color: string, onChange: (value: string) => void}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return <SettingValue>
        <div
            className={styles.colorInputPreview}
            style={{ backgroundColor: color }}
            onClick={() => setIsFocused(true)}
        />
        {isFocused &&
            <div className={styles.colorInputPicker} onBlur={() => setIsFocused(false)}>
                <HexColorPicker color={color} onChange={onChange} />
            </div>
        }
    </SettingValue>;
};

export const IntegerSetting = ({
    name,
    value,
    min,
    max,
    onChange,
}: {
    name: string,
    value: number,
    min?: number,
    max?: number,
    onChange: (value: number) => void,
}) => {
    return <SettingContainer>
        <SettingName name={name} />
        <SettingValue>
            <div className={styles.integerInput}>
                <input className={styles.integerInputField} type="number" min={min} max={max} onChange={e => onChange(parseFloat(e.target.value))} value={value} />
            </div>
        </SettingValue>
    </SettingContainer>;
};

export const ColorSettings = ({ name, color, onChange }: { name: string, color: string, onChange: (value: string) => void }) => {
    return <SettingContainer>
        <SettingName name={name} />
        <ColorPicker color={color} onChange={onChange} />
    </SettingContainer>
};

export const TextAreaSetting = ({ name, value, onChange }: { name: string, value: string, onChange: (value: string) => void }) => {
    return <SettingContainer multiline={true}>
        <SettingName name={name} />
        <SettingValue>
            <textarea className={styles.textArea} value={value} onChange={e => onChange(e.target.value)} />
        </SettingValue>
    </SettingContainer>
};

export const ElementSettings = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
    return <div className={styles.settings}>
        <Header />
        <Body>{children}</Body>
    </div>;
};
