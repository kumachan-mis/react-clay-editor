import React from 'react';

import { useParser } from '../../../parser';
import { EditorRoot } from '../../atoms/editor/EditorRoot';
import { TextFieldBody } from '../../atoms/editor/TextFieldBody';
import { TextFieldRoot } from '../../atoms/editor/TextFieldRoot';
import { Header } from '../../atoms/header/Header';
import { Cursor } from '../../molecules/cursor/Cursor';
import { Selection } from '../../molecules/selection/Selection';
import { Text } from '../../molecules/text/Text';
import { SyntaxMenu } from '../SyntaxMenu';

import { useCursorEventHandlers, useEditor, useMouseEventHandlers, useScroll } from './hooks';
import { Props } from './types';

export const Editor: React.FC<Props> = (props) => {
  const [state, setState, ref] = useEditor();
  const [rootMouseEventHandlers, bodyMouseEventHandlers] = useMouseEventHandlers(props, state, setState, ref);
  const cursorEventHandlers = useCursorEventHandlers(props, state, setState);

  useScroll(props.text, state.selectionMouse, setState);

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
    <EditorRoot {...rootMouseEventHandlers} className={props.className} ref={ref}>
      {!props.hideMenu && (
        <SyntaxMenu
          text={props.text}
          nodes={nodes}
          state={state}
          setTextAndState={(newText, newState) => {
            if (newState !== state) setState(newState);
            if (newText !== props.text) props.onChangeText(newText);
          }}
          syntax={props.syntax}
          section={props.textProps}
          bracket={props.bracketLinkProps}
          hashtag={props.hashtagProps}
          taggedLink={props.taggedLinkPropsMap}
          code={props.codeProps}
          formula={props.formulaProps}
        />
      )}
      <TextFieldRoot hideMenu={props.hideMenu}>
        <TextFieldBody {...bodyMouseEventHandlers}>
          {props.textProps?.header && <Header size={props.textProps?.headerSize}>{props.textProps.header}</Header>}
          <Selection textSelection={state.textSelection} />
          <Cursor
            coordinate={state.cursorCoordinate}
            textAreaValue={state.textAreaValue}
            suggestionType={state.suggestionType}
            suggestions={state.suggestions}
            suggestionIndex={state.suggestionIndex}
            mouseHold={state.selectionMouse}
            {...cursorEventHandlers}
          />
          <Text
            nodes={nodes}
            cursorCoordinate={state.cursorCoordinate}
            textSelection={state.textSelection}
            textVisual={props.textProps}
            bracketLinkVisual={props.bracketLinkProps}
            hashtagVisual={props.hashtagProps}
            codeVisual={props.codeProps}
            formulaVisual={props.formulaProps}
            taggedLinkVisualMap={props.taggedLinkPropsMap}
          />
        </TextFieldBody>
      </TextFieldRoot>
    </EditorRoot>
  );
};
