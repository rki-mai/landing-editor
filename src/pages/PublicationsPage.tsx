import { useState } from "react";
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
import { CircleCheckFill, Clock, TrashBin, Xmark } from "@gravity-ui/icons";
import { PageContent, PageHeader, PageLayout } from "../components/PageLayout";
import { Chip, Link, Spinner } from "@heroui/react";
import { UserMenu } from "../components/UserMenu";

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
			render: (_, pub) =>
				pub.link && (
					<Link href={pub.link}>
						Link
						<Link.Icon />
					</Link>
				),
		},
		{
			key: "__status",
			title: "Статус",
			render: (_, pub) => <PublicationStatus pubStatus={pub.status} />,
		},
		{
			key: "delete_action",
			render: (_, pub) => (
				<SquareButton onClick={() => handleDelete(pub)}>
					<TrashBin />
				</SquareButton>
			),
		},
	];

	return (
		<PageLayout>
			<PageHeader>
				<div className="grow">
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
				</div>
				<div className="flex grow-0 items-center">
					<UserMenu />
				</div>
			</PageHeader>
			<PageContent>
				{publications === null ? (
					<div className="flex flex-col items-center gap-2 grow">
						<Spinner size="xl" />
						<span className="text-xs text-muted">Загрузка ...</span>
					</div>
				) : (
					<Table columns={columns} data={publications} rowKey="id" />
				)}
			</PageContent>
		</PageLayout>
	);
}

const PublicationStatus = ({ pubStatus }: { pubStatus: PublicationStatus }) => {
	switch (pubStatus) {
		case "PENDING":
			return (
				<Chip>
					<Clock width={12} />
					<Chip.Label>В очереди</Chip.Label>
				</Chip>
			);
		case "FAILED":
			return (
				<Chip color="danger">
					<Xmark width={12} />
					<Chip.Label>Ошибка</Chip.Label>
				</Chip>
			);
		case "PROCESSING":
			return (
				<Chip>
					<Clock width={12} />
					<Chip.Label>Сборка</Chip.Label>
				</Chip>
			);
		case "FINISHED":
			return (
				<Chip color="success">
					<CircleCheckFill width={12} />
					<Chip.Label>Опубликовано</Chip.Label>
				</Chip>
			);
	}
};
