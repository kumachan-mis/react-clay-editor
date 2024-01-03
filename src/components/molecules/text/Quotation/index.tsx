import { QuotationNode } from '../../../../parser/quotation/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { QuotationLineContent } from '../../../atoms/text/QuotationLineContent';
import { TextNodeComponentProps } from '../common/types';

export type QuotationProps = {
  readonly ChildComponent: React.FC<TextNodeComponentProps>;
} & TextNodeComponentProps<QuotationNode>;

export const QuotationConstants = {
  styleId: 'quotation',
};

export const Quotation: React.FC<QuotationProps> = ({ node, getEditMode, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, indentDepth, meta, contentLength, children } = node;
  const lineLength = indentDepth + meta.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const editMode = getEditMode(node);

  return (
    <Line lineIndex={lineIndex} {...lineProps} data-styleid={QuotationConstants.styleId}>
      <LineIndent indentDepth={indentDepth} lineIndex={lineIndex} />
      <QuotationLineContent indentDepth={indentDepth} lineIndex={lineIndex} lineLength={lineLength}>
        {[...meta].map((char, index) => (
          <Char charIndex={indentDepth + index} key={indentDepth + index} lineIndex={lineIndex}>
            {editMode ? char : ''}
          </Char>
        ))}
        {children.map((child, index) => (
          <ChildComponent getEditMode={getEditMode} key={index} node={child} textVisual={textVisual} {...rest} />
        ))}
      </QuotationLineContent>
    </Line>
  );
};
