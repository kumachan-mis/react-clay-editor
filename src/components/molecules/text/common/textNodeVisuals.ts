import { BracketLinkVisual } from '../../../../types/visual/bracketLink';
import { CodeVisual } from '../../../../types/visual/code';
import { FormulaVisual } from '../../../../types/visual/formula';
import { HashtagVisual } from '../../../../types/visual/hashtag';
import { TaggedLinkVisual } from '../../../../types/visual/taggedLink';
import { TextVisual } from '../../../../types/visual/text';

export type TextNodeVisuals = {
  readonly textVisual?: TextVisual;
  readonly bracketLinkVisual?: BracketLinkVisual;
  readonly hashtagVisual?: HashtagVisual;
  readonly taggedLinkVisualMap?: Record<string, TaggedLinkVisual>;
  readonly codeVisual?: CodeVisual;
  readonly formulaVisual?: FormulaVisual;
};

export function textNodeVisualsEquals(prev: TextNodeVisuals, next: TextNodeVisuals): boolean {
  return (
    prev.textVisual === next.textVisual &&
    prev.bracketLinkVisual === next.bracketLinkVisual &&
    prev.hashtagVisual === next.hashtagVisual &&
    prev.taggedLinkVisualMap === next.taggedLinkVisualMap &&
    prev.codeVisual === next.codeVisual &&
    prev.formulaVisual === next.formulaVisual
  );
}
