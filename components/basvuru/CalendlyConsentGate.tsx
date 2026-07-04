'use client';

import { useState } from 'react';

import { CalendlyEmbed } from './CalendlyEmbed';

type CalendlyConsentGateProps = {
  url: string;
};

export function CalendlyConsentGate({ url }: CalendlyConsentGateProps) {
  const [consented, setConsented] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Google Calendar her zaman görünür */}
      <div className="relative mt-10">
        <CalendlyEmbed url={url} />

        {/* Rıza verilene kadar Google Calendar üzerine tıklama kilidi */}
        {!consented && (
          <>
            <div
              className="absolute inset-0 z-20 cursor-pointer rounded-2xl bg-transparent"
              onClick={() => setShowModal(true)}
            />
            <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl border-2 border-dashed border-brand-red/40" />
            <div className="pointer-events-none absolute inset-x-6 bottom-6 z-10 flex items-center justify-between rounded-2xl bg-slate-900/85 px-4 py-3 text-[11px] text-slate-100 shadow-lg md:text-xs">
              <span>
                Randevu almadan önce danışmanlık ve hizmet şartlarını okuyup
                onaylamanız gerekir.
              </span>
              <span className="ml-3 hidden text-[11px] font-semibold text-brand-red md:inline">
                Devam etmek için tıklayın
              </span>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-base via-brand-light to-emerald-400" />

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
              <div>
                <p className="eyebrow">Randevu Onayı</p>
                <h2 className="mt-2 font-heading text-xl font-semibold text-brand-dark md:text-2xl">
                  Danışmanlık Ön Görüşme ve Hizmet Şartları Onay Metni
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-xs leading-relaxed text-slate-700 md:px-6 md:py-5 md:text-sm">
              <p>
                Lütfen aşağıdaki maddeleri dikkatle okuyunuz. Ödeme işleminin
                tamamlanması ve randevunun oluşturulması ile birlikte bu
                şartlar tarafınızca okunmuş, anlaşılmış ve hiçbir kısıtlama
                olmaksızın onaylanmış sayılacaktır.
              </p>

              <h3 className="mt-3 text-sm font-semibold text-slate-900 md:text-base">
                1. Hizmetin Kapsamı
              </h3>
              <p>
                <strong>Odak Noktası:</strong> Alınan randevu yalnızca Almanya
                Çalışma Vizeleri (Nitelikli Çalışan, Mavi Kart, Fırsat Kartı
                vb.) hakkında ön değerlendirme ve danışmanlık hizmetini kapsar.
              </p>
              <p>
                <strong>Kapsam Dışı:</strong> Turistik vize, aile birleşimi,
                öğrenci vizesi veya iltica süreçlerine dair bu görüşme
                çerçevesinde bilgilendirme yapılmamaktadır.
              </p>
              <p>
                <strong>İçerik:</strong> Bu görüşmede başvuru sahibinin mesleki
                uygunluğu analiz edilir, riskler ve maliyetler şeffafça
                aktarılır. İş bulma ihtimali ve izlenecek yol haritası
                netleştirilir.
              </p>

              <h3 className="mt-3 text-sm font-semibold text-slate-900 md:text-base">
                2. Taahhüt Sınırları ve Sorumluluk Reddi (Disclaimer)
              </h3>
              <p>
                <strong>Garanti:</strong> Bu görüşme bir &quot;ön
                değerlendirme&quot; hizmetidir. Başvuru sahibine kesin bir iş
                garantisi veya resmi makamlardan (Konsolosluk/Yabancılar
                Dairesi) bir vize onay taahhüdü verilmez.
              </p>
              <p>
                <strong>Karar Yetkisi:</strong> Vize verilmesi konusundaki
                nihai karar yalnızca ilgili resmi makamlara aittir. Kurumumuz bu
                süreçteki ret kararlarından sorumlu tutulamaz.
              </p>
              <p>
                <strong>İşlem:</strong> Resmi başvuru süreci veya evrak
                hazırlama işlemleri bu görüşmenin kapsamına dahil olmayıp, ek
                hizmete tabidir.
              </p>

              <h3 className="mt-3 text-sm font-semibold text-slate-900 md:text-base">
                3. Ücretlendirme ve İade Politikası
              </h3>
              <p>
                <strong>Kesinleşme:</strong> Hizmet bedeli ödemesi yapıldıktan
                sonra randevunuz sisteme tanımlanır ve kesinleşmiş sayılır.
              </p>
              <p>
                <strong>İade Şartları:</strong> Görüşme gerçekleştirildikten
                sonra içerikten memnuniyetsizlik veya kişisel nedenlerle{' '}
                <span className="font-extrabold text-red-600">
                  ücret iadesi yapılmaz.
                </span>
              </p>
              <p>
                <strong>Yanlış Başvuru:</strong> Yanlış vize türü için randevu
                alınması durumunda sorumluluk danışana aittir ve iade
                yapılmaz.
              </p>

              <h3 className="mt-3 text-sm font-semibold text-slate-900 md:text-base">
                4. Finansal Avantaj
              </h3>
              <p>
                Görüşme neticesinde, tarafımızdan tam kapsamlı danışmanlık
                hizmeti almaya karar vermeniz durumunda; ödediğiniz bu ön
                değerlendirme ücreti, toplam danışmanlık paket bedelinden mahsup
                edilir (düşülür).
              </p>

              <h3 className="mt-3 text-sm font-semibold text-slate-900 md:text-base">
                5. Yasal Onaylar ve Gizlilik (Legal Compliance)
              </h3>
              <p>
                Ödeme adımını onaylayarak aşağıdaki yasal metinleri okuduğunuzu
                ve şartları kabul ettiğinizi beyan etmiş sayılırsınız:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <strong>K.V.K.K. Metni ve Aydınlatma Formu:</strong> Kişisel
                  verilerimin vize uygunluk analizi ve iletişim amacıyla
                  işlenmesine onay veriyorum.
                </li>
                <li>
                  <strong>Çerez Politikası (Cookie Policy):</strong> Sitedeki
                  deneyimimi iyileştirmek için kullanılan çerezleri kabul
                  ediyorum.
                </li>
                <li>
                  <strong>Kullanım Şartları (Terms of Service):</strong> Web
                  sitesi üzerinden sunulan hizmetin kullanım kurallarına uymayı
                  taahhüt ediyorum.
                </li>
                <li>
                  <strong>Sorumluluk Reddi (Disclaimer):</strong>{' '}
                  Danışmanlık sürecindeki tavsiye niteliğindeki bilgilerin
                  kullanım sorumluluğunun şahsıma ait olduğunu kabul ediyorum.
                </li>
                <li>
                  <strong>Data Protection and Privacy Notice:</strong>{' '}
                  Uluslararası veri koruma standartlarına ve gizlilik
                  bildirimine uygun hareket edileceğini onaylıyorum.
                </li>
              </ul>

              <div className="mt-4 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-start gap-2 text-xs text-slate-700 md:text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-400 text-brand-red focus:ring-brand-red"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <span>
                    Metnin tamamını okudum, anladım ve tüm şartları kabul
                    ediyorum.
                  </span>
                </label>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary text-xs"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    disabled={!checked}
                    onClick={() => {
                      if (!checked) return;
                      setConsented(true);
                      setShowModal(false);
                    }}
                    className="btn-primary text-xs uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Onaylıyorum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
