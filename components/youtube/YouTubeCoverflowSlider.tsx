'use client';

import { motion } from 'framer-motion';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Video = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
};

type Props = {
  videos: Video[];
};

export function YouTubeCoverflowSlider({ videos }: Props) {
  if (videos.length === 0) return null;

  return (
    <Swiper
      modules={[EffectCoverflow, Navigation, Pagination]}
      effect="coverflow"
      grabCursor
      centeredSlides
      slidesPerView="auto"
      coverflowEffect={{
        rotate: 25,
        stretch: 0,
        depth: 150,
        modifier: 1,
        slideShadows: false,
      }}
      navigation
      pagination={{ clickable: true }}
      className="youtube-coverflow-slider w-full"
    >
      {videos.map((video, index) => (
        <SwiperSlide
          key={video.id}
          className="!w-[260px] md:!w-[320px]"
        >
          <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.03 }}
            className="flex h-full flex-col overflow-hidden rounded-xl bg-surface-main shadow-lg ring-1 ring-border-subtle/70 transition-transform duration-300 hover:scale-[1.03] hover:shadow-card-hover"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <ImageWithFallback
                src={video.thumbnailUrl}
                alt={video.title}
              />
            </div>
            <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
              <h3 className="line-clamp-2 text-sm font-semibold text-brand-dark">
                {video.title}
              </h3>
              {video.description && (
                <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                  {video.description}
                </p>
              )}
            </div>
          </motion.article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

type ImageWithFallbackProps = {
  src: string;
  alt: string;
};

function ImageWithFallback({ src, alt }: ImageWithFallbackProps) {
  return (
    // Swiper içinde next/image yerine basit img kullanıyoruz
    // çünkü boyutlar Swiper tarafından yönetiliyor.
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}

