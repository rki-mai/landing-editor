import { Label } from "@heroui/react";
import styles from "./Table.module.css";

export type Column<T> = {
	key: keyof T | string;
	title?: string;
	width?: string | number;
	render?: (value: T[keyof T], row: T) => React.ReactNode | undefined;
};

type TableProps<T> = {
	columns: Column<T>[];
	data: T[];
	rowKey: keyof T;
};

export function Table<T>({ columns, data, rowKey }: TableProps<T>) {
	return (
		<div className="w-full overflow-x-auto border rounded-4xl">
			<table className={styles.table}>
				<thead>
					<tr>
						{columns.map((col, i) => (
							<th
								key={String(col.key) + i}
								style={{ width: col.width }}
								className={!col.title ? styles.noTitle : undefined}
							>
								<Label>{col.title ?? null}</Label>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row) => (
						<tr key={String(row[rowKey])}>
							{columns.map((col, i) => {
								const value = row[col.key as keyof T];
								return (
									<td
										key={String(col.key) + i}
										className={!col.title ? styles.noTitle : undefined}
									>
										{col.render ? col.render(value, row) : String(value ?? "")}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
