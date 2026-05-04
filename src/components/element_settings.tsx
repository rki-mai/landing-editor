import React from 'react';
import styles from './element_settings.module.css'
import closeButton from '../assets/close-btn.png'

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

const SettingContainer = ({ children }: { children: React.ReactNode[] }) => {
    return <div className={styles.settingContainer}>
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

export const IntegerSetting = ({ name, value, min, onChange }: { name: string, value: number, min?: number, onChange: (value: number) => void }) => {
    return <SettingContainer>
        <SettingName name={name} />
        <SettingValue>
            <div className={styles.integerInput}>
                <input className={styles.integerInputField} type="number" min={min} onChange={e => onChange(parseFloat(e.target.value))} value={value} />
            </div>
        </SettingValue>
    </SettingContainer>;
};

export const ElementSettings = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
    return <div className={styles.settings}>
        <Header />
        <Body>{children}</Body>
    </div>;
};
