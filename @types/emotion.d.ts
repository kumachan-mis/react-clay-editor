import '@emotion/react';
import {
  BaseTheme,
  DecorationTheme,
  IconButtonTheme,
  LinkTheme,
  ListItemTheme,
  ListTheme,
  MonospaceTheme,
  QuotationTheme,
} from '../src/types/visual/theme';

declare module '@emotion/react' {
  interface Theme {
    base: BaseTheme;
    normal: DecorationTheme;
    larger: DecorationTheme;
    largest: DecorationTheme;
    link: LinkTheme;
    monospace: MonospaceTheme;
    quotation: QuotationTheme;
    list: ListTheme;
    listItem: ListItemTheme;
    iconButton: IconButtonTheme;
  }
}
