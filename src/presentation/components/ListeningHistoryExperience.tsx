import { useState, type ReactNode } from 'react';
import type { ImportListeningHistory } from '../../application/use-cases/import-listening-history';
import type { ListeningMonth } from '../../domain/entities/listening-history';
import { ListeningHistoryImport } from './ListeningHistoryImport';

export function ListeningHistoryExperience({
  importer,
  children,
}: {
  importer?: ImportListeningHistory;
  children: (month: ListeningMonth | null) => ReactNode;
}) {
  const [month, setMonth] = useState<ListeningMonth | null>(null);
  return (
    <>
      {importer ? <ListeningHistoryImport importer={importer} onSelect={setMonth} /> : null}
      {children(month)}
    </>
  );
}
