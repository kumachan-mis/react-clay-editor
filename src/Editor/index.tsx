import React from 'react';

import { Cursor } from '../Cursor';
import { Selection } from '../Selection';
import { SyntaxMenu } from '../SyntaxMenu';
import { TextLines } from '../TextLines';
import { mergeClassNames, createTestId } from '../common/utils';

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

  return (
    <div
      className={mergeClassNames(EditorConstants.root.className, props.className)}
      style={props.style}
      ref={rootRef}
      {...rootHandlers}
    >
      <SyntaxMenu
        text={props.text}
        state={state}
        setTextAndState={([newText, newState]) => {
          if (newState !== state) setState(newState);
          if (newText !== props.text) props.onChangeText(newText);
        }}
        syntax={props.syntax}
        bracket={props.bracketLinkProps}
        hashtag={props.hashtagProps}
        taggedLink={{ tags: props.taggedLinkPropsMap }}
        containerProps={{ className: EditorConstants.syntaxMenu.className }}
      />
      <div
        className={EditorConstants.editor.className}
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
            text={props.text}
            syntax={props.syntax}
            cursorCoordinate={state.cursorCoordinate}
            bracketLinkProps={props.bracketLinkProps}
            hashtagProps={props.hashtagProps}
            codeProps={props.codeProps}
            formulaProps={props.formulaProps}
            taggedLinkPropsMap={props.taggedLinkPropsMap}
          />
        </div>
      </div>
    </div>
  );
};
