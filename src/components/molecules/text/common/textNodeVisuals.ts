import { BracketLinkVisual } from '../../../../types/visual/bracketLink';
import { CodeVisual } from '../../../../types/visual/code';
import { FormulaVisual } from '../../../../types/visual/formula';
import { HashtagVisual } from '../../../../types/visual/hashtag';
import { TaggedLinkVisual } from '../../../../types/visual/taggedLink';

export type TextNodeVisuals = {
  readonly bracketLinkVisual?: BracketLinkVisual;
  readonly hashtagVisual?: HashtagVisual;
  readonly taggedLinkVisualMap?: Record<string, TaggedLinkVisual>;
  readonly codeVisual?: CodeVisual;
  readonly formulaVisual?: FormulaVisual;
};

export function textNodeVisualsEquals(prev: TextNodeVisuals, next: TextNodeVisuals): boolean {
  return (
    prev.bracketLinkVisual === next.bracketLinkVisual &&
    prev.hashtagVisual === next.hashtagVisual &&
    prev.taggedLinkVisualMap === next.taggedLinkVisualMap &&
    prev.codeVisual === next.codeVisual &&
    prev.formulaVisual === next.formulaVisual
  );
}
