import { RoleEnum } from 'logic-qcm-plus';

export interface SidebarItem {
  icon: string;
  label: string;
  path?: string;
  action?: () => void;
}

export function useSidebarMenu(
  roleId: number,
  actions: { handleQuestionNavigation: () => void }
): { menuItems: SidebarItem[] } {
  const { handleQuestionNavigation } = actions;

  const menuItems =
    roleId == RoleEnum.STAGIAIRE
      ? [
          { icon: 'pi pi-user', label: 'Profil', path: '/me' },
          {
            icon: 'pi pi-book',
            label: 'Questionnaires',
            path: '/questionnaires',
          },
          {
            icon: 'pi pi-question-circle',
            label: 'Questions',
            action: handleQuestionNavigation,
          },
          {
            icon: 'pi pi-chart-bar',
            label: 'Statistiques',
            path: '/statistics',
          },
        ]
      : [
          { icon: 'pi pi-user', label: 'Profil', path: '/me' },
          { icon: 'pi pi-users', label: 'Stagiaires', path: '/stagiaires' },
          {
            icon: 'pi pi-book',
            label: 'Questionnaires',
            path: '/questionnaires',
          },
          {
            icon: 'pi pi-question-circle',
            label: 'Questions',
            action: handleQuestionNavigation,
          },
        ];

  return { menuItems };
}
