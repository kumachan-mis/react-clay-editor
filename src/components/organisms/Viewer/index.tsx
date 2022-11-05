import React from 'react';

import { useParser } from '../../../parser';
import { Text } from '../Text';

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
  className,
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
      className={className}
    />
  );
};
