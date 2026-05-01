import { type TextElement, type LinkElement, type ImageElement, type ButtonElement, type ContainerElement } from "./types"


export const LandingElementEditContainer = ({ children }: { children: React.ReactNode }) => {
    return <div className="element-edit-container">{children}</div>
}

export const TextElementComponent = ({ element, onUpdate }: { element: TextElement, onUpdate: (updated: TextElement) => void }) => {
    const style: React.CSSProperties = {};
    if (element.styles) {
        if (element.styles.color) style.color = element.styles.color;
        if (element.styles.fontSize) style.fontSize = `${element.styles.fontSize}px`
    }

    const handleBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
        const currentValue = e.currentTarget.textContent;
        if (currentValue !== element.value) {
            onUpdate({ ...element, value: currentValue });
        }
    };

    return <LandingElementEditContainer key={element.id}>
        <p contentEditable onBlur={handleBlur} className="text-element" style={style}>{element.value}</p>
    </LandingElementEditContainer>
}

export const LinkElementComponent = ({ element }: { element: LinkElement }) => {
    return <LandingElementEditContainer key={element.id}>
        <a className="link-element" style={element.styles} href={element.src}>{element.value}</a>
    </LandingElementEditContainer>
}

export const ImageElementComponent = ({ element }: { element: ImageElement }) => {
    const elementStyle: React.CSSProperties = {};
    const imageStyle: React.CSSProperties = {};

    if (element.styles) {
        if (element.styles.width) imageStyle.width = `${element.styles.width}%`;
        if (element.styles.position) elementStyle.textAlign = element.styles.position;
    }

    return <LandingElementEditContainer key={element.id}>
        <div className="image-element" style={elementStyle}>
            <img className="image" src={element.value} style={imageStyle} alt={element.alt} />
        </div>
    </LandingElementEditContainer>
}

export const LinkButton = ({ text, href, style }: { text: string, href: string, style?: React.CSSProperties }) => {
    const handleClick = () => window.open(href, '_blank');
    return <button className="link-button" style={style} onClick={handleClick}>{text}</button>;
}

export const ButtonElementComponent = ({ element }: { element: ButtonElement }) => {
    return <LandingElementEditContainer key={element.id}>
        <LinkButton text={element.value} style={element.styles} href={element.src} />
    </LandingElementEditContainer>
}

export const ContainerElementComponent = ({ element, children }: { element: ContainerElement, children: React.ReactNode[] }) => {
    return <LandingElementEditContainer key={element.id}>
        {children}
    </LandingElementEditContainer>
}
