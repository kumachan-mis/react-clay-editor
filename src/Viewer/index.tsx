import React from 'react';

import { TextLines } from '../TextLines';
import { useOptionalParser, useParser, useParsingOptions } from '../parser';

import { Props } from './types';

export const Viewer: React.FC<Props> = (props) => {
  const parsingOptions = useParsingOptions(
    props.syntax,
    props.bracketLinkProps,
    props.hashtagProps,
    props.taggedLinkPropsMap,
    props.codeProps,
    props.formulaProps
  );
  const nodes = useParser(props.text, parsingOptions);
  const headerNodes = useOptionalParser(props.header, parsingOptions);

  return (
    <TextLines
      nodes={nodes}
      headerNodes={headerNodes}
      textVisual={props.textProps}
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
