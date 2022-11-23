import { DecorationNode } from '../../../../parser/decoration/types';
import { LineNode } from '../../../../parser/line/types';
import { EditorState } from '../../Editor/types';

export type SectionMenuItemType = 'normal' | 'larger' | 'largest';

export type SectionMenuSwitch = 'off' | 'normal' | 'larger' | 'largest' | 'disabled';

export function sectionMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: EditorState
): SectionMenuSwitch {
  if (!state.cursorCoordinate) return 'disabled';

  const { cursorCoordinate, cursorSelection: cursorSelection } = state;
  if (cursorSelection && cursorSelection.free.lineIndex !== cursorSelection.fixed.lineIndex) return 'disabled';

  const lineNode = nodes[cursorCoordinate.lineIndex];
  if (lineNode.type !== 'normalLine') return 'disabled';

  const decorationNodes = lineNode.children.filter((node) => node.type === 'decoration') as DecorationNode[];
  if (decorationNodes.length > 1 || (decorationNodes.length === 1 && lineNode.children.length !== 1)) return 'disabled';

  if (decorationNodes.length === 0) return 'off';

  const decorationNode = decorationNodes[0];
  if ((!syntax || syntax === 'bracket') && !/^\[\*+ $/.test(decorationNode.facingMeta)) return 'disabled';
  else if (syntax === 'markdown' && !/^#+ $/.test(decorationNode.facingMeta)) return 'disabled';

  return decorationNode.decoration.size;
}
