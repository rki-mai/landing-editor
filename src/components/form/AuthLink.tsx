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
			<a href={href} className={styles.link}>
				{linkText}
			</a>
		</div>
	);
};
