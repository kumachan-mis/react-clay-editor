import { FONT_SIZES, LINE_HEIGHTS } from '../../../../common/constants';
import { DecorationConfig } from '../../../../parser/decoration/types';

import styled from '@emotion/styled';

export const DecorationContent = styled.span(
  (props: DecorationConfig) => `
  font-size: ${FONT_SIZES[props.size]};
  line-height: ${LINE_HEIGHTS[props.size]};
  ${props.bold ? 'font-weight: bold;' : ''}
  ${props.italic ? 'font-style: italic;' : ''}
  ${props.underline ? 'border-bottom: 1px solid;' : ''}
`
);
