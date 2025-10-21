import { useEffect, useState, useRef } from 'react';
import { userService } from '../services/user/userService';
import { PermissionDeniedError, User } from 'logic-qcm-plus';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useAuth } from '../context/AuthContext';

export function useUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log('useUsersList hook mounted, fetching users');
    const fetchUsers = async () => {
      const result = await userService.getAllUsers();

      if (result.isOk()) {
        setUsers(result.value);
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Erreur',
          detail: result.error.message,
          life: 4000,
        });

        if (result.error instanceof PermissionDeniedError) {
          navigate('/login');
        }
      }
      setLoading(false);
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  return {
    toast,
    users,
    loading,
    user,
  };
}
