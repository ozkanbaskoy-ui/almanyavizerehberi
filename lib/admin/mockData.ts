export type MockApplicationStatus =
  | 'yeni'
  | 'incelemede'
  | 'evrak-bekleniyor'
  | 'odeme-bekleniyor'
  | 'tamamlandi'
  | 'reddedildi';

export type MockPaymentStatus = 'bekliyor' | 'odendi' | 'iade-edildi';

export type MockApplication = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  visaType: string;
  status: MockApplicationStatus;
  paymentStatus: MockPaymentStatus;
  source: string;
};

export type MockApplicationEvent = {
  id: string;
  applicationId: string;
  createdAt: string;
  type:
    | 'not'
    | 'telefon-gorusmesi'
    | 'mail-gonderildi'
    | 'odeme'
    | 'durum-degisikligi';
  message: string;
};

const MOCK_APPLICATIONS: MockApplication[] = [
  {
    id: 'APP-2025-0001',
    createdAt: '2025-12-20T10:15:00Z',
    fullName: 'Ayşe Demir',
    email: 'ayse.demir@example.com',
    phone: '+90 532 000 00 01',
    visaType: 'calisma-vizesi',
    status: 'incelemede',
    paymentStatus: 'bekliyor',
    source: 'web-form',
  },
  {
    id: 'APP-2025-0002',
    createdAt: '2025-12-21T13:40:00Z',
    fullName: 'Mehmet Yılmaz',
    email: 'mehmet.yilmaz@example.com',
    phone: '+90 532 000 00 02',
    visaType: 'mavi-kart-vizesi',
    status: 'odeme-bekleniyor',
    paymentStatus: 'bekliyor',
    source: 'web-form',
  },
  {
    id: 'APP-2025-0003',
    createdAt: '2025-12-22T09:05:00Z',
    fullName: 'Elif Kaya',
    email: 'elif.kaya@example.com',
    phone: '+90 532 000 00 03',
    visaType: 'aile-birlesimi-vizesi',
    status: 'tamamlandi',
    paymentStatus: 'odendi',
    source: 'manuel',
  },
];

const MOCK_EVENTS: MockApplicationEvent[] = [
  {
    id: 'EVT-1',
    applicationId: 'APP-2025-0001',
    createdAt: '2025-12-20T10:20:00Z',
    type: 'not',
    message:
      'Başvuru alındı, ön inceleme için sıraya alındı.',
  },
  {
    id: 'EVT-2',
    applicationId: 'APP-2025-0001',
    createdAt: '2025-12-20T15:00:00Z',
    type: 'telefon-gorusmesi',
    message:
      'Başvuru sahibi ile ilk telefon görüşmesi yapıldı.',
  },
  {
    id: 'EVT-3',
    applicationId: 'APP-2025-0003',
    createdAt: '2025-12-22T10:00:00Z',
    type: 'odeme',
    message:
      'Tam danışmanlık ücreti Stripe üzerinden tahsil edildi.',
  },
  {
    id: 'EVT-4',
    applicationId: 'APP-2025-0003',
    createdAt: '2025-12-23T09:30:00Z',
    type: 'durum-degisikligi',
    message: 'Durum "Vize Onaylandı" olarak güncellendi.',
  },
];

export function getMockApplications(): MockApplication[] {
  return MOCK_APPLICATIONS;
}

export function getMockApplicationById(
  id: string,
): MockApplication | undefined {
  return MOCK_APPLICATIONS.find((app) => app.id === id);
}

export function getMockEventsForApplication(
  applicationId: string,
): MockApplicationEvent[] {
  return MOCK_EVENTS.filter((e) => e.applicationId === applicationId);
}

