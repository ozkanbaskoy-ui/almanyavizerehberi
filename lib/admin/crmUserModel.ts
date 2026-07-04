export type CrmUserRole =
  | 'super_admin'
  | 'admin'
  | 'crm_manager'
  | 'case_advisor'
  | 'document_reviewer'
  | 'finance'
  | 'readonly';

export type CrmUserStatus = 'active' | 'suspended';

export type CrmUserRecord = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  username: string;
  role: CrmUserRole;
  status: CrmUserStatus;
  lastLoginAt: string | null;
  twoFactorEnabled: boolean;
};

export const CRM_USER_ROLES: { value: CrmUserRole; label: string }[] = [
  { value: 'super_admin', label: 'Süper Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'crm_manager', label: 'CRM Yöneticisi' },
  { value: 'case_advisor', label: 'Dosya Danışmanı' },
  { value: 'document_reviewer', label: 'Evrak İnceleme' },
  { value: 'finance', label: 'Finans' },
  { value: 'readonly', label: 'Sadece Okuma' },
];

export const CRM_USER_STATUSES: {
  value: CrmUserStatus;
  label: string;
}[] = [
  { value: 'active', label: 'Aktif' },
  { value: 'suspended', label: 'Pasif' },
];

export function getRoleLabel(role: string) {
  return CRM_USER_ROLES.find((item) => item.value === role)?.label ?? role;
}

export function getStatusLabel(status: string) {
  return (
    CRM_USER_STATUSES.find((item) => item.value === status)?.label ?? status
  );
}

export function isCrmUserRole(value: string): value is CrmUserRole {
  return CRM_USER_ROLES.some((item) => item.value === value);
}

export function isCrmUserStatus(value: string): value is CrmUserStatus {
  return CRM_USER_STATUSES.some((item) => item.value === value);
}
