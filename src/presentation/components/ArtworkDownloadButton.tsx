import { useState, type RefObject } from 'react';
import { downloadArtworkAsPng } from '../services/download-artwork';

interface ArtworkDownloadButtonProps {
  artworkRef: RefObject<HTMLElement | null>;
  filename: string;
  artworkName: string;
}

export function ArtworkDownloadButton({
  artworkRef,
  filename,
  artworkName,
}: ArtworkDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async () => {
    if (!artworkRef.current || isDownloading) return;

    setIsDownloading(true);
    setError(null);
    try {
      await downloadArtworkAsPng(artworkRef.current, filename);
    } catch {
      setError('Não foi possível gerar a imagem. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="artwork-download">
      <button
        type="button"
        className="artwork-download-button"
        onClick={() => void download()}
        disabled={isDownloading}
        aria-label={`Baixar ${artworkName} em PNG com alta qualidade`}
      >
        <span aria-hidden="true">↓</span>
        {isDownloading ? 'Gerando imagem…' : 'Baixar PNG em alta qualidade'}
      </button>
      {error ? <p role="status">{error}</p> : null}
    </div>
  );
}
