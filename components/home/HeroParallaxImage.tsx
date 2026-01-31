'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';

// Ana sayfa slider görseli de artık projedeki statik asset'ten okunuyor.
// Eski 2b.almanyavizerehberi.com alan adı Vercel'de artık aktif olmadığı için
// remote URL production ortamında 404 dönüyordu.
const HERO_IMAGE = '/assets/img/slider.webp';

export function HeroParallaxImage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <motion.div
      style={{ y }}
      className="relative h-72 w-full overflow-hidden rounded-[2.5rem] border border-surface-main/10 bg-surface-main/5 shadow-2xl shadow-black/40"
    >
      <Image
        src={HERO_IMAGE}
        alt="Almanya Vize Rehberi"
        fill
        className="object-cover"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-dark/70 via-transparent to-brand-light/30" />
    </motion.div>
  );
}
