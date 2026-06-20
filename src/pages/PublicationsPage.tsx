import { useState } from "react";
import trashIcon from "../assets/trash.svg";
import { ApiClient, type PublicationStatus } from "../components/apiClient";
import { runBackgroundTask } from "../components/backgroundTask";
import { LocalStorageTokenProvider } from "../components/localStorageTokenProvider";
import {
	type Publication,
	runPublicationPoller,
} from "../components/PublicationPoller";
import { SquareButton } from "../components/squareButton";
import { Tab, Tabs } from "../components/Tabs";
import { type Column, Table } from "../components/table";
import styles from "./PublicationsPage.module.css";

const publicationStatusMap: Record<PublicationStatus, string> = {
	PENDING: "В процессе",
	PROCESSING: "В процессе",
	FINISHED: "Опубликовано",
	FAILED: "Ошибка",
};

export default function PublicationsPage() {
	const [publications, setPublications] = useState<Publication[] | null>(null);

	const tokenProvider = new LocalStorageTokenProvider(
		new ApiClient({ baseUrl: "" }),
	);

	const apiClient = new ApiClient({
		baseUrl: "",
		tokenProvider,
	});

	runPublicationPoller(apiClient, setPublications, 2.0 * 1000);

	const handleDelete = (publication: Publication) => {
		runBackgroundTask(`deletePublication-${publication.id}`, async () => {
			await apiClient.deletePublication(publication.projectId, publication.id);
			window.location.reload();
		});
	};

	const columns: Column<Publication>[] = [
		{
			key: "projectName",
			title: "Проект",
			render: (_, pub) => <span>{pub.projectName}</span>,
		},
		{
			key: "creationDate",
			title: "Дата публикации",
			render: (_, pub) => (
				<span>{pub.creationDate.toLocaleDateString("ru-RU")}</span>
			),
		},
		{
			key: "link",
			title: "Ссылка",
			render: (_, pub) => pub.link && <a href={pub.link}>Link</a>,
		},
		{
			key: "__status",
			title: "Статус",
			render: (_, pub) => <span>{publicationStatusMap[pub.status]}</span>,
		},
		{
			key: "delete_action",
			render: (_, pub) => (
				<SquareButton
					variant="ghost"
					icon={trashIcon}
					size={30}
					onClick={() => handleDelete(pub)}
				/>
			),
		},
	];

	return (
		<div className={styles.container}>
			<Tabs>
				<Tab
					title="Проекты"
					id="projects"
					href="/projects"
					isSelected={false}
				/>
				<Tab
					title="Публикации"
					id="publications"
					href="/publications"
					isSelected={true}
				/>
			</Tabs>
			<div className={styles.content}>
				<h1>Publications</h1>
				{publications === null ? (
					"Загрузка ..."
				) : (
					<Table columns={columns} data={publications} rowKey="id" />
				)}
			</div>
		</div>
	);
}
