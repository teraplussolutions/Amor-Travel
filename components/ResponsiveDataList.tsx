import type { ReactNode } from "react";

export type DataColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Hide on mobile card if false — still shown in table */
  cardPrimary?: boolean;
};

type ResponsiveDataListProps<T> = {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
};

export function ResponsiveDataList<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "No records yet.",
}: ResponsiveDataListProps<T>) {
  const primaryColumns = columns.filter((col) => col.cardPrimary !== false);
  const secondaryColumns = columns.filter((col) => col.cardPrimary === false);

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-amor-soft bg-amor-soft/50 p-6 text-base text-amor-text">
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:hidden">
        {rows.map((row) => (
          <article
            key={rowKey(row)}
            className="rounded-xl border border-amor-soft bg-amor-white p-4 shadow-sm"
          >
            {primaryColumns.map((col) => (
              <div key={col.key} className="mb-3 last:mb-0">
                <p className="text-base font-medium text-amor-blue">{col.header}</p>
                <div className="mt-1 break-words text-base text-amor-text">
                  {col.render(row)}
                </div>
              </div>
            ))}
            {secondaryColumns.length > 0 ? (
              <dl className="mt-4 grid gap-2 border-t border-amor-soft pt-4">
                {secondaryColumns.map((col) => (
                  <div key={col.key} className="grid grid-cols-[minmax(0,8rem)_1fr] gap-2">
                    <dt className="text-base text-amor-blue">{col.header}</dt>
                    <dd className="break-words text-base text-amor-text">
                      {col.render(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-amor-soft md:block">
        <table className="w-full min-w-[640px] border-collapse text-left text-base">
          <thead>
            <tr className="border-b border-amor-soft bg-amor-sidebar">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 font-semibold text-amor-blue"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-amor-soft last:border-b-0 even:bg-amor-soft/40"
              >
                {columns.map((col) => (
                  <td key={col.key} className="break-words px-4 py-3 text-amor-text">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
