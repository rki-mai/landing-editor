import arrowDownIcon from "../assets/arrow-down.png";
import arrowUpIcon from "../assets/arrow-up.png";
import settingsIcon from "../assets/settings.png";
import trashIcon from "../assets/trash.svg";
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

const ElementMenu = ({ children }: { children: React.ReactNode[] }) => {
	return <div className="element-menu">{children}</div>;
};

export const LandingElementEditContainer = ({
	children,
	onSettingsOpened,
	onMoveUp,
	onMoveDown,
	onDelete,
}: {
	children: React.ReactNode;
	supportsSettings?: boolean;
	onSettingsOpened?: () => void;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	onDelete?: () => void;
}) => {
	return (
		<div className="element-edit-container">
			{(onSettingsOpened || onMoveDown || onMoveUp) && (
				<ElementMenu>
					{onSettingsOpened && (
						<MenuItem src={settingsIcon} onClick={onSettingsOpened} />
					)}
					{onDelete && <MenuItem src={trashIcon} onClick={onDelete} />}
					{onMoveUp && <MenuItem src={arrowUpIcon} onClick={onMoveUp} />}
					{onMoveDown && <MenuItem src={arrowDownIcon} onClick={onMoveDown} />}
				</ElementMenu>
			)}
			{children}
		</div>
	);
};

export const TextElementComponent = ({
	element,
	onSettingsOpened,
	onMoveUp,
	onMoveDown,
	onDelete,
}: {
	element: TextElement;
	onSettingsOpened?: OpenSettingsCallback;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	onDelete?: () => void;
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
			onSettingsOpened={
				onSettingsOpened ? () => onSettingsOpened(element) : undefined
			}
			onMoveDown={onMoveDown}
			onMoveUp={onMoveUp}
			onDelete={onDelete}
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
	onMoveUp,
	onMoveDown,
	onDelete,
}: {
	element: LinkElement;
	onSettingsOpened?: OpenSettingsCallback;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	onDelete?: () => void;
}) => {
	return (
		<LandingElementEditContainer
			key={element.id}
			onSettingsOpened={
				onSettingsOpened ? () => onSettingsOpened(element) : undefined
			}
			onMoveUp={onMoveUp}
			onMoveDown={onMoveDown}
			onDelete={onDelete}
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
	onMoveUp,
	onMoveDown,
	onDelete,
}: {
	element: ImageElement;
	onSettingsOpened?: OpenSettingsCallback;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	onDelete?: () => void;
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
			onSettingsOpened={
				onSettingsOpened ? () => onSettingsOpened(element) : undefined
			}
			onMoveUp={onMoveUp}
			onMoveDown={onMoveDown}
			onDelete={onDelete}
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
	onMoveUp,
	onMoveDown,
	onDelete,
}: {
	element: ButtonElement;
	onSettingsOpened?: OpenSettingsCallback;
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	onDelete?: () => void;
}) => {
	return (
		<LandingElementEditContainer
			key={element.id}
			onSettingsOpened={
				onSettingsOpened ? () => onSettingsOpened(element) : undefined
			}
			onMoveUp={onMoveUp}
			onMoveDown={onMoveDown}
			onDelete={onDelete}
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
	onMoveUp,
	onMoveDown,
	onDelete,
}: {
	element: ContainerElement;
	children: React.ReactNode[];
	onMoveUp?: () => void;
	onMoveDown?: () => void;
	onDelete?: () => void;
}) => {
	return (
		<LandingElementEditContainer
			key={element.id}
			onMoveUp={onMoveUp}
			onMoveDown={onMoveDown}
			onDelete={onDelete}
		>
			{children}
		</LandingElementEditContainer>
	);
};
