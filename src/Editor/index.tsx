import React from 'react';

import { SyntaxMenu } from '../SyntaxMenu';
import { mergeClassNames, createTestId } from '../common/utils';
import { Cursor } from '../components/molecules/cursor/Cursor';
import { Selection } from '../components/molecules/selection/Selection';
import { Text } from '../components/organisms/Text';
import { useParser } from '../parser';

import { EditorConstants } from './constants';
import { Props } from './types';
import { useCursorEventHandlers, useEditor, useMouseEventHandlers, useScroll } from './utils';

export const Editor: React.FC<Props> = (props) => {
  const [state, setState, ref] = useEditor();
  const [rootMouseEventHandlers, bodyMouseEventHandlers] = useMouseEventHandlers(props, state, setState, ref);
  const cursorEventHandlers = useCursorEventHandlers(props, state, setState);

  useScroll(props.text, state.selectionMouse, props.readonly, setState);

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
    <div
      className={mergeClassNames(EditorConstants.root.className, props.className)}
      style={props.style}
      ref={ref}
      {...rootMouseEventHandlers}
      data-selectid={EditorConstants.root.selectId}
    >
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
          listProps={{ className: EditorConstants.syntaxMenu.className }}
        />
      )}
      <div
        className={EditorConstants.editor.className}
        style={EditorConstants.editor.style(props.hideMenu)}
        data-selectid={EditorConstants.editor.selectId}
        data-testid={createTestId(EditorConstants.editor.testId)}
      >
        <div
          className={EditorConstants.body.className}
          {...bodyMouseEventHandlers}
          data-selectid={EditorConstants.body.selectId}
          data-testid={createTestId(EditorConstants.body.testId)}
        >
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
        </div>
      </div>
    </div>
  );
};
