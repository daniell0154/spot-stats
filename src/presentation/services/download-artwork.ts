import { toPng } from 'html-to-image';

const EXPORT_SCALE = 3;

export async function downloadArtworkAsPng(artwork: HTMLElement, filename: string): Promise<void> {
  await document.fonts?.ready;

  const dataUrl = await toPng(artwork, {
    cacheBust: true,
    pixelRatio: EXPORT_SCALE,
  });
  const downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = dataUrl;
  downloadLink.click();
}
