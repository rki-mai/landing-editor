import type { PropsWithChildren } from "react";
import {
	type ButtonElement,
	type ContainerElement,
	type ImageElement,
	type LandingElement,
	type LinkElement,
	type TextElement,
} from "./types";

interface LandingElementEditContainerProps extends PropsWithChildren {
	onClick?: () => void;
	isSelected?: boolean;
}

interface LandingElementProps<T extends LandingElement>
	extends LandingElementEditContainerProps {
	element: T;
}

export const LandingElementEditContainer = ({
	children,
	onClick,
	isSelected,
}: LandingElementEditContainerProps) => {
	const baseStyles = "border border-3 transition-colors rounded-2xl p-2";
	const activeStyles = "border-[var(--accent)]";
	const notActiveStyles = onClick
		? "cursor-pointer border-transparent hover:border-[var(--border)]"
		: "border-transparent";

	return (
		<div
			onClick={onClick}
			className={`${baseStyles} ${isSelected ? activeStyles : notActiveStyles}`}
		>
			{children}
		</div>
	);
};

export const TextElementComponent = ({
	element,
	...props
}: LandingElementProps<TextElement>) => {
	const style: React.CSSProperties = {};
	if (element.styles) {
		if (element.styles.color) style.color = element.styles.color;
		if (element.styles.fontSize)
			style.fontSize = `${element.styles.fontSize}px`;
	}
	return (
		<LandingElementEditContainer key={element.id} {...props}>
			<p className="text-element" style={style}>
				{element.value}
			</p>
		</LandingElementEditContainer>
	);
};

export const LinkElementComponent = ({
	element,
	...props
}: LandingElementProps<LinkElement>) => {
	return (
		<LandingElementEditContainer key={element.id} {...props}>
			<a className="link-element" style={element.styles} href={element.src}>
				{element.value}
			</a>
		</LandingElementEditContainer>
	);
};

export const ImageElementComponent = ({
	element,
	...props
}: LandingElementProps<ImageElement>) => {
	const elementStyle: React.CSSProperties = {};
	const imageStyle: React.CSSProperties = {};

	if (element.styles) {
		if (element.styles.width) imageStyle.width = `${element.styles.width}%`;
		if (element.styles.position)
			elementStyle.justifyContent = element.styles.position;
	}

	return (
		<LandingElementEditContainer key={element.id} {...props}>
			<div className="flex image-element" style={elementStyle}>
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
	...props
}: LandingElementProps<ButtonElement>) => {
	return (
		<LandingElementEditContainer key={element.id} {...props}>
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
	...props
}: LandingElementProps<ContainerElement> & { children: React.ReactNode[] }) => {
	return (
		<LandingElementEditContainer key={element.id} {...props}>
			{children}
		</LandingElementEditContainer>
	);
};
