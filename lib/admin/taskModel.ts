export type CrmTaskStatus = 'open' | 'in_progress' | 'done' | 'canceled';
export type CrmTaskPriority = 'low' | 'normal' | 'high' | 'urgent';

export type CrmTaskRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  applicationId: string;
  title: string;
  description: string | null;
  status: CrmTaskStatus;
  priority: CrmTaskPriority;
  dueAt: string | null;
};

export const CRM_TASK_STATUSES: { value: CrmTaskStatus; label: string }[] = [
  { value: 'open', label: 'Açık' },
  { value: 'in_progress', label: 'İşlemde' },
  { value: 'done', label: 'Tamamlandı' },
  { value: 'canceled', label: 'İptal' },
];

export const CRM_TASK_PRIORITIES: { value: CrmTaskPriority; label: string }[] = [
  { value: 'low', label: 'Düşük' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'Yüksek' },
  { value: 'urgent', label: 'Acil' },
];

export function isCrmTaskStatus(value: string): value is CrmTaskStatus {
  return CRM_TASK_STATUSES.some((item) => item.value === value);
}

export function isCrmTaskPriority(value: string): value is CrmTaskPriority {
  return CRM_TASK_PRIORITIES.some((item) => item.value === value);
}

export function getTaskStatusLabel(value: string) {
  return CRM_TASK_STATUSES.find((item) => item.value === value)?.label ?? value;
}

export function getTaskPriorityLabel(value: string) {
  return CRM_TASK_PRIORITIES.find((item) => item.value === value)?.label ?? value;
}
