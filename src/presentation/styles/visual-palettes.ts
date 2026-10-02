import type { CSSProperties } from 'react';

export interface VisualPalette {
  readonly id: string;
  readonly surface: string;
  readonly deep: string;
  readonly accent: string;
  readonly soft: string;
  readonly ink: string;
  readonly shadow: string;
}

export const VISUAL_PALETTES: readonly VisualPalette[] = [
  {
    id: 'violet-lime',
    surface: '#8d12b6',
    deep: '#4a0578',
    accent: '#9dff61',
    soft: '#e9b9f5',
    ink: '#fffaff',
    shadow: '#240038',
  },
  {
    id: 'coral-sun',
    surface: '#d1495b',
    deep: '#7b2330',
    accent: '#ffe66d',
    soft: '#ffd6dc',
    ink: '#fffdf7',
    shadow: '#4b101a',
  },
  {
    id: 'ocean-gold',
    surface: '#1769aa',
    deep: '#083d77',
    accent: '#f4d35e',
    soft: '#bde0fe',
    ink: '#f8fcff',
    shadow: '#032347',
  },
  {
    id: 'forest-amber',
    surface: '#287271',
    deep: '#153f3e',
    accent: '#ffca3a',
    soft: '#b8f2e6',
    ink: '#f7fffd',
    shadow: '#092827',
  },
  {
    id: 'ember-green',
    surface: '#c45120',
    deep: '#6f2410',
    accent: '#b7f34a',
    soft: '#ffd6b0',
    ink: '#fffaf5',
    shadow: '#421207',
  },
  {
    id: 'berry-cyan',
    surface: '#a51c78',
    deep: '#551044',
    accent: '#7df9ff',
    soft: '#f5bce0',
    ink: '#fff9fd',
    shadow: '#340726',
  },
] as const;

export function createRandomPalettePair(
  random: () => number = Math.random,
): readonly [VisualPalette, VisualPalette] {
  const firstIndex = Math.min(
    VISUAL_PALETTES.length - 1,
    Math.floor(random() * VISUAL_PALETTES.length),
  );
  const offset =
    1 + Math.min(VISUAL_PALETTES.length - 2, Math.floor(random() * (VISUAL_PALETTES.length - 1)));

  return [
    VISUAL_PALETTES[firstIndex],
    VISUAL_PALETTES[(firstIndex + offset) % VISUAL_PALETTES.length],
  ];
}

export function visualPaletteStyle(palette: VisualPalette): CSSProperties {
  return {
    '--art-surface': palette.surface,
    '--art-deep': palette.deep,
    '--art-accent': palette.accent,
    '--art-soft': palette.soft,
    '--art-ink': palette.ink,
    '--art-shadow': palette.shadow,
  } as CSSProperties;
}
