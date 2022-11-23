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
import { EditorProps } from './types';

export const Editor: React.FC<EditorProps> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { state, setState } = useEditorState(props, ref);
  const editorRootEventHandlers = useEditorRootEventHandlers(ref);
  const textFieldBodyEventHandlers = useTextFieldBodyEventHandlers(props, setState, ref);
  const cursorEventHandlers = useCursorEventHandlers(props, state, setState);

  useScroll(props.text, state.cursorScroll, setState);

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
      {!props.hideSyntaxMenu && (
        <SyntaxMenu
          text={props.text}
          nodes={nodes}
          state={state}
          onChangeText={props.onChangeText}
          setState={setState}
          syntax={props.syntax}
          sectionProps={props.textProps}
          bracketProps={props.bracketLinkProps}
          hashtagProps={props.hashtagProps}
          taggedLinkPropsMap={props.taggedLinkPropsMap}
          codeProps={props.codeProps}
          formulaProps={props.formulaProps}
        />
      )}
      <TextFieldRoot hideSyntaxMenu={props.hideSyntaxMenu}>
        <TextFieldBody {...textFieldBodyEventHandlers}>
          {props.textProps?.header && <Header size={props.textProps?.headerSize}>{props.textProps.header}</Header>}
          <Selection cursorSelection={state.cursorSelection} />
          <Cursor
            cursorCoordinate={state.cursorCoordinate}
            textAreaValue={state.textAreaValue}
            suggestionType={state.suggestionType}
            suggestions={state.suggestions}
            suggestionIndex={state.suggestionIndex}
            cursorScroll={state.cursorScroll}
            {...cursorEventHandlers}
          />
          <Text
            nodes={nodes}
            cursorCoordinate={state.cursorCoordinate}
            cursorSelection={state.cursorSelection}
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
