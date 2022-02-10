import React from 'react';

import { TextLines } from '../TextLines';
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
    <TextLines
      nodes={nodes}
      bracketLinkVisual={props.bracketLinkProps}
      hashtagVisual={props.hashtagProps}
      codeVisual={props.codeProps}
      formulaVisual={props.formulaProps}
      taggedLinkVisualMap={props.taggedLinkPropsMap}
      className={props.className}
      style={props.style}
    />
  );
};
