import { LineContent } from '../LineContent';

import styled from '@emotion/styled';

export const QuotationLineContent = styled(LineContent)(
  (props) => `
  background-color: ${props.theme.quotation.backgroundColor};
  border-left: solid 4px ${props.theme.quotation.markColor};
  padding-left: 4px;
  font-style: italic;
`
);
