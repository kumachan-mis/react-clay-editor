import React from 'react';

import { EditorRoot } from '../../atoms/editor/EditorRoot';
import { TextFieldBody } from '../../atoms/editor/TextFieldBody';
import { TextFieldRoot } from '../../atoms/editor/TextFieldRoot';
import { Header } from '../../atoms/header/Header';
import { Cursor } from '../../molecules/cursor/Cursor';
import { Selection } from '../../molecules/selection/Selection';
import { Text } from '../../molecules/text/Text';
import { SyntaxMenu } from '../SyntaxMenu';

import {
  useParser,
  useCursorEventHandlers,
  useEditorState,
  useScroll,
  useTextFieldBodyEventHandlers,
  useEditorRootEventHandlers,
} from './hooks';
import { Props } from './types';

export const Editor: React.FC<Props> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { state, setState } = useEditorState(props, ref);
  const editorRootEventHandlers = useEditorRootEventHandlers(ref);
  const textFieldBodyEventHandlers = useTextFieldBodyEventHandlers(props, state, setState, ref);
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
    <EditorRoot className={props.className} ref={ref} {...editorRootEventHandlers}>
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
          sectionProps={props.textProps}
          bracketProps={props.bracketLinkProps}
          hashtagProps={props.hashtagProps}
          taggedLinkPropsMap={props.taggedLinkPropsMap}
          codeProps={props.codeProps}
          formulaProps={props.formulaProps}
        />
      )}
      <TextFieldRoot hideMenu={props.hideMenu}>
        <TextFieldBody {...textFieldBodyEventHandlers}>
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
