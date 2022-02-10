import React from 'react';

import { Cursor } from '../Cursor';
import { Selection } from '../Selection';
import { SyntaxMenu } from '../SyntaxMenu';
import { TextLines } from '../TextLines';
import { mergeClassNames, createTestId } from '../common/utils';
import { useParser } from '../parser';

import { EditorConstants } from './constants';
import { Props } from './types';
import { useCursorEventHandlers, useEditor, useMouseEventHandlers, useScrollbyHoldingMouse } from './utils';

export const Editor: React.FC<Props> = (props) => {
  const [state, setState, rootRef, editorRef] = useEditor();
  const [docHandlers, rootHandlers, editorHandlers] = useMouseEventHandlers(props, state, setState, rootRef, editorRef);
  const cursorEventHandlers = useCursorEventHandlers(props, state, setState);

  useScrollbyHoldingMouse(props.text, state.selectionMouse, props.readonly, setState);

  React.useEffect(() => {
    document.addEventListener('mousedown', docHandlers.onMouseDown);
    return () => {
      document.removeEventListener('mousedown', docHandlers.onMouseDown);
    };
  }, [docHandlers.onMouseDown]);

  React.useEffect(() => {
    document.addEventListener('mousemove', docHandlers.onMouseMove);
    return () => {
      document.removeEventListener('mousemove', docHandlers.onMouseMove);
    };
  }, [docHandlers.onMouseMove]);

  React.useEffect(() => {
    document.addEventListener('mouseup', docHandlers.onMouseUp);
    return () => {
      document.removeEventListener('mouseup', docHandlers.onMouseUp);
    };
  }, [docHandlers.onMouseUp]);

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
      ref={rootRef}
      data-selectid={EditorConstants.root.selectId}
      {...rootHandlers}
    >
      {!props.hideSyntaxMenu && (
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
          containerProps={{ className: EditorConstants.syntaxMenu.className }}
        />
      )}
      <div
        className={EditorConstants.editor.className}
        style={EditorConstants.editor.style(props.hideSyntaxMenu)}
        ref={editorRef}
        data-selectid={EditorConstants.editor.selectId}
        data-testid={createTestId(EditorConstants.editor.testId)}
      >
        <div
          className={EditorConstants.body.className}
          {...editorHandlers}
          data-selectid={EditorConstants.body.selectId}
          data-testid={createTestId(EditorConstants.body.testId)}
        >
          <Cursor
            coordinate={state.cursorCoordinate}
            textAreaValue={state.textAreaValue}
            suggestionType={state.suggestionType}
            suggestions={state.suggestions}
            suggestionIndex={state.suggestionIndex}
            mouseHold={state.selectionMouse}
            {...cursorEventHandlers}
          />
          <Selection textSelection={state.textSelection} />
          <TextLines
            nodes={nodes}
            cursorCoordinate={state.cursorCoordinate}
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
