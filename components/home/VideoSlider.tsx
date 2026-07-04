'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

type Video = {
  id: string;
  title: string;
  description?: string;
};

type VideoSliderProps = {
  videos: Video[];
};

export function VideoSlider({ videos }: VideoSliderProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [enabledVideoId, setEnabledVideoId] = useState<string | null>(null);

  if (videos.length === 0) return null;

  const canAutoPlay = videos.length > 1;

  function goPrevious() {
    const swiper = swiperRef.current;
    if (!swiper || videos.length <= 1) return;

    if (swiper.activeIndex <= 0) {
      swiper.slideTo(videos.length - 1);
      return;
    }

    swiper.slidePrev();
  }

  function goNext() {
    const swiper = swiperRef.current;
    if (!swiper || videos.length <= 1) return;

    if (swiper.activeIndex >= videos.length - 1) {
      swiper.slideTo(0);
      return;
    }

    swiper.slideNext();
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, EffectCoverflow, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={() => {
          setEnabledVideoId(null);
        }}
        effect="coverflow"
        grabCursor
        centeredSlides
        simulateTouch
        touchRatio={1}
        touchAngle={35}
        threshold={6}
        touchStartPreventDefault={false}
        loop={false}
        slidesPerView="auto"
        speed={750}
        autoplay={
          canAutoPlay
            ? {
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                stopOnLastSlide: false,
                waitForTransition: true,
              }
            : false
        }
        observer
        observeParents
        coverflowEffect={{
          rotate: 22,
          stretch: 8,
          depth: 180,
          modifier: 1.15,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        className="home-video-coverflow mt-8 w-full pb-12 pt-2"
      >
        {videos.map((video, index) => (
          <SwiperSlide
            key={`${video.id}-${index}`}
            className="!w-[210px] sm:!w-[235px] md:!w-[270px]"
          >
            <motion.article
              className="group flex h-full flex-col"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: 0.65,
                ease: 'easeOut',
                delay: index * 0.03,
              }}
            >
              <div className="relative overflow-hidden rounded-[22px] border border-white/12 bg-slate-950 shadow-[0_24px_70px_rgba(2,6,23,0.35)] ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_82px_rgba(2,6,23,0.45)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-white/14 to-transparent" />
                <div
                  className={`relative aspect-[9/16] w-full ${
                    enabledVideoId === video.id ? 'is-video-enabled' : ''
                  }`}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1${
                      enabledVideoId === video.id ? '&autoplay=1' : ''
                    }`}
                    title={video.title}
                    loading="lazy"
                    className="absolute left-0 top-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  {enabledVideoId !== video.id && (
                    <button
                      type="button"
                      aria-label={`${video.title} videosunu oynat`}
                      onClick={() => setEnabledVideoId(video.id)}
                      className="mobile-video-enable absolute left-1/2 top-1/2 z-20 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-transparent md:hidden"
                    >
                      <span className="sr-only">Videoyu oynat</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="home-video-caption mx-auto mt-4 max-w-[92%] text-center">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow-sm md:text-base">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-surface-main/72 md:text-sm">
                    {video.description}
                  </p>
                )}
              </div>
            </motion.article>
          </SwiperSlide>
        ))}
      </Swiper>

      {videos.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrevious}
            className="home-video-nav-button home-video-nav-button-prev"
            aria-label="Önceki video"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="home-video-nav-button home-video-nav-button-next"
            aria-label="Sonraki video"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
