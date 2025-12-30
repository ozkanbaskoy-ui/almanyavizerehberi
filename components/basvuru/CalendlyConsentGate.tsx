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
      {/* Calendly her zaman görünür */}
      <div className="relative mt-10">
        <CalendlyEmbed url={url} />

        {/* Rıza verilene kadar Calendly üzerine tıklama kilidi */}
        {!consented && (
          <>
            <div
              className="absolute inset-0 z-20 cursor-pointer rounded-[2.5rem] bg-transparent"
              onClick={() => setShowModal(true)}
            />
            <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] border-2 border-dashed border-brand-red/40" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.7)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                Danışmanlık Ön Görüşme ve Hizmet Şartları Onay Metni
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Kapat
              </button>
            </div>
            <div className="max-h-[70vh] space-y-3 overflow-y-auto px-5 py-4 text-xs leading-relaxed text-slate-800 md:text-sm">
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

              <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-3">
                <label className="flex items-start gap-2 text-xs text-slate-800 md:text-sm">
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
                    className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
                    className="rounded-full bg-brand-red px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-400 hover:bg-red-700"
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

