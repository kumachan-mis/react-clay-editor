import { LineContent } from '../LineContent';

import styled from '@emotion/styled';

export const MonospaceLineContent = styled(LineContent)(
  (props) => `
  background-color: ${props.theme.monospace.backgroundColor};
  > code {
    font-family: ${props.theme.monospace.fontFamily};
    background-color: unset;
  }
`,
);
