import { LineNode } from '../../../../parser/line/lineNode';
import { isPureLineNode } from '../../../../parser/line/pureLineNode';
import { isEndPoint } from '../common/utils';
import { ContentPosition } from '../hooks/contentPosition';

export type DecorationMenuItemType = 'bold' | 'italic' | 'underline';

export type DecorationMenuSwitchItem = 'on' | 'off' | 'disabled';

export type DecorationMenuSwitch = Record<DecorationMenuItemType, DecorationMenuSwitchItem>;

export function decorationMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
): DecorationMenuSwitch {
  if (!contentPosition) return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };

  if (!syntax || syntax === 'bracket') {
    // Bracket syntax
    return bracketDecorationMenuSwitch(nodes, contentPosition);
  } else {
    // Markdown syntax
    return markdownDecorationMenuSwitch(nodes, contentPosition);
  }
}

function bracketDecorationMenuSwitch(nodes: LineNode[], contentPosition: ContentPosition): DecorationMenuSwitch {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };
  if (isEndPoint(contentPosition)) return { bold: 'off', italic: 'off', underline: 'off' };

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  switch (contentNode.type) {
    case 'decoration': {
      const { bold, italic, underline } = contentNode.config;
      return { bold: bold ? 'on' : 'off', italic: italic ? 'on' : 'off', underline: underline ? 'on' : 'off' };
    }
    case 'normal':
      return { bold: 'off', italic: 'off', underline: 'off' };
    default:
      return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };
  }
}

function markdownDecorationMenuSwitch(
  nodes: LineNode[],
  contentPosition: ContentPosition,
): DecorationMenuSwitch & { underline: 'disabled' } {
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };
  if (isEndPoint(contentPosition)) return { bold: 'off', italic: 'off', underline: 'disabled' };

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  switch (contentNode.type) {
    case 'decoration': {
      const { bold, italic } = contentNode.config;
      return { bold: bold ? 'on' : 'off', italic: italic ? 'on' : 'off', underline: 'disabled' };
    }
    case 'normal':
      return { bold: 'off', italic: 'off', underline: 'disabled' };
    default:
      return { bold: 'disabled', italic: 'disabled', underline: 'disabled' };
  }
}
