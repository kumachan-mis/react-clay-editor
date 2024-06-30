import { EditorState } from '../../../../../contexts/EditorStateContext';
import { LineNode } from '../../../../../parser/line/lineNode';
import { getLineRange } from '../../common/utils';

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
