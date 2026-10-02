import { beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadArtworkAsPng } from '../../src/presentation/services/download-artwork';

const toPngMock = vi.hoisted(() => vi.fn());

vi.mock('html-to-image', () => ({ toPng: toPngMock }));

describe('downloadArtworkAsPng', () => {
  beforeEach(() => {
    toPngMock.mockReset();
  });

  it('gera e baixa uma imagem PNG em escala 3x', async () => {
    const artwork = document.createElement('article');
    artwork.style.margin = '0 auto';
    vi.spyOn(artwork, 'getBoundingClientRect').mockReturnValue({
      width: 620,
      height: 1000,
      x: 340,
      y: 180,
      top: 180,
      left: 340,
      right: 960,
      bottom: 1180,
      toJSON: () => ({}),
    });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    toPngMock.mockResolvedValue('data:image/png;base64,imagem');

    await downloadArtworkAsPng(artwork, 'retrato.png');

    expect(toPngMock).toHaveBeenCalledWith(artwork, {
      cacheBust: true,
      pixelRatio: 3,
      width: 620,
      height: 1000,
      style: { margin: '0', transform: 'none', boxShadow: 'none' },
    });
    expect(artwork.style.margin).toBe('0px auto');
    expect(click).toHaveBeenCalledOnce();
    click.mockRestore();
  });
});
