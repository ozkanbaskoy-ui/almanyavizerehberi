import fs from 'fs';
import path from 'path';

import type {
  CrmDocumentRecord,
  CrmDocumentStatus,
} from '@/lib/admin/documentModel';
import { getLocalCrmDir } from '@/lib/admin/localCrmPath';

const LOCAL_CRM_DIR = getLocalCrmDir();
const LOCAL_DOCUMENTS_PATH = path.join(LOCAL_CRM_DIR, 'documents.json');
const LOCAL_UPLOADS_DIR = path.join(LOCAL_CRM_DIR, 'uploads');

type LocalDocumentsStore = {
  documents: CrmDocumentRecord[];
};

function emptyStore(): LocalDocumentsStore {
  return {
    documents: [],
  };
}

function readStore(): LocalDocumentsStore {
  try {
    if (!fs.existsSync(LOCAL_DOCUMENTS_PATH)) return emptyStore();
    const raw = fs.readFileSync(LOCAL_DOCUMENTS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalDocumentsStore>;

    return {
      documents: Array.isArray(parsed.documents) ? parsed.documents : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalDocumentsStore) {
  if (!fs.existsSync(LOCAL_CRM_DIR)) {
    fs.mkdirSync(LOCAL_CRM_DIR, { recursive: true });
  }

  fs.writeFileSync(
    LOCAL_DOCUMENTS_PATH,
    JSON.stringify(store, null, 2),
    'utf8',
  );
}

function ensureUploadsDir() {
  if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
    fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
  }
}

function sanitizeFilename(filename: string) {
  const cleaned = filename
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || 'evrak';
}

export function getLocalDocuments(options: { applicationId?: string } = {}) {
  return readStore()
    .documents.filter(
      (document) =>
        !options.applicationId || document.applicationId === options.applicationId,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getLocalDocumentById(id: string) {
  return readStore().documents.find((document) => document.id === id) ?? null;
}

export function saveLocalDocumentFile(params: {
  id: string;
  filename: string;
  buffer: Buffer;
}) {
  ensureUploadsDir();
  const safeFilename = sanitizeFilename(params.filename);
  const relativePath = path.join('uploads', `${params.id}-${safeFilename}`);
  const absolutePath = path.join(LOCAL_CRM_DIR, relativePath);
  fs.writeFileSync(absolutePath, params.buffer);
  return relativePath;
}

export function getLocalDocumentAbsolutePath(document: CrmDocumentRecord) {
  const absolutePath = path.resolve(LOCAL_CRM_DIR, document.storagePath);
  const allowedRoot = path.resolve(LOCAL_CRM_DIR);

  if (!absolutePath.startsWith(allowedRoot)) {
    throw new Error('Geçersiz evrak yolu.');
  }

  return absolutePath;
}

export function saveLocalDocument(
  document: Omit<CrmDocumentRecord, 'createdAt' | 'updatedAt' | 'storageProvider'> & {
    createdAt?: string;
    updatedAt?: string;
    storageProvider?: 'local';
  },
) {
  const store = readStore();
  const now = new Date().toISOString();
  const record: CrmDocumentRecord = {
    ...document,
    createdAt: document.createdAt ?? now,
    updatedAt: document.updatedAt ?? now,
    storageProvider: 'local',
  };

  const existingIndex = store.documents.findIndex((item) => item.id === record.id);
  if (existingIndex >= 0) {
    store.documents[existingIndex] = record;
  } else {
    store.documents.unshift(record);
  }

  writeStore(store);
  return record;
}

export function updateLocalDocument(
  id: string,
  fields: {
    status?: CrmDocumentStatus;
    note?: string | null;
  },
) {
  const store = readStore();
  const document = store.documents.find((item) => item.id === id);
  if (!document) {
    throw new Error('Lokal evrak kaydı bulunamadı.');
  }

  if (fields.status) document.status = fields.status;
  if (typeof fields.note !== 'undefined') document.note = fields.note;
  document.updatedAt = new Date().toISOString();

  writeStore(store);
  return document;
}

export function deleteLocalDocument(id: string) {
  const store = readStore();
  const document = store.documents.find((item) => item.id === id);
  if (!document) {
    throw new Error('Lokal evrak kaydı bulunamadı.');
  }

  try {
    const absolutePath = getLocalDocumentAbsolutePath(document);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch {
    // Metadata silme işlemini dosya temizliği hatasına bağlamıyoruz.
  }

  store.documents = store.documents.filter((item) => item.id !== id);
  writeStore(store);
}
