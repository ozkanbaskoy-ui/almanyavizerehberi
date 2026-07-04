import fs from 'fs';
import path from 'path';

import type {
  MockApplication,
  MockApplicationEvent,
  MockApplicationStatus,
  MockPaymentStatus,
} from '@/lib/admin/mockData';
import { getLocalCrmDir } from '@/lib/admin/localCrmPath';

const LOCAL_CRM_DIR = getLocalCrmDir();
const LOCAL_CRM_PATH = path.join(LOCAL_CRM_DIR, 'applications.json');

type LocalStore = {
  applications: MockApplication[];
  events: MockApplicationEvent[];
};

function emptyStore(): LocalStore {
  return {
    applications: [],
    events: [],
  };
}

function readStore(): LocalStore {
  try {
    if (!fs.existsSync(LOCAL_CRM_PATH)) return emptyStore();
    const raw = fs.readFileSync(LOCAL_CRM_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalStore>;

    return {
      applications: Array.isArray(parsed.applications)
        ? parsed.applications
        : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalStore) {
  if (!fs.existsSync(LOCAL_CRM_DIR)) {
    fs.mkdirSync(LOCAL_CRM_DIR, { recursive: true });
  }

  fs.writeFileSync(
    LOCAL_CRM_PATH,
    JSON.stringify(store, null, 2),
    'utf8',
  );
}

export function getLocalApplications(): MockApplication[] {
  return readStore().applications.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getLocalApplicationById(id: string) {
  return readStore().applications.find((app) => app.id === id) ?? null;
}

export function getLocalApplicationEvents(applicationId: string) {
  return readStore()
    .events.filter((event) => event.applicationId === applicationId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime(),
    );
}

export function saveLocalApplication(app: MockApplication) {
  const store = readStore();
  const existingIndex = store.applications.findIndex(
    (item) => item.id === app.id,
  );

  if (existingIndex >= 0) {
    store.applications[existingIndex] = app;
  } else {
    store.applications.unshift(app);
  }

  writeStore(store);
}

export function addLocalApplicationEvent(
  event: Omit<MockApplicationEvent, 'id' | 'createdAt'> & {
    id?: string;
    createdAt?: string;
  },
) {
  const store = readStore();
  store.events.push({
    id: event.id ?? `LOCAL-EVT-${crypto.randomUUID()}`,
    applicationId: event.applicationId,
    createdAt: event.createdAt ?? new Date().toISOString(),
    type: event.type,
    message: event.message,
  });
  writeStore(store);
}

export function updateLocalApplication(
  id: string,
  fields: {
    status?: string;
    paymentStatus?: string;
  },
) {
  const store = readStore();
  const existing = store.applications.find((app) => app.id === id);
  if (!existing) {
    throw new Error('Lokal CRM kaydı bulunamadı.');
  }

  if (fields.status) {
    existing.status = fields.status as MockApplicationStatus;
  }
  if (fields.paymentStatus) {
    existing.paymentStatus = fields.paymentStatus as MockPaymentStatus;
  }

  writeStore(store);
  return existing;
}
