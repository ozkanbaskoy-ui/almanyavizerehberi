import os from 'os';
import path from 'path';

export function getLocalCrmDir() {
  if (process.env.LOCAL_CRM_DIR) {
    return process.env.LOCAL_CRM_DIR;
  }

  const cwd = process.cwd();
  const isServerlessReadOnly =
    Boolean(process.env.VERCEL) ||
    cwd === '/var/task' ||
    cwd.startsWith('/var/task/');

  return path.join(isServerlessReadOnly ? os.tmpdir() : cwd, '.local-crm');
}
