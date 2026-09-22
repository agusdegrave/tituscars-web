import { extraerIdYoutube } from "@/lib/youtube";

export function VideoSection({ videoUrl }: { videoUrl: string | null }) {
  if (!videoUrl) return null;

  const id = extraerIdYoutube(videoUrl);

  return (
    <div>
      <h2 className="text-lg font-bold">Video</h2>
      {id ? (
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="Video del auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-foreground underline underline-offset-2 hover:text-brand"
        >
          Ver video
        </a>
      )}
    </div>
  );
}
