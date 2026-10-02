import { describe, expect, it, vi } from 'vitest';
import {
  createRandomPalettePair,
  VISUAL_PALETTES,
} from '../../src/presentation/styles/visual-palettes';

describe('createRandomPalettePair', () => {
  it('sempre retorna duas paletas curadas distintas', () => {
    for (let index = 0; index < VISUAL_PALETTES.length; index += 1) {
      const random = vi
        .fn()
        .mockReturnValueOnce(index / VISUAL_PALETTES.length)
        .mockReturnValueOnce(0);
      const [portrait, capsule] = createRandomPalettePair(random);

      expect(portrait.id).not.toBe(capsule.id);
      expect(VISUAL_PALETTES).toContain(portrait);
      expect(VISUAL_PALETTES).toContain(capsule);
    }
  });

  it('é determinístico para a mesma sequência aleatória', () => {
    const first = createRandomPalettePair(
      vi.fn().mockReturnValueOnce(0.4).mockReturnValueOnce(0.7),
    );
    const second = createRandomPalettePair(
      vi.fn().mockReturnValueOnce(0.4).mockReturnValueOnce(0.7),
    );

    expect(first.map((palette) => palette.id)).toEqual(second.map((palette) => palette.id));
  });
});
