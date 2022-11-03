import React from 'react';

import { Text } from '../Text';
import { useParser } from '../parser';

import { Props } from './types';

export const Viewer: React.FC<Props> = (props) => {
  const nodes = useParser(
    props.text,
    props.syntax,
    props.bracketLinkProps,
    props.hashtagProps,
    props.taggedLinkPropsMap,
    props.codeProps,
    props.formulaProps
  );

  return (
    <Text
      nodes={nodes}
      textVisual={props.textProps}
      bracketLinkVisual={props.bracketLinkProps}
      hashtagVisual={props.hashtagProps}
      codeVisual={props.codeProps}
      formulaVisual={props.formulaProps}
      taggedLinkVisualMap={props.taggedLinkPropsMap}
      className={props.className}
    />
  );
};
