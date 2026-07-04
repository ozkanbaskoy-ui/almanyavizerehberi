import { redirect } from 'next/navigation';

export default function AdminApplicationsRedirectPage() {
  redirect('/crm/leads');
}
