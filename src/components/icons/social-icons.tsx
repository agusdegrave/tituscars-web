type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2.05C17.9 4.7 12 4.7 12 4.7s-5.9 0-7.6.45a2.9 2.9 0 0 0-2 2.05A30.4 30.4 0 0 0 2 12a30.4 30.4 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2.05c1.7.45 7.6.45 7.6.45s5.9 0 7.6-.45a2.9 2.9 0 0 0 2-2.05A30.4 30.4 0 0 0 22 12a30.4 30.4 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12Z" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5l2.9 6.15 6.6.77-4.9 4.6 1.28 6.6L12 17.6l-5.88 3.02 1.28-6.6-4.9-4.6 6.6-.77Z" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-1.02-.89-1.64-2.18-1.64-3.62h-3.12v14.24c0 1.53-1.25 2.78-2.78 2.78a2.78 2.78 0 0 1-2.78-2.78 2.78 2.78 0 0 1 2.78-2.78c.29 0 .57.04.83.13V10.6a5.9 5.9 0 0 0-.83-.06A5.9 5.9 0 0 0 3.16 16.44 5.9 5.9 0 0 0 9.06 22.3a5.9 5.9 0 0 0 5.9-5.86V9.03a8.24 8.24 0 0 0 4.82 1.55V7.46a5.15 5.15 0 0 1-3.18-1.64z" />
    </svg>
  );
}
