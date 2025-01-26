import { EditorState } from '../../../../contexts/EditorStateContext';
import { LineNode } from '../../../../parser/line/lineNode';

export type SectionMenuItemType = 'normal' | 'larger' | 'largest';

export type SectionMenuSwitch = 'off' | 'normal' | 'larger' | 'largest' | 'disabled';

export function sectionMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: EditorState,
): SectionMenuSwitch {
  if (!state.cursorCoordinate) return 'disabled';

  const { cursorCoordinate, cursorSelection } = state;
  if (cursorSelection && cursorSelection.free.lineIndex !== cursorSelection.fixed.lineIndex) return 'disabled';

  const lineNode = nodes[cursorCoordinate.lineIndex];
  if (lineNode.type === 'heading') {
    const decorationNode = lineNode.children[0];
    return decorationNode.config.size;
  }
  if (lineNode.type === 'normalLine') {
    const decorationNodes = lineNode.children.filter((node) => node.type === 'decoration');
    return decorationNodes.length === 0 ? 'off' : 'disabled';
  }
  return 'disabled';
}
