export type CrmDocumentStatus =
  | 'requested'
  | 'uploaded'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'expired';

export type CrmDocumentRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  applicationId: string;
  documentType: string;
  originalFilename: string;
  mimeType: string | null;
  sizeBytes: number;
  status: CrmDocumentStatus;
  note: string | null;
  storagePath: string;
  storageProvider: 'local' | 'supabase';
};

export const CRM_DOCUMENT_TYPES = [
  { value: 'passport', label: 'Pasaport' },
  { value: 'photo', label: 'Biyometrik Fotoğraf' },
  { value: 'diploma', label: 'Diploma / Sertifika' },
  { value: 'cv', label: 'CV' },
  { value: 'contract', label: 'İş Sözleşmesi / Kabul Yazısı' },
  { value: 'finance', label: 'Finansal Kanıt' },
  { value: 'insurance', label: 'Sigorta' },
  { value: 'other', label: 'Diğer' },
];

export const CRM_DOCUMENT_STATUSES: {
  value: CrmDocumentStatus;
  label: string;
}[] = [
  { value: 'requested', label: 'Talep Edildi' },
  { value: 'uploaded', label: 'Yüklendi' },
  { value: 'in_review', label: 'İncelemede' },
  { value: 'approved', label: 'Onaylandı' },
  { value: 'rejected', label: 'Reddedildi' },
  { value: 'expired', label: 'Süresi Doldu' },
];

export function getDocumentTypeLabel(value: string) {
  return CRM_DOCUMENT_TYPES.find((item) => item.value === value)?.label ?? value;
}

export function getDocumentStatusLabel(value: string) {
  return (
    CRM_DOCUMENT_STATUSES.find((item) => item.value === value)?.label ?? value
  );
}

export function isCrmDocumentStatus(value: string): value is CrmDocumentStatus {
  return CRM_DOCUMENT_STATUSES.some((item) => item.value === value);
}

export function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}
