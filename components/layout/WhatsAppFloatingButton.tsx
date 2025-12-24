'use client';

export function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/491783821542"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp ile hızlı iletişim"
      className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-105 hover:bg-emerald-600"
    >
      <span className="text-xl">W</span>
    </a>
  );
}

