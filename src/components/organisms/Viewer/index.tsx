import React from 'react';

import { useParser } from '../../../parser';
import { Text } from '../../molecules/text/Text';

import { ViewerProps } from './types';

export const Viewer: React.FC<ViewerProps> = ({
  text,
  syntax,
  textProps,
  bracketLinkProps,
  hashtagProps,
  taggedLinkPropsMap,
  codeProps,
  formulaProps,
}) => {
  const nodes = useParser(text, syntax, bracketLinkProps, hashtagProps, taggedLinkPropsMap, codeProps, formulaProps);

  return (
    <Text
      nodes={nodes}
      textVisual={textProps}
      bracketLinkVisual={bracketLinkProps}
      hashtagVisual={hashtagProps}
      codeVisual={codeProps}
      formulaVisual={formulaProps}
      taggedLinkVisualMap={taggedLinkPropsMap}
    />
  );
};
