import { Link } from "@heroui/react";
import styles from "./form.module.css";

interface AuthLinkProps {
	text: string;
	linkText: string;
	href: string;
}

export const AuthLink = ({ text, linkText, href }: AuthLinkProps) => {
	return (
		<div className={styles.authLink}>
			{text}{" "}
			<Link href={href}>
				{linkText}
				<Link.Icon />
			</Link>
		</div>
	);
};
