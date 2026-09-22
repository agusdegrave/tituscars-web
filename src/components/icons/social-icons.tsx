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
