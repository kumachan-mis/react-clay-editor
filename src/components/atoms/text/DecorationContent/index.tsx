import { DecorationConfig } from '../../../../parser/decoration/types';

import styled from '@emotion/styled';

export const DecorationContent = styled.span<DecorationConfig>(
  (props) => `
  font-size: ${props.theme[props.size].fontSize};
  line-height: ${props.theme[props.size].lineHeight};
  ${props.bold ? 'font-weight: bold;' : ''}
  ${props.italic ? 'font-style: italic;' : ''}
  ${props.underline ? 'border-bottom: 1px solid;' : ''}
`
);
