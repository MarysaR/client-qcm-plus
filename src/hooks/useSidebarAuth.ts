import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from 'primereact/toast';

export function useSidebarAuth(toast: React.RefObject<Toast | null>) {
  const { logout, user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  async function handleLogout() {
    const result = await logout();
    if (result.isOk()) {
      toast.current?.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Vous avez été déconnecté',
        life: 3000,
      });
      navigate('/login');
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Erreur',
        detail: result.error.message,
        life: 4000,
      });
    }
  }

  return { currentUser, handleLogout };
}
