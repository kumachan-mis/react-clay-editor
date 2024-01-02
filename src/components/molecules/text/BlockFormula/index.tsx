import { BlockFormulaNode } from '../../../../parser/blockFormula/types';
import { KaTeX } from '../../../atoms/text/KaTeX';
import { LineGroup } from '../../../atoms/text/LineGroup';
import { LineGroupContent } from '../../../atoms/text/LineGroupContent';
import { LineGroupIndent } from '../../../atoms/text/LineGroupIndent';
import { TextNodeComponentProps } from '../common/types';

import { BlockFormulaLine } from './BlockFormulaLine';
import { BlockFormulaMeta } from './BlockFormulaMeta';

export type BlockFormulaProps = TextNodeComponentProps<BlockFormulaNode>;

export const BlockFormulaConstants = {
  styleId: 'block-formula',
};

export const BlockFormula: React.FC<BlockFormulaProps> = ({ node, getEditMode, formulaVisual, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;
  const formula = children.map((child) => child.formulaLine).join('\n');
  const editMode = getEditMode(node);

  return !editMode && !/^\s*$/.test(formula) ? (
    <LineGroup
      data-styleid={BlockFormulaConstants.styleId}
      firstLineIndex={first + 1}
      lastLineIndex={trailingMeta ? last - 1 : last}
    >
      <LineGroupIndent indentDepth={facingMeta.indentDepth} />
      <LineGroupContent indentDepth={facingMeta.indentDepth}>
        <KaTeX options={{ throwOnError: false, displayMode: true }}>{formula}</KaTeX>
      </LineGroupContent>
    </LineGroup>
  ) : (
    <LineGroup
      data-styleid={BlockFormulaConstants.styleId}
      firstLineIndex={first + 1}
      lastLineIndex={trailingMeta ? last - 1 : last}
    >
      <BlockFormulaMeta formulaVisual={formulaVisual} getEditMode={getEditMode} node={facingMeta} {...rest} />
      {children.map((child, index) => (
        <BlockFormulaLine formulaVisual={formulaVisual} getEditMode={getEditMode} key={index} node={child} {...rest} />
      ))}
      {trailingMeta && (
        <BlockFormulaMeta formulaVisual={formulaVisual} getEditMode={getEditMode} node={trailingMeta} {...rest} />
      )}
    </LineGroup>
  );
};
