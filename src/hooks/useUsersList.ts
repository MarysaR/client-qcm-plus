import { useEffect, useState } from 'react';
import { getAllUsers } from '../services/user/userService'; // à adapter selon ton service
import { User } from 'logic-qcm-plus';

export function useUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();

      if (result.isOk()) {
        setUsers(result.value);
      } else {
        setError(result.error.message);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
