export type MenuPermissionKey =
  | 'dashboard'
  | 'lowongan'
  | 'lamaran'
  | 'user'
  | 'master';

export const ALL_MENU_PERMISSIONS: MenuPermissionKey[] = [
  'dashboard',
  'lowongan',
  'lamaran',
  'user',
  'master',
];

export const MENU_PERMISSIONS_BY_ROLE: Record<string, MenuPermissionKey[]> = {
  User: ['dashboard', 'lamaran'],
};

export function getMenuPermissionsByRole(role?: string): MenuPermissionKey[] {
  if (!role) {
    return ALL_MENU_PERMISSIONS;
  }

  const normalizedRole = role.trim().toLowerCase();
  const matchedRole = Object.keys(MENU_PERMISSIONS_BY_ROLE).find(
    (permissionRole) => permissionRole.toLowerCase() === normalizedRole
  );

  return matchedRole
    ? MENU_PERMISSIONS_BY_ROLE[matchedRole]
    : ALL_MENU_PERMISSIONS;
}
