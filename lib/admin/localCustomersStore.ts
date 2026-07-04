import fs from 'fs';
import path from 'path';

import type { CustomerRecord } from '@/lib/admin/customersData';
import { getLocalCrmDir } from '@/lib/admin/localCrmPath';

const LOCAL_CRM_DIR = getLocalCrmDir();
const LOCAL_CUSTOMERS_PATH = path.join(LOCAL_CRM_DIR, 'customers.json');

export type LocalCustomerRecord = CustomerRecord & {
  passwordHash: string;
  passwordSalt: string;
};

type LocalCustomerStore = {
  customers: LocalCustomerRecord[];
};

function emptyStore(): LocalCustomerStore {
  return {
    customers: [],
  };
}

function readStore(): LocalCustomerStore {
  try {
    if (!fs.existsSync(LOCAL_CUSTOMERS_PATH)) return emptyStore();
    const raw = fs.readFileSync(LOCAL_CUSTOMERS_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LocalCustomerStore>;

    return {
      customers: Array.isArray(parsed.customers) ? parsed.customers : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: LocalCustomerStore) {
  if (!fs.existsSync(LOCAL_CRM_DIR)) {
    fs.mkdirSync(LOCAL_CRM_DIR, { recursive: true });
  }

  fs.writeFileSync(
    LOCAL_CUSTOMERS_PATH,
    JSON.stringify(store, null, 2),
    'utf8',
  );
}

export function getLocalCustomers(): CustomerRecord[] {
  return readStore()
    .customers.map(({ passwordHash: _hash, passwordSalt: _salt, ...rest }) => rest)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
}

export function getLocalCustomerById(id: string) {
  return readStore().customers.find((customer) => customer.id === id) ?? null;
}

export function findLocalCustomerByIdentifier(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  return (
    readStore().customers.find(
      (customer) =>
        customer.username.toLowerCase() === normalized ||
        customer.email.toLowerCase() === normalized,
    ) ?? null
  );
}

export function saveLocalCustomer(customer: LocalCustomerRecord) {
  const store = readStore();
  const duplicate = store.customers.find(
    (item) =>
      item.id !== customer.id &&
      (item.username.toLowerCase() === customer.username.toLowerCase() ||
        item.email.toLowerCase() === customer.email.toLowerCase()),
  );

  if (duplicate) {
    throw new Error('Bu kullanıcı adı veya e-posta ile kayıt zaten var.');
  }

  const existingIndex = store.customers.findIndex(
    (item) => item.id === customer.id,
  );

  if (existingIndex >= 0) {
    store.customers[existingIndex] = customer;
  } else {
    store.customers.unshift(customer);
  }

  writeStore(store);
  return customer;
}
