import { type TextElement, type LinkElement, type ImageElement, type ButtonElement, type ContainerElement } from "./types"


export const LandingElementEditContainer = ({ children }: { children: React.ReactNode }) => {
    return <div className="element-edit-container">{children}</div>
}

export const TextElementComponent = ({ element }: { element: TextElement }) => {
    return <LandingElementEditContainer key={element.id}>
        <p className="text-element">{element.value}</p>
    </LandingElementEditContainer>
}

export const LinkElementComponent = ({ element }: { element: LinkElement }) => {
    return <LandingElementEditContainer key={element.id}>
        <a className="link-element" href={element.src}>{element.value}</a>
    </LandingElementEditContainer>
}

export const ImageElementComponent = ({ element }: { element: ImageElement }) => {
    return <LandingElementEditContainer key={element.id}>
        <img className="image-element" src={element.value} alt={element.alt} />
    </LandingElementEditContainer>
}

export const LinkButton = ({ text, href }: { text: string, href: string }) => {
    const handleClick = () => window.open(href, '_blank');
    return <button className="link-button" onClick={handleClick}>{text}</button>;
}

export const ButtonElementComponent = ({ element }: { element: ButtonElement }) => {
    return <LandingElementEditContainer key={element.id}>
        <LinkButton text={element.value} href={element.src} />
    </LandingElementEditContainer>
}

export const ContainerElementComponent = ({ element, children }: { element: ContainerElement, children: React.ReactNode[] }) => {
    return <LandingElementEditContainer key={element.id}>
        {children}
    </LandingElementEditContainer>
}
