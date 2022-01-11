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
      bracketLinkProps={props.bracketLinkProps}
      hashtagProps={props.hashtagProps}
      codeProps={props.codeProps}
      formulaProps={props.formulaProps}
      taggedLinkPropsMap={props.taggedLinkPropsMap}
      className={props.className}
      style={props.style}
    />
  );
};
