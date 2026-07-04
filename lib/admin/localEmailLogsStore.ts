import fs from 'fs';
import path from 'path';

import type { EmailLogRecord } from '@/lib/admin/emailLogsData';
import { getLocalCrmDir } from '@/lib/admin/localCrmPath';

const LOCAL_CRM_DIR = getLocalCrmDir();
const LOCAL_EMAIL_LOGS_PATH = path.join(LOCAL_CRM_DIR, 'email-logs.json');

type LocalEmailLogsStore = {
  logs: EmailLogRecord[];
};

function emptyStore(): LocalEmailLogsStore {
  return {
    logs: [],
  };
}

function readStore(): LocalEmailLogsStore {
  try {
    if (!fs.existsSync(LOCAL_EMAIL_LOGS_PATH)) return emptyStore();
    const raw = fs.readFileSync(LOCAL_EMAIL_LOGS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalEmailLogsStore>;

    return {
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalEmailLogsStore) {
  if (!fs.existsSync(LOCAL_CRM_DIR)) {
    fs.mkdirSync(LOCAL_CRM_DIR, { recursive: true });
  }

  fs.writeFileSync(
    LOCAL_EMAIL_LOGS_PATH,
    JSON.stringify(store, null, 2),
    'utf8',
  );
}

export function getLocalEmailLogs(limit = 80) {
  return readStore()
    .logs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

export function saveLocalEmailLog(
  log: Omit<EmailLogRecord, 'id' | 'createdAt'> & {
    id?: string;
    createdAt?: string;
  },
) {
  const store = readStore();
  const record: EmailLogRecord = {
    ...log,
    id: log.id ?? `LOCAL-EMAIL-${crypto.randomUUID()}`,
    createdAt: log.createdAt ?? new Date().toISOString(),
  };

  store.logs.unshift(record);
  store.logs = store.logs.slice(0, 300);
  writeStore(store);

  return record;
}
