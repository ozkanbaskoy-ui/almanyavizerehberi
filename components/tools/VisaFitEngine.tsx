'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { BasvuruForm } from '@/components/basvuru/BasvuruForm';

type RouteId =
  | 'mavi-kart-vizesi'
  | 'firsat-karti'
  | 'calisma-vizesi'
  | 'mesleki-egitim-vizesi'
  | 'yuksekogrenim-vizesi'
  | 'aile-birlesimi-vizesi'
  | 'dil-kursu-vizesi';

type FitAnswers = {
  goal: string;
  education: string;
  profession: string;
  hasJobOffer: string;
  annualSalary: string;
  recognition: string;
  germanLevel: string;
  englishLevel: string;
  financeReady: string;
  hasAdmission: string;
  familyInGermany: string;
  timeline: string;
};

type RouteScore = {
  id: RouteId;
  title: string;
  score: number;
  reasons: string[];
  risks: string[];
  nextSteps: string[];
};

const DEFAULT_ANSWERS: FitAnswers = {
  goal: 'work',
  education: 'bachelor',
  profession: '',
  hasJobOffer: 'no',
  annualSalary: '',
  recognition: 'unknown',
  germanLevel: 'none',
  englishLevel: 'none',
  financeReady: 'partial',
  hasAdmission: 'no',
  familyInGermany: 'no',
  timeline: '1-3-ay',
};

