import { DecorationTheme } from '../types/visual/theme';

import { Theme } from '@emotion/react';

const BASE_FONT_FAMILY: string = [
  // BASE_FONT_FAMILY
  'IBM Plex Sans',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
].join(', ');

const MONOSPACE_FONT_FAMILY: string = [
  // MONOSPACE_FONT_FAMILY
  'SFMono-Regular',
  'Consolas',
  'Liberation Mono',
  'Menlo',
  'monospace',
].join(', ');

const LARGEST_DECORATION: DecorationTheme = {
  fontSize: '1.8rem',
  lineHeight: 1.5,
} as const;

const LARGER_DECORATION: DecorationTheme = {
  fontSize: '1.34rem',
  lineHeight: 1.45,
} as const;

const NORMAL_DECORATION: DecorationTheme = {
  fontSize: '1rem',
  lineHeight: 1.4,
} as const;

const LIST_ITEM_DECORATION: DecorationTheme = {
  fontSize: '0.9rem',
  lineHeight: 1.4,
} as const;

export const LIGHT_THEME: Theme = {
  base: {
    fontFamily: BASE_FONT_FAMILY,
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    cursorColor: 'rgba(0, 0, 0, 0.87)',
    selectionColor: 'rgba(172, 206, 247, 0.5)',
    dividerColor: 'rgba(0, 0, 0, 0.12)',
  },
  normal: NORMAL_DECORATION,
  larger: LARGER_DECORATION,
  largest: LARGEST_DECORATION,
  link: {
    color: 'rgba(25, 118, 210, 0.67)',
    clickableColor: 'rgba(25, 118, 210, 1.0)',
  },
  monospace: {
    fontFamily: MONOSPACE_FONT_FAMILY,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  quotation: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    markColor: 'rgba(0, 0, 0, 0.16)',
  },
  list: {
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    shadowColor: 'rgba(0, 0, 0, 0.18)',
  },
  listItem: {
    ...LIST_ITEM_DECORATION,
    unselectedColor: 'rgba(0, 0, 0, 0.87)',
    unselectedBackgroundColor: 'rgba(0, 0, 0, 0.0)',
    unselectedHoverBackgroundColor: 'rgba(0, 0, 0, 0.04)',
    selectedColor: 'rgba(0, 0, 0, 0.87)',
    selectedBackgroundColor: 'rgba(0, 0, 0, 0.08)',
    selectedHoverBackgroundColor: 'rgba(0, 0, 0, 0.12)',
    disabledColor: 'rgba(0, 0, 0, 0.26)',
    disabledBackgroundColor: 'rgba(0, 0, 0, 0.12)',
    dividerColor: 'rgba(0, 0, 0, 0.12)',
  },
  iconButton: {
    unselectedIconColor: 'rgba(0, 0, 0, 0.87)',
    unselectedBackgroundColor: 'rgba(0, 0, 0, 0.0)',
    unselectedHoverBackgroundColor: 'rgba(0, 0, 0, 0.04)',
    selectedIconColor: 'rgba(0, 0, 0, 0.87)',
    selectedBackgroundColor: 'rgba(0, 0, 0, 0.08)',
    selectedHoverBackgroundColor: 'rgba(0, 0, 0, 0.12)',
    disabledIconColor: 'rgba(0, 0, 0, 0.26)',
    disabledBackgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
} as const;

export const DARK_THEME: Theme = {
  base: {
    fontFamily: BASE_FONT_FAMILY,
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(24, 24, 24, 1.0)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    cursorColor: 'rgba(255, 255, 255, 1.0)',
    selectionColor: 'rgba(172, 206, 247, 0.5)',
    dividerColor: 'rgba(255, 255, 255, 0.12)',
  },
  normal: NORMAL_DECORATION,
  larger: LARGER_DECORATION,
  largest: LARGEST_DECORATION,
  link: {
    color: 'rgba(25, 118, 210, 0.67)',
    clickableColor: 'rgba(25, 118, 210, 1.0)',
  },
  monospace: {
    fontFamily: MONOSPACE_FONT_FAMILY,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  quotation: {
    color: 'rgba(255, 255, 255, 1.0)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    markColor: 'rgba(255, 255, 255, 0.16)',
  },
  list: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(24, 24, 24, 1.0)',
    shadowColor: 'rgba(255, 255, 255, 0.18)',
  },
  listItem: {
    ...LIST_ITEM_DECORATION,
    unselectedColor: 'rgba(255, 255, 255, 1.0)',
    unselectedBackgroundColor: 'rgba(255, 255, 255, 0.0)',
    unselectedHoverBackgroundColor: 'rgba(255, 255, 255, 0.08)',
    selectedColor: 'rgba(255, 255, 255, 1.0)',
    selectedBackgroundColor: 'rgba(255, 255, 255, 0.16)',
    selectedHoverBackgroundColor: 'rgba(255, 255, 255, 0.24)',
    disabledColor: 'rgba(255, 255, 255, 0.3)',
    disabledBackgroundColor: 'rgba(255, 255, 255, 0.12)',
    dividerColor: 'rgba(255, 255, 255, 0.12)',
  },
  iconButton: {
    unselectedIconColor: 'rgba(255, 255, 255, 1.0)',
    unselectedBackgroundColor: 'rgba(255, 255, 255, 0.0)',
    unselectedHoverBackgroundColor: 'rgba(255, 255, 255, 0.08)',
    selectedIconColor: 'rgba(255, 255, 255, 1.0)',
    selectedBackgroundColor: 'rgba(255, 255, 255, 0.16)',
    selectedHoverBackgroundColor: 'rgba(255, 255, 255, 0.24)',
    disabledIconColor: 'rgba(255, 255, 255, 0.3)',
    disabledBackgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
} as const;

export const WORD_REGEX: RegExp = /[^\s!"#$%&'()*+,-./:;<=>?@[\\\]^`{|}~]+/;
