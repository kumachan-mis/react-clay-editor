import { Theme as EditorTheme } from '../src/types/visual/theme';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as emotionReact from '@emotion/react';

declare module '@emotion/react' {
  type Theme = EditorTheme;
}
