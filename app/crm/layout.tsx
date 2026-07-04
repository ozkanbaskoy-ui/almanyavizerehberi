import type { ReactNode } from 'react';

import { CrmShell } from '@/components/crm/CrmShell';

type CrmLayoutProps = {
  children: ReactNode;
};

export default function CrmLayout({ children }: CrmLayoutProps) {
  return <CrmShell>{children}</CrmShell>;
}
