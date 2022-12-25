import { ContentPosition, ContentPositionEndPoint } from '../hooks/contentPosition';
import { ContentNode } from 'src/parser/content/types';
import { PureLineNode } from 'src/parser/line/types';
import { CursorCoordinate } from 'src/types/cursor/cursorCoordinate';
import { CursorSelection } from 'src/types/selection/cursorSelection';

export function isEndPoint(contentPosition: ContentPosition): contentPosition is ContentPositionEndPoint {
  return ['empty', 'between', 'leftend', 'rightend'].includes(contentPosition.type);
}

export function getNestedContentNodeIfNonEndPoint(
  lineNode: PureLineNode,
  contentPosition: ContentPosition
): ContentNode | undefined {
  if (isEndPoint(contentPosition)) return undefined;
  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  if (contentPosition.type !== 'nested' || contentNode.type !== 'decoration') return contentNode;

  if (isEndPoint(contentPosition.childPosition)) return undefined;
  const childContentNode = contentNode.children[contentPosition.childPosition.contentIndexes[0]];
  return childContentNode;
}

export function getLineRange(
  cursorCoordinate: CursorCoordinate,
  cursorSelection: CursorSelection | undefined
): [number, number] {
  let [firstLineIndex, lastLineIndex] = [cursorCoordinate.lineIndex, cursorCoordinate.lineIndex];
  if (cursorSelection)
    [firstLineIndex, lastLineIndex] = [cursorSelection.fixed.lineIndex, cursorSelection.free.lineIndex];
  if (firstLineIndex > lastLineIndex) [firstLineIndex, lastLineIndex] = [lastLineIndex, firstLineIndex];
  return [firstLineIndex, lastLineIndex];
}
