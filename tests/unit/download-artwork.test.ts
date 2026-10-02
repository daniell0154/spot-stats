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
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    toPngMock.mockResolvedValue('data:image/png;base64,imagem');

    await downloadArtworkAsPng(artwork, 'retrato.png');

    expect(toPngMock).toHaveBeenCalledWith(artwork, {
      cacheBust: true,
      pixelRatio: 3,
    });
    expect(click).toHaveBeenCalledOnce();
    click.mockRestore();
  });
});
