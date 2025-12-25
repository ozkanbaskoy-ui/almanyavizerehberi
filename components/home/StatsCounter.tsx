import { RevealOnScroll } from '@/components/common/RevealOnScroll';
import { AnimatedCounter } from '@/components/home/AnimatedCounter';
import type { HomeStat } from '@/lib/settings/home';

type StatsCounterProps = {
  stats: HomeStat[];
};

export function StatsCounter({ stats }: StatsCounterProps) {
  return (
    <section className="bg-surface-soft/80 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <RevealOnScroll className="md:w-1/3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-base/80 md:text-sm">
            Güven Bloğu
          </p>
          <h2 className="mt-3 text-xl font-semibold text-brand-dark md:text-2xl">
            Almanya yolculuğunuzda güçlü referanslar.
          </h2>
          <p className="mt-2 text-sm text-slate-700 md:text-base">
            Gerçek başvurular ve onaylanmış vizelerle, Almanya&apos;ya giden
            yüzlerce kişi bize güvendi.
          </p>
        </RevealOnScroll>
        <RevealOnScroll className="grid flex-1 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border-subtle bg-surface-main/80 px-4 py-4 text-center shadow-soft"
            >
              <div className="text-2xl font-semibold text-brand-dark md:text-3xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}

