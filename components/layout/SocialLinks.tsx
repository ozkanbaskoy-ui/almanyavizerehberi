type SocialLinksProps = {
  instagramUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  className?: string;
  iconClassName?: string;
  variant?: 'top' | 'footer';
};

const DEFAULT_YOUTUBE_URL = 'https://www.youtube.com/@AlmanyaVizeRehberi';
const X_URL = 'https://x.com/VizeRehberi';
const TIKTOK_URL = 'https://www.tiktok.com/@almanyavizerehberi';
const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/almanyavizerehberi/';

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.5a3 3 0 0 0-2.1 2.1A31.1 31.1 0 0 0 2 12a31.1 31.1 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.1 31.1 0 0 0 22 12a31.1 31.1 0 0 0-.4-4.8ZM10 15.4V8.6l5.8 3.4L10 15.4Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.2 2.8h3.2l-7 8 8.2 10.4h-6.4l-5-6.4-5.7 6.4H2.3l7.5-8.5L1.9 2.8h6.6l4.5 5.8 5.2-5.8Zm-1.1 16.6h1.8L7.5 4.5H5.6l11.5 14.9Z"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.7 2.5c.3 2.3 1.6 3.8 3.8 4v3.3a7 7 0 0 1-3.8-1.2v6.7c0 3.4-2.2 6.2-6 6.2A5.9 5.9 0 0 1 4.5 16c0-3.7 3.2-6.4 7-5.7v3.5c-1.7-.5-3.5.5-3.5 2.2 0 1.4 1.1 2.3 2.5 2.3 1.5 0 2.5-.9 2.5-2.9V2.5h3.7Z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 7.3A4.7 4.7 0 1 0 16.7 12 4.71 4.71 0 0 0 12 7.3Zm0 7.7A3 3 0 1 1 15 12a3 3 0 0 1-3 3Z"
      />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      <path
        fill="currentColor"
        d="M17.5 3H6.5A3.5 3.5 0 0 0 3 6.5v11A3.5 3.5 0 0 0 6.5 21h11a3.5 3.5 0 0 0 3.5-3.5v-11A3.5 3.5 0 0 0 17.5 3Zm2 14.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.7 22v-7.4h2.5l.4-2.9h-2.9V9.8c0-.8.2-1.4 1.5-1.4h1.6V5.8c-.8-.1-1.8-.2-3-.2-2.9 0-4.8 1.8-4.8 5v1.1H7v2.9h2v7.4h4.7Z"
      />
    </svg>
  );
}

export function SocialLinks({
  instagramUrl,
  youtubeUrl,
  facebookUrl,
  className,
  iconClassName,
  variant = 'top',
}: SocialLinksProps) {
  const baseClass =
    variant === 'footer'
      ? 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-brand-light/40 hover:bg-white/10 hover:text-white'
      : 'inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-slate-100 shadow-sm ring-1 ring-slate-700/70 transition hover:bg-brand-base hover:text-white hover:shadow-md';

  const links = [
    {
      label: 'YouTube',
      href: youtubeUrl || DEFAULT_YOUTUBE_URL,
      icon: <YouTubeIcon />,
    },
    {
      label: 'X',
      href: X_URL,
      icon: <XIcon />,
    },
    {
      label: 'TikTok',
      href: TIKTOK_URL,
      icon: <TikTokIcon />,
    },
    {
      label: 'Instagram',
      href: instagramUrl || DEFAULT_INSTAGRAM_URL,
      icon: <InstagramIcon />,
    },
    ...(facebookUrl
      ? [
          {
            label: 'Facebook',
            href: facebookUrl,
            icon: <FacebookIcon />,
          },
        ]
      : []),
  ];

  return (
    <div className={className}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label}
          title={link.label}
          className={iconClassName || baseClass}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
