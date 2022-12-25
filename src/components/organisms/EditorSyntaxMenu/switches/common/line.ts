import { getLineRange } from '../../common/utils';
import { EditorState } from 'src/contexts/EditorStateContext';
import { LineNode } from 'src/parser/line/types';

export type LineMenuItemType = 'itemization' | 'quotation';

export type LineMenuSwitch = 'alloff' | 'allon' | 'both' | 'disabled';

export function lineMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: EditorState,
  menuItemType: LineMenuItemType
): LineMenuSwitch {
  if (!state.cursorCoordinate) return 'disabled';

  const { cursorCoordinate, cursorSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, cursorSelection);
  const rangeNodes = nodes.slice(firstLineIndex, lastLineIndex + 1);
  if (rangeNodes.some((node) => !['normalLine', menuItemType].includes(node.type))) return 'disabled';
  if (rangeNodes.every((node) => node.type === menuItemType)) return 'allon';
  if (rangeNodes.every((node) => node.type === 'normalLine')) return 'alloff';
  return 'both';
}