const LEVEL_SCORE: Record<string, number> = {
  none: 0,
  a1: 1,
  a2: 2,
  b1: 3,
  b2: 4,
  c1: 5,
  c2: 6,
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function hasHigherEducation(education: string) {
  return ['bachelor', 'master', 'phd'].includes(education);
}

function hasVocationalOrHigher(education: string) {
  return ['vocational', 'associate', 'bachelor', 'master', 'phd'].includes(
    education,
  );
}

function salaryValue(raw: string) {
  return Number(raw.replace(/[^\d]/g, '')) || 0;
}

function getLeadTemperature(score: number) {
  if (score >= 75) return 'Güçlü profil';
  if (score >= 50) return 'Orta uygunluk';
  return 'Ön hazırlık gerekli';
}

function buildRouteScores(answers: FitAnswers): RouteScore[] {
  const german = LEVEL_SCORE[answers.germanLevel] ?? 0;
  const english = LEVEL_SCORE[answers.englishLevel] ?? 0;
  const salary = salaryValue(answers.annualSalary);
  const jobOffer = answers.hasJobOffer === 'yes';
  const recognitionReady = answers.recognition === 'recognized';
  const recognitionUnknown = answers.recognition === 'unknown';
  const financeReady = answers.financeReady === 'yes';
  const financePartial = answers.financeReady === 'partial';

  const routes: RouteScore[] = [
    {
      id: 'mavi-kart-vizesi',
      title: 'Mavi Kart Vizesi',
      score:
        10 +
        (answers.goal === 'blue-card' ? 25 : 0) +
        (jobOffer ? 25 : -20) +
        (salary >= 45934 ? 20 : salary > 0 ? 8 : 0) +
        (hasHigherEducation(answers.education) ? 18 : -10) +
        (recognitionReady ? 14 : recognitionUnknown ? 4 : 0) +
        (english >= 4 || german >= 3 ? 8 : 0),
      reasons: [
        jobOffer
          ? 'İş teklifi bilgisi Mavi Kart için güçlü sinyal.'
          : 'Mavi Kart için genelde somut iş teklifi gerekir.',
        salary >= 45934
          ? 'Girilen maaş 2026 düşük eşik referansının üzerinde görünüyor.'
          : 'Maaş eşiği kontrolü netleştirilmeli.',
        hasHigherEducation(answers.education)
          ? 'Yükseköğrenim bilgisi Mavi Kart rotasını güçlendirir.'
          : 'Diploma seviyesi Mavi Kart için zayıf görünüyor.',
      ],
      risks: [
        !jobOffer && 'İş sözleşmesi veya bağlayıcı teklif yok.',
        salary > 0 && salary < 45934 && 'Maaş eşiği düşük olabilir.',
        !recognitionReady && 'Diploma/meslek tanıma durumu net değil.',
      ].filter(Boolean) as string[],
      nextSteps: [
        'İş sözleşmesi ve brüt yıllık maaş bilgisini kontrol edin.',
        'Diploma tanıma/Anabin veya denklik durumunu netleştirin.',
        'Mavi Kart belge listesini hazırlayın.',
      ],
    },
    {
      id: 'firsat-karti',
      title: 'Fırsat Kartı',
      score:
        15 +
        (answers.goal === 'job-search' ? 25 : 0) +
        (!jobOffer ? 10 : 0) +
        (hasVocationalOrHigher(answers.education) ? 18 : -8) +
        (german >= 1 || english >= 4 ? 18 : -10) +
        (financeReady ? 18 : financePartial ? 8 : -12) +
        (recognitionReady ? 10 : recognitionUnknown ? 4 : 0),
      reasons: [
        !jobOffer
          ? 'İş teklifi olmadan Almanya’da iş arama hedefi Fırsat Kartı ile uyumlu olabilir.'
          : 'İş teklifiniz varsa çalışma vizesi/Mavi Kart da karşılaştırılmalı.',
        german >= 1 || english >= 4
          ? 'Dil seviyesi Fırsat Kartı değerlendirmesinde avantaj sağlayabilir.'
          : 'Dil belgesi eksikliği bu rota için risk oluşturur.',
        financeReady || financePartial
          ? 'Finansal hazırlık sinyali var.'
          : 'Geçim kanıtı netleşmeden başvuru zayıflar.',
      ],
      risks: [
        !hasVocationalOrHigher(answers.education) &&
          'Eğitim/mesleki yeterlilik bilgisi zayıf.',
        german < 1 && english < 4 && 'Almanca A1 veya İngilizce B2 seviyesi yok.',
        !financeReady && 'Geçim kanıtı/bloke hesap hazırlığı tamamlanmamış.',
      ].filter(Boolean) as string[],
      nextSteps: [
        'Dil belgesini ve finansal yeterliliği netleştirin.',
        'Diploma veya mesleki yeterlilik belgelerini hazırlayın.',
        'Puanlama ve belge kontrolü için ön değerlendirme alın.',
      ],
    },
    {
      id: 'calisma-vizesi',
      title: 'Çalışma Vizesi',
      score:
        10 +
        (answers.goal === 'work' ? 20 : 0) +
        (jobOffer ? 35 : -15) +
        (hasVocationalOrHigher(answers.education) ? 15 : 0) +
        (recognitionReady ? 15 : recognitionUnknown ? 5 : 0) +
        (german >= 2 || english >= 3 ? 8 : 0),
      reasons: [
        jobOffer
          ? 'İş teklifi çalışma vizesi rotasını güçlendirir.'
          : 'Çalışma vizesi için işveren/pozisyon bilgisi gerekir.',
        hasVocationalOrHigher(answers.education)
          ? 'Mesleki veya akademik eğitim sinyali mevcut.'
          : 'Mesleki yeterlilik bilgisi güçlendirilmeli.',
      ],
      risks: [
        !jobOffer && 'İş teklifi olmadan bu rota zayıf kalır.',
        !recognitionReady && 'Meslek/diploma tanıma durumu belirsiz.',
      ].filter(Boolean) as string[],
      nextSteps: [
        'İş sözleşmesi, görev tanımı ve maaş bilgisini toparlayın.',
        'Meslek tanıma gerekip gerekmediğini kontrol edin.',
        'Başvuru kategorisini çalışma/Mavi Kart olarak karşılaştırın.',
      ],
    },
    {
      id: 'mesleki-egitim-vizesi',
      title: 'Mesleki Eğitim Vizesi',
      score:
        8 +
        (answers.goal === 'vocational-training' ? 35 : 0) +
        (['high-school', 'vocational', 'associate'].includes(
          answers.education,
        )
          ? 15
          : 5) +
        (german >= 3 ? 25 : german >= 2 ? 12 : -8) +
        (financeReady ? 10 : financePartial ? 5 : 0),
      reasons: [
        answers.goal === 'vocational-training'
          ? 'Hedefiniz mesleki eğitim rotasıyla uyumlu.'
          : 'Mesleki eğitim rotası alternatif olarak değerlendirilebilir.',
        german >= 3
          ? 'Almanca B1+ seviyesi mesleki eğitim için güçlü sinyal.'
          : 'Almanca seviyesi mesleki eğitim için kritik olabilir.',
      ],
      risks: [
        german < 3 && 'Almanca seviyesi B1 altındaysa süreç zorlaşabilir.',
        !financeReady && 'Geçim/finansal kaynak belgeleri netleşmeli.',
      ].filter(Boolean) as string[],
      nextSteps: [
        'Eğitim kurumu/kabul veya sözleşme ihtiyacını netleştirin.',
        'Almanca seviyesini belgeleyin.',
        'Finansal yeterlilik belgelerini hazırlayın.',
      ],
    },
    {
      id: 'yuksekogrenim-vizesi',
      title: 'Yükseköğrenim Vizesi',
      score:
        8 +
        (answers.goal === 'study' ? 35 : 0) +
        (answers.hasAdmission === 'yes' ? 30 : -10) +
        (financeReady ? 18 : financePartial ? 8 : -8) +
        (german >= 3 || english >= 4 ? 8 : 0),
      reasons: [
        answers.hasAdmission === 'yes'
          ? 'Kabul mektubu bilgisi öğrenci vizesi için güçlü sinyal.'
          : 'Kabul mektubu yoksa öğrenci vizesi hazırlığı eksik kalır.',
        financeReady || financePartial
          ? 'Finansal hazırlık sinyali var.'
          : 'Bloke hesap/burs/geçim kanıtı netleşmeli.',
      ],
      risks: [
        answers.hasAdmission !== 'yes' && 'Üniversite/kurs kabulü yok.',
        !financeReady && 'Finansal yeterlilik tamamlanmamış.',
      ].filter(Boolean) as string[],
      nextSteps: [
        'Kabul mektubu, dil belgesi ve finansal kanıtları hazırlayın.',
        'Eğitim planı ve motivasyon belgelerini toparlayın.',
      ],
    },
    {
      id: 'aile-birlesimi-vizesi',
      title: 'Aile Birleşimi Vizesi',
      score:
        8 +
        (answers.goal === 'family' ? 35 : 0) +
        (answers.familyInGermany === 'yes' ? 35 : -15) +
        (german >= 1 ? 10 : 0),
      reasons: [
        answers.familyInGermany === 'yes'
          ? 'Almanya’da aile bağlantısı aile birleşimi rotası için temel sinyal.'
          : 'Aile birleşimi için Almanya’daki aile bağlantısı net olmalı.',
        german >= 1
          ? 'Temel Almanca bilgisi avantaj sağlayabilir.'
          : 'A1 dil şartı gerekebilir; durum özel olarak kontrol edilmeli.',
      ],
      risks: [
        answers.familyInGermany !== 'yes' &&
          'Almanya’daki aile bağlantısı belirtilmedi.',
        german < 1 && 'A1 dil belgesi ihtimali kontrol edilmeli.',
      ].filter(Boolean) as string[],
      nextSteps: [
        'Aile bağı, gelir/konut ve dil şartlarını netleştirin.',
        'Evlilik/doğum belgeleri ve tercümeleri hazırlayın.',
      ],
    },
    {
      id: 'dil-kursu-vizesi',
      title: 'Dil Kursu Vizesi',
      score:
        8 +
        (answers.goal === 'language-course' ? 40 : 0) +
        (financeReady ? 18 : financePartial ? 8 : -8) +
        (answers.timeline === 'arastirma' ? 5 : 0),
      reasons: [
        answers.goal === 'language-course'
          ? 'Hedefiniz dil kursu rotasıyla uyumlu.'
          : 'Dil kursu rotası daha sınırlı amaçlı bir alternatif olabilir.',
        financeReady || financePartial
          ? 'Finansal hazırlık sinyali var.'
          : 'Kurs ve geçim finansmanı netleşmeli.',
      ],
      risks: [
        !financeReady && 'Kurs ücreti ve geçim kanıtı hazırlanmalı.',
        'Kursun amacı ve sonrası için plan ikna edici olmalı.',
      ].filter(Boolean) as string[],
      nextSteps: [
        'Yoğun dil kursu kaydı ve finansal kanıtları hazırlayın.',
        'Dil kursu sonrası hedefinizi netleştirin.',
      ],
    },
  ];

  return routes
    .map((route) => ({
      ...route,
      score: clampScore(route.score),
    }))
    .sort((a, b) => b.score - a.score);
}

export function VisaFitEngine() {
  const [answers, setAnswers] = useState<FitAnswers>(DEFAULT_ANSWERS);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const routes = useMemo(() => buildRouteScores(answers), [answers]);
  const topRoute = routes[0];
  const fitResult = {
    routeTitle: topRoute.title,
    score: topRoute.score,
    temperature: getLeadTemperature(topRoute.score),
  };

  function setAnswer<K extends keyof FitAnswers>(
    key: K,
    value: FitAnswers[K],
  ) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <BasvuruForm
          title="Başvuru ön değerlendirme formu"
          description="Bilgilerinizi eksiksiz paylaşın; ekibimiz profilinizi inceleyip size uygun yol haritası ve ilk hazırlık adımları için dönüş yapsın."
          source="visa-fit-inline-form"
          fitResult={fitResult}
          onSuccess={() => {
            setResultModalOpen(true);
          }}
        />

        <section className="panel p-5 md:p-7">
        <div className="mx-auto max-w-xl text-center">
          <p className="inline-flex rounded-full border border-brand-base/15 bg-brand-base/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-base">
            Uygunluk Testi
          </p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-brand-dark md:text-3xl">
            Profilinizi birlikte değerlendirelim
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Yanıtlarınıza göre güçlü yönleri, eksik hazırlıkları ve görüşmede
            ele alınacak öncelikli başlıkları belirleyelim.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="form-field">
            <label className="form-label">
              Almanya için ana hedefiniz
            </label>
            <select
              value={answers.goal}
              onChange={(e) => setAnswer('goal', e.target.value)}
              className="form-select"
            >
              <option value="work">Almanya’da çalışmak</option>
              <option value="blue-card">Mavi Kart almak</option>
              <option value="job-search">İş aramak / Fırsat Kartı</option>
              <option value="vocational-training">Mesleki eğitim</option>
              <option value="study">Üniversite eğitimi</option>
              <option value="family">Aile birleşimi</option>
              <option value="language-course">Dil kursu</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              En son eğitim durumunuz
            </label>
            <select
              value={answers.education}
              onChange={(e) => setAnswer('education', e.target.value)}
              className="form-select"
            >
              <option value="high-school">Lise</option>
              <option value="vocational">Mesleki eğitim</option>
              <option value="associate">Ön lisans</option>
              <option value="bachelor">Lisans</option>
              <option value="master">Yüksek lisans</option>
              <option value="phd">Doktora</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              Meslek veya bölümünüz
            </label>
            <input
              value={answers.profession}
              onChange={(e) => setAnswer('profession', e.target.value)}
              className="form-input"
              placeholder="Örn. hemşire, yazılımcı, elektrikçi"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Almanya'dan iş teklifiniz var mı?
            </label>
            <select
              value={answers.hasJobOffer}
              onChange={(e) => setAnswer('hasJobOffer', e.target.value)}
              className="form-select"
            >
              <option value="yes">Evet</option>
              <option value="no">Hayır</option>
              <option value="in-progress">Görüşmeler sürüyor</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              Yıllık brüt maaş teklifiniz
            </label>
            <input
              value={answers.annualSalary}
              onChange={(e) => setAnswer('annualSalary', e.target.value)}
              inputMode="numeric"
              className="form-input"
              placeholder="Örn. 50000"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Diploma veya meslek tanıma durumu
            </label>
            <select
              value={answers.recognition}
              onChange={(e) => setAnswer('recognition', e.target.value)}
              className="form-select"
            >
              <option value="recognized">Tanınmış / denklik hazır</option>
              <option value="in-progress">Süreç devam ediyor</option>
              <option value="unknown">Bilmiyorum</option>
              <option value="no">Yok</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              Finansal hazırlık durumunuz
            </label>
            <select
              value={answers.financeReady}
              onChange={(e) => setAnswer('financeReady', e.target.value)}
              className="form-select"
            >
              <option value="yes">Hazır</option>
              <option value="partial">Kısmen hazır</option>
              <option value="no">Hazır değil</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              Almanca seviyeniz
            </label>
            <select
              value={answers.germanLevel}
              onChange={(e) => setAnswer('germanLevel', e.target.value)}
              className="form-select"
            >
              <option value="none">Yok</option>
              <option value="a1">A1</option>
              <option value="a2">A2</option>
              <option value="b1">B1</option>
              <option value="b2">B2</option>
              <option value="c1">C1+</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              İngilizce seviyeniz
            </label>
            <select
              value={answers.englishLevel}
              onChange={(e) => setAnswer('englishLevel', e.target.value)}
              className="form-select"
            >
              <option value="none">Yok</option>
              <option value="a1">A1</option>
              <option value="a2">A2</option>
              <option value="b1">B1</option>
              <option value="b2">B2</option>
              <option value="c1">C1+</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              Okul veya kurs kabulünüz var mı?
            </label>
            <select
              value={answers.hasAdmission}
              onChange={(e) => setAnswer('hasAdmission', e.target.value)}
              className="form-select"
            >
              <option value="yes">Evet</option>
              <option value="no">Hayır</option>
              <option value="in-progress">Başvuru aşamasında</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              Almanya'da aile bağlantınız var mı?
            </label>
            <select
              value={answers.familyInGermany}
              onChange={(e) => setAnswer('familyInGermany', e.target.value)}
              className="form-select"
            >
              <option value="yes">Evet</option>
              <option value="no">Hayır</option>
            </select>
          </div>

          <div className="form-field md:col-span-2">
            <label className="form-label">
              Planladığınız zamanlama
            </label>
            <select
              value={answers.timeline}
              onChange={(e) => setAnswer('timeline', e.target.value)}
              className="form-select"
            >
              <option value="hemen">Hemen başlamak istiyorum</option>
              <option value="1-3-ay">1-3 ay içinde</option>
              <option value="3-6-ay">3-6 ay içinde</option>
              <option value="arastirma">Şimdilik araştırıyorum</option>
            </select>
          </div>
        </div>
        </section>

      </div>

      <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
        Bu araç resmi karar vermez ve hukuki tavsiye değildir. Sonuçlar ön
        değerlendirme niteliğindedir; nihai karar ilgili resmi makamlarındır.
      </p>

      {resultModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="visa-fit-modal-title"
        >
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-base via-sky-500 to-emerald-400" />

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="eyebrow">Ön Sonuç</p>
                <h2
                  id="visa-fit-modal-title"
                  className="mt-2 font-heading text-2xl font-semibold text-brand-dark"
                >
                  Ön görüşme için bilgileriniz iletildi
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setResultModalOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-surface-soft text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
                aria-label="Pencereyi kapat"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-2xl border border-brand-base/15 bg-brand-base/[0.04] p-5">
                <p className="text-sm text-slate-600">En güçlü rota</p>
                <h3 className="mt-1 font-heading text-2xl font-semibold text-brand-dark">
                  {topRoute.title}
                </h3>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Uygunluk skoru
                    </p>
                    <p className="mt-1 text-4xl font-semibold text-brand-base">
                      {topRoute.score}
                      <span className="text-lg text-slate-500">/100</span>
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    {getLeadTemperature(topRoute.score)}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                <p>
                  Bilgileriniz iletildi, sizlere dönüş yapılacaktır. Randevu
                  almak istiyorsanız aşağıdaki Başvuru Yap butonunu kullanarak
                  randevu alabilirsiniz.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href="/basvuru" className="btn-primary w-full font-ui">
                  Başvuru Yap
                </Link>
                <button
                  type="button"
                  onClick={() => setResultModalOpen(false)}
                  className="btn-secondary w-full font-ui"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
