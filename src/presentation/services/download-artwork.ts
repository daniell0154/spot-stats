import { toPng } from 'html-to-image';

const EXPORT_SCALE = 3;

export async function downloadArtworkAsPng(artwork: HTMLElement, filename: string): Promise<void> {
  await document.fonts?.ready;
  const { width, height } = artwork.getBoundingClientRect();

  const dataUrl = await toPng(artwork, {
    cacheBust: true,
    pixelRatio: EXPORT_SCALE,
    width,
    height,
    style: {
      margin: '0',
      transform: 'none',
      boxShadow: 'none',
    },
  });
  const downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = dataUrl;
  downloadLink.click();
}
