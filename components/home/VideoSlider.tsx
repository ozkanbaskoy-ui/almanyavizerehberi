'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type Video = {
  id: string;
  title: string;
  description?: string;
};

type VideoSliderProps = {
  videos: Video[];
};

// Yatay, kendiliğinden kayan video slider
export function VideoSlider({ videos }: VideoSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || videos.length === 0) return;

    const CARD_WIDTH = 200; // px, yaklaşık kart genişliği
    const interval = setInterval(() => {
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + CARD_WIDTH;

      if (next >= maxScroll) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: next, behavior: 'smooth' });
      }
    }, 6000); // 6 saniyede bir kay

    return () => clearInterval(interval);
  }, [videos.length]);

  if (videos.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-modern snap-x snap-mandatory"
    >
      {videos.map((video, index) => (
        <motion.article
          key={video.id}
          className="snap-start flex w-[180px] flex-shrink-0 flex-col items-center md:w-[200px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: index * 0.03,
          }}
        >
          <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-lg">
            <div className="relative w-full aspect-[9/16]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
                title={video.title}
                loading="lazy"
                className="absolute left-0 top-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <h3 className="mt-3 line-clamp-2 text-center text-base font-semibold text-brand-dark md:text-lg">
            {video.title}
          </h3>
          {video.description && (
            <p className="mt-1 line-clamp-3 text-center text-sm text-slate-800 md:text-base">
              {video.description}
            </p>
          )}
        </motion.article>
      ))}
    </div>
  );
}
