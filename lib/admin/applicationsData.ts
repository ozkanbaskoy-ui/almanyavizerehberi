import {
  getMockApplications,
  getMockApplicationById,
  getMockEventsForApplication,
  type MockApplication,
  type MockApplicationEvent,
} from '@/lib/admin/mockData';
import { getSupabaseServerClient } from '@/lib/db/supabaseServer';

export type ApplicationRecord = MockApplication;
export type ApplicationEventRecord = MockApplicationEvent;

export async function fetchApplications(): Promise<ApplicationRecord[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('applications')
      .select(
        'id, created_at, full_name, email, phone, visa_type, status, payment_status, source',
      )
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !data) {
      throw error ?? new Error('Boş sonuç');
    }

    return data.map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      visaType: row.visa_type,
      status: row.status,
      paymentStatus: row.payment_status,
      source: row.source,
    }));
  } catch {
    return getMockApplications();
  }
}

export async function fetchApplicationById(
  id: string,
): Promise<ApplicationRecord | null> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('applications')
      .select(
        'id, created_at, full_name, email, phone, visa_type, status, payment_status, source',
      )
      .eq('id', id)
      .single();

    if (error || !data) {
      throw error ?? new Error('Kayıt bulunamadı');
    }

    return {
      id: data.id,
      createdAt: data.created_at,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      visaType: data.visa_type,
      status: data.status,
      paymentStatus: data.payment_status,
      source: data.source,
    };
  } catch {
    return getMockApplicationById(id) ?? null;
  }
}

export async function fetchApplicationEvents(
  applicationId: string,
): Promise<ApplicationEventRecord[]> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('application_events')
      .select('id, application_id, created_at, type, message')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: true });

    if (error || !data) {
      throw error ?? new Error('Boş sonuç');
    }

    return data.map((row) => ({
      id: row.id,
      applicationId: row.application_id,
      createdAt: row.created_at,
      type: row.type,
      message: row.message,
    }));
  } catch {
    return getMockEventsForApplication(applicationId);
  }
}

