'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';

const HERO_IMAGE = '/assets/img/anasayfa-gorsel.png?v=20260430-1456';

export function HeroParallaxImage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <motion.div
      style={{ y }}
      className="relative mx-auto h-[250px] w-full max-w-[720px] md:h-[410px] lg:h-[470px]"
    >
      <Image
        src={HERO_IMAGE}
        alt="Almanya Vize Rehberi"
        fill
        className="object-contain object-center drop-shadow-[0_28px_55px_rgba(0,0,0,0.28)]"
        priority
      />
    </motion.div>
  );
}
