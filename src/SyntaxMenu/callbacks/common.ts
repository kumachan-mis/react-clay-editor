import { CursorCoordinate } from '../../Cursor/types';
import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { TextSelection } from '../../Selection/types';
import { copySelection } from '../../Selection/utils';
import { parserConstants } from '../../parser/constants';
import { LineNode } from '../../parser/types';
import { ItemizationMenuProps, QuotationMenuProps } from '../types';

import { MenuHandler } from './types';
import { undefinedIfZeroSelection } from './utils';

export function lineMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State,
  menu: 'itemization' | 'quotation'
): 'off' | 'on' | 'disabled' {
  if (!state.cursorCoordinate) return 'disabled';

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);
  const rangeNodes = nodes.slice(firstLineIndex, lastLineIndex + 1);
  if (rangeNodes.some((node) => !['normalLine', menu].includes(node.type))) return 'disabled';
  if (rangeNodes.every((node) => node.type === menu)) return 'on';
  return 'off';
}

export function handleOnLineMenuClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<ItemizationMenuProps | QuotationMenuProps>,
  menuItem: 'button' | 'indent' | 'outdent',
  menuSwitch: 'off' | 'on' | 'disabled',
  menu: 'itemization' | 'quotation'
): [string, State] {
  const { cursorCoordinate, textSelection } = state;
  if (!cursorCoordinate || menuSwitch === 'disabled' || (menuItem === 'outdent' && menuSwitch === 'off')) {
    return [text, state];
  }

  const { meta, regex } = getLineMeta(props, menu);
  const lines = text.split('\n');
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);

  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];
  const insertedLines: string[] = [];

  function updateForButtonOff(): void {
    for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
      if (nodes[lineIndex].type !== 'normalLine') {
        insertedLines.push(lines[lineIndex]);
        continue;
      }

      insertedLines.push(meta + lines[lineIndex]);
      if (newCursorCoordinate.lineIndex === lineIndex) {
        newCursorCoordinate.charIndex += meta.length;
      }
      if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
        newTextSelection.fixed.charIndex += meta.length;
      }
      if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
        newTextSelection.free.charIndex += meta.length;
      }
    }
  }

  function updateForButtonOn(): void {
    for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
      const groups = lines[lineIndex].match(regex)?.groups as Record<string, string>;
      const moveCharIndexByMetaDeletion = (charIndex: number): number => {
        const newCharIndex = charIndex - groups.indent.length - meta.length;
        return newCharIndex >= 0 ? newCharIndex : 0;
      };
      insertedLines.push(groups.content);
      if (newCursorCoordinate.lineIndex === lineIndex) {
        newCursorCoordinate.charIndex = moveCharIndexByMetaDeletion(newCursorCoordinate.charIndex);
      }
      if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
        newTextSelection.fixed.charIndex = moveCharIndexByMetaDeletion(newTextSelection.fixed.charIndex);
      }
      if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
        newTextSelection.free.charIndex = moveCharIndexByMetaDeletion(newTextSelection.free.charIndex);
      }
    }
  }

  function updateForIndent(): void {
    for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
      const heading = nodes[lineIndex].type === 'normalLine' ? meta : ' ';
      insertedLines.push(heading + lines[lineIndex]);
      if (newCursorCoordinate.lineIndex === lineIndex) {
        newCursorCoordinate.charIndex += heading.length;
      }
      if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
        newTextSelection.fixed.charIndex += heading.length;
      }
      if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
        newTextSelection.free.charIndex += heading.length;
      }
    }
  }

  function updateForOutdent(): void {
    for (let lineIndex = firstLineIndex; lineIndex <= lastLineIndex; lineIndex++) {
      const groups = lines[lineIndex].match(regex)?.groups as Record<string, string>;
      const deletionLength = groups.indent.length === 0 ? meta.length : 1;
      const moveCharIndexByMetaDeletion = (charIndex: number): number => {
        const newCharIndex = charIndex - deletionLength;
        return newCharIndex >= 0 ? newCharIndex : 0;
      };
      insertedLines.push(lines[lineIndex].slice(deletionLength));
      if (newCursorCoordinate.lineIndex === lineIndex) {
        newCursorCoordinate.charIndex = moveCharIndexByMetaDeletion(newCursorCoordinate.charIndex);
      }
      if (newTextSelection && newTextSelection.fixed.lineIndex === lineIndex) {
        newTextSelection.fixed.charIndex = moveCharIndexByMetaDeletion(newTextSelection.fixed.charIndex);
      }
      if (newTextSelection && newTextSelection.free.lineIndex === lineIndex) {
        newTextSelection.free.charIndex = moveCharIndexByMetaDeletion(newTextSelection.free.charIndex);
      }
    }
  }

  switch (menuItem) {
    case 'button':
      if (menuSwitch === 'off') {
        updateForButtonOff();
      } else {
        updateForButtonOn();
      }
      break;
    case 'indent':
      updateForIndent();
      break;
    case 'outdent':
      updateForOutdent();
      break;
  }

  const rangeSelection = {
    fixed: { lineIndex: firstLineIndex, charIndex: 0 },
    free: { lineIndex: lastLineIndex, charIndex: lines[lastLineIndex].length },
  };
  const [newText, newState] = insertText(text, { ...state, textSelection: rangeSelection }, insertedLines.join('\n'));
  return [
    newText,
    { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
  ];
}

function getLineMeta(
  props: MenuHandler<ItemizationMenuProps | QuotationMenuProps>,
  menu: 'itemization' | 'quotation'
): { meta: string; regex: RegExp } {
  if (menu === 'quotation') return { meta: '> ', regex: parserConstants.common.quotation };

  if (!props.syntax || props.syntax === 'bracket') {
    // bracket syntax
    return { meta: ' ', regex: parserConstants.bracketSyntax.itemization };
  } else {
    // markdown syntax
    return { meta: '- ', regex: parserConstants.markdownSyntax.itemization };
  }
}

function getLineRange(cursorCoordinate: CursorCoordinate, textSelection: TextSelection | undefined): [number, number] {
  let [firstLineIndex, lastLineIndex] = [cursorCoordinate.lineIndex, cursorCoordinate.lineIndex];
  if (textSelection) [firstLineIndex, lastLineIndex] = [textSelection.fixed.lineIndex, textSelection.free.lineIndex];
  if (firstLineIndex > lastLineIndex) [firstLineIndex, lastLineIndex] = [lastLineIndex, firstLineIndex];
  return [firstLineIndex, lastLineIndex];
}
