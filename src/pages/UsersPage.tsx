import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GetUsersUseCase, Result } from 'logic';

export default function UsersPage() {
  const [users, setUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const useCase = new GetUsersUseCase();
    const result: Result<string[], Error> = useCase.execute();

    if (result.isOk()) {
      setUsers(result.value);
    } else {
      setError(result.error.message);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-gray-800">
        Liste des utilisateurs
      </h1>

      {error && <div className="text-red-600 mb-4">Erreur : {error}</div>}

      <DataTable
        value={users.map((username) => ({ username }))}
        stripedRows
        tableStyle={{ minWidth: '20rem' }}
      >
        <Column field="username" header="Nom d'utilisateur" />
      </DataTable>
    </div>
  );
}
