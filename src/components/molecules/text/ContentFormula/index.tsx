import { ContentFormulaNode } from '../../../../parser/content/types';
import { Char } from '../../../atoms/text/Char';
import { CharGroup } from '../../../atoms/text/CharGroup';
import { KaTeX } from '../../../atoms/text/KaTeX';
import { Monospace } from '../../../atoms/text/Monospace';
import { TextNodeComponentProps } from '../common/types';

export type ContentFormulaProps = TextNodeComponentProps<ContentFormulaNode>;

export const ContentFormulaConstants = {
  styleId: (displayMode: boolean) => (displayMode ? 'display-formula' : 'inline-formula'),
};

export const ContentFormula: React.FC<ContentFormulaProps> = ({ node, getEditMode, formulaVisual }) => {
  const { lineIndex, facingMeta, formula, trailingMeta } = node;
  const displayMode = node.type === 'displayFormula';
  const [first, last] = node.range;
  const editMode = getEditMode(node);
  const codeElementProps = formulaVisual?.codeProps?.(formula);

  return (
    <CharGroup
      data-styleid={ContentFormulaConstants.styleId(displayMode)}
      firstCharIndex={first + facingMeta.length}
      lastCharIndex={last - trailingMeta.length}
      lineIndex={lineIndex}
    >
      {!editMode ? (
        <KaTeX options={{ throwOnError: false, displayMode }}>{formula}</KaTeX>
      ) : (
        <Monospace {...codeElementProps}>
          {[...facingMeta, ...formula, ...trailingMeta].map((char, index) => (
            <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
              {char}
            </Char>
          ))}
        </Monospace>
      )}
    </CharGroup>
  );
};
