'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

// Basit scroll reveal bileşeni:
// y: 50, opacity: 0'dan başlar; y: 0, opacity: 1'e easeOut 0.8s'de gelir.
// viewport: once: true, amount: 0.5 -> öğe ekranın yarısından fazlası görününce 1 kez tetiklenir.
export function RevealOnScroll({
  children,
  className,
  delay = 0,
}: RevealOnScrollProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      // amount: 0.15 -> elemanin kucuk bir kismi gorunur olur olmaz animasyon
      // baslasin; mobilde "bos gorunme" sorununu azaltir.
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
