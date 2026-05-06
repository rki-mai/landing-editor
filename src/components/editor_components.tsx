import settingsIcon from "../assets/settings-btn.png";
import arrowUpIcon from "../assets/up-arrow.png";
import arrowDownIcon from "../assets/arrow-down.png";
import {
	type ButtonElement,
	type ContainerElement,
	type ImageElement,
	type LandingElement,
	type LinkElement,
	type TextElement,
} from "./types";

export type OpenSettingsCallback = (element: LandingElement) => void;

const MenuItem = ({ onClick, src }: { src: string; onClick?: () => void }) => {
	return (
		<div className="element-menu-item" onClick={onClick}>
			<img src={src} />
		</div>
	);
};

const ElementMenu = ({ onSettingsClick }: { onSettingsClick?: () => void }) => {
	return (
		<div className="element-menu">
			<MenuItem src={settingsIcon} onClick={onSettingsClick} />
			<MenuItem src={arrowUpIcon} />
			<MenuItem src={arrowDownIcon} />
		</div>
	);
};

export const LandingElementEditContainer = ({
	supportsSettings,
	children,
	onSettingsOpened,
}: {
	children: React.ReactNode;
	supportsSettings?: boolean;
	onSettingsOpened?: () => void;
}) => {
	return (
		<div className="element-edit-container">
			{supportsSettings && <ElementMenu onSettingsClick={onSettingsOpened} />}
			{children}
		</div>
	);
};

export const TextElementComponent = ({
	element,
	onSettingsOpened,
}: {
	element: TextElement;
	onSettingsOpened: OpenSettingsCallback;
}) => {
	const style: React.CSSProperties = {};
	if (element.styles) {
		if (element.styles.color) style.color = element.styles.color;
		if (element.styles.fontSize)
			style.fontSize = `${element.styles.fontSize}px`;
	}
	return (
		<LandingElementEditContainer
			key={element.id}
			supportsSettings={true}
			onSettingsOpened={() => onSettingsOpened(element)}
		>
			<p className="text-element" style={style}>
				{element.value}
			</p>
		</LandingElementEditContainer>
	);
};

export const LinkElementComponent = ({
	element,
	onSettingsOpened,
}: {
	element: LinkElement;
	onSettingsOpened: OpenSettingsCallback;
}) => {
	return (
		<LandingElementEditContainer
			key={element.id}
			supportsSettings={true}
			onSettingsOpened={() => onSettingsOpened(element)}
		>
			<a className="link-element" style={element.styles} href={element.src}>
				{element.value}
			</a>
		</LandingElementEditContainer>
	);
};

export const ImageElementComponent = ({
	element,
	onSettingsOpened,
}: {
	element: ImageElement;
	onSettingsOpened: OpenSettingsCallback;
}) => {
	const elementStyle: React.CSSProperties = {};
	const imageStyle: React.CSSProperties = {};

	if (element.styles) {
		if (element.styles.width) imageStyle.width = `${element.styles.width}%`;
		if (element.styles.position)
			elementStyle.textAlign = element.styles.position;
	}

	return (
		<LandingElementEditContainer
			key={element.id}
			supportsSettings={true}
			onSettingsOpened={() => onSettingsOpened(element)}
		>
			<div className="image-element" style={elementStyle}>
				<img
					className="image"
					src={element.value}
					style={imageStyle}
					alt={element.alt}
				/>
			</div>
		</LandingElementEditContainer>
	);
};

const LinkButton = ({
	text,
	href,
	style,
}: {
	text: string;
	href: string;
	style?: React.CSSProperties;
}) => {
	const handleClick = () => window.open(href, "_blank");
	return (
		<button className="link-button" style={style} onClick={handleClick}>
			{text}
		</button>
	);
};

export const ButtonElementComponent = ({
	element,
	onSettingsOpened,
}: {
	element: ButtonElement;
	onSettingsOpened: OpenSettingsCallback;
}) => {
	return (
		<LandingElementEditContainer
			key={element.id}
			supportsSettings={true}
			onSettingsOpened={() => onSettingsOpened(element)}
		>
			<LinkButton
				text={element.value}
				style={element.styles}
				href={element.src}
			/>
		</LandingElementEditContainer>
	);
};

export const ContainerElementComponent = ({
	element,
	children,
}: {
	element: ContainerElement;
	children: React.ReactNode[];
}) => {
	return (
		<LandingElementEditContainer key={element.id}>
			{children}
		</LandingElementEditContainer>
	);
};
