import fs from 'fs';
import path from 'path';

import type { CrmUserRecord } from '@/lib/admin/crmUserModel';
import { getLocalCrmDir } from '@/lib/admin/localCrmPath';

const LOCAL_CRM_DIR = getLocalCrmDir();
const LOCAL_USERS_PATH = path.join(LOCAL_CRM_DIR, 'users.json');

export type LocalCrmUserRecord = CrmUserRecord & {
  passwordHash: string;
  passwordSalt: string;
};

type LocalUsersStore = {
  users: LocalCrmUserRecord[];
};

function emptyStore(): LocalUsersStore {
  return {
    users: [],
  };
}

function readStore(): LocalUsersStore {
  try {
    if (!fs.existsSync(LOCAL_USERS_PATH)) return emptyStore();
    const raw = fs.readFileSync(LOCAL_USERS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalUsersStore>;

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalUsersStore) {
  if (!fs.existsSync(LOCAL_CRM_DIR)) {
    fs.mkdirSync(LOCAL_CRM_DIR, { recursive: true });
  }

  fs.writeFileSync(LOCAL_USERS_PATH, JSON.stringify(store, null, 2), 'utf8');
}

export function getLocalCrmUsers(): CrmUserRecord[] {
  return readStore()
    .users.map(({ passwordHash: _hash, passwordSalt: _salt, ...rest }) => rest)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function saveLocalCrmUser(user: LocalCrmUserRecord) {
  const store = readStore();
  const duplicate = store.users.find(
    (item) =>
      item.id !== user.id &&
      (item.username.toLowerCase() === user.username.toLowerCase() ||
        item.email.toLowerCase() === user.email.toLowerCase()),
  );

  if (duplicate) {
    throw new Error('Bu kullanıcı adı veya e-posta ile CRM kullanıcısı var.');
  }

  const existingIndex = store.users.findIndex((item) => item.id === user.id);

  if (existingIndex >= 0) {
    store.users[existingIndex] = user;
  } else {
    store.users.unshift(user);
  }

  writeStore(store);
  return user;
}

export function updateLocalCrmUser(
  id: string,
  fields: Partial<Pick<CrmUserRecord, 'role' | 'status' | 'twoFactorEnabled'>>,
) {
  const store = readStore();
  const user = store.users.find((item) => item.id === id);

  if (!user) {
    throw new Error('Lokal CRM kullanıcısı bulunamadı.');
  }

  if (fields.role) user.role = fields.role;
  if (fields.status) user.status = fields.status;
  if (typeof fields.twoFactorEnabled === 'boolean') {
    user.twoFactorEnabled = fields.twoFactorEnabled;
  }

  writeStore(store);

  const { passwordHash: _hash, passwordSalt: _salt, ...safeUser } = user;
  return safeUser;
}

export function deleteLocalCrmUser(id: string) {
  const store = readStore();
  const before = store.users.length;
  store.users = store.users.filter((item) => item.id !== id);

  if (store.users.length === before) {
    throw new Error('Lokal CRM kullanıcısı bulunamadı.');
  }

  writeStore(store);
}
