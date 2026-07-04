import fs from 'fs';
import path from 'path';

import type {
  CrmTaskPriority,
  CrmTaskRecord,
  CrmTaskStatus,
} from '@/lib/admin/taskModel';
import { getLocalCrmDir } from '@/lib/admin/localCrmPath';

const LOCAL_CRM_DIR = getLocalCrmDir();
const LOCAL_TASKS_PATH = path.join(LOCAL_CRM_DIR, 'tasks.json');

type LocalTasksStore = {
  tasks: CrmTaskRecord[];
};

function emptyStore(): LocalTasksStore {
  return {
    tasks: [],
  };
}

function readStore(): LocalTasksStore {
  try {
    if (!fs.existsSync(LOCAL_TASKS_PATH)) return emptyStore();
    const raw = fs.readFileSync(LOCAL_TASKS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalTasksStore>;

    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalTasksStore) {
  if (!fs.existsSync(LOCAL_CRM_DIR)) {
    fs.mkdirSync(LOCAL_CRM_DIR, { recursive: true });
  }

  fs.writeFileSync(LOCAL_TASKS_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export function getLocalTasks(options: { applicationId?: string } = {}) {
  return readStore()
    .tasks.filter(
      (task) => !options.applicationId || task.applicationId === options.applicationId,
    )
    .sort((a, b) => {
      const dueA = a.dueAt ? new Date(a.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
      const dueB = b.dueAt ? new Date(b.dueAt).getTime() : Number.MAX_SAFE_INTEGER;
      if (dueA !== dueB) return dueA - dueB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function saveLocalTask(
  task: Omit<CrmTaskRecord, 'createdAt' | 'updatedAt'> & {
    createdAt?: string;
    updatedAt?: string;
  },
) {
  const store = readStore();
  const now = new Date().toISOString();
  const record: CrmTaskRecord = {
    ...task,
    createdAt: task.createdAt ?? now,
    updatedAt: task.updatedAt ?? now,
  };

  const existingIndex = store.tasks.findIndex((item) => item.id === record.id);
  if (existingIndex >= 0) {
    store.tasks[existingIndex] = record;
  } else {
    store.tasks.unshift(record);
  }

  writeStore(store);
  return record;
}

export function updateLocalTask(
  id: string,
  fields: {
    title?: string;
    description?: string | null;
    status?: CrmTaskStatus;
    priority?: CrmTaskPriority;
    dueAt?: string | null;
  },
) {
  const store = readStore();
  const task = store.tasks.find((item) => item.id === id);
  if (!task) {
    throw new Error('Lokal görev kaydı bulunamadı.');
  }

  if (fields.title) task.title = fields.title;
  if (typeof fields.description !== 'undefined') {
    task.description = fields.description;
  }
  if (fields.status) task.status = fields.status;
  if (fields.priority) task.priority = fields.priority;
  if (typeof fields.dueAt !== 'undefined') task.dueAt = fields.dueAt;
  task.updatedAt = new Date().toISOString();

  writeStore(store);
  return task;
}

export function deleteLocalTask(id: string) {
  const store = readStore();
  const before = store.tasks.length;
  store.tasks = store.tasks.filter((item) => item.id !== id);

  if (store.tasks.length === before) {
    throw new Error('Lokal görev kaydı bulunamadı.');
  }

  writeStore(store);
}
