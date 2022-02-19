import React from 'react';

import { KaTeX } from '../KaTeX';
import { mergeClassNames } from '../common/utils';
import {
  BlockCodeLineNode,
  BlockCodeMetaNode,
  BlockCodeNode,
  BlockFormulaLineNode,
  BlockFormulaMetaNode,
  BlockFormulaNode,
  BracketLinkNode,
  ContentFormulaNode,
  DecorationNode,
  HashtagNode,
  InlineCodeNode,
  ItemizationNode,
  NormalLineNode,
  NormalNode,
  QuotationNode,
  TaggedLinkNode,
} from '../parser/types';
import { getHashtagName, splitTag, getTagName } from '../parser/utils';

import {
  Header,
  LineGroup,
  LineGroupIndent,
  LineGroupContent,
  Line,
  LineIndent,
  LineContent,
  CharGroup,
  Char,
  ItemBullet,
  ItemBulletContent,
  EmbededLink,
} from './components';
import { TextLinesConstants } from './constants';
import { Props, NodeProps } from './types';
import { cursorOnNode, useLinkForceActive } from './utils';

export const TextLines: React.FC<Props> = ({
  nodes,
  cursorCoordinate,
  textSelection,
  className,
  style,
  ...visuals
}) => {
  const linkForceActive = useLinkForceActive();

  return (
    <div className={mergeClassNames(TextLinesConstants.className, className)} style={style}>
      {visuals.textVisual?.header && (
        <Header size={visuals.textVisual?.headerSize}>{visuals.textVisual?.header}</Header>
      )}
      {nodes.map((node, index) => (
        <Node
          key={index}
          node={node}
          cursorCoordinate={cursorCoordinate}
          textSelection={textSelection}
          linkForceActive={linkForceActive}
          {...visuals}
        />
      ))}
    </div>
  );
};

const Node: React.FC<NodeProps> = ({ node, ...rest }) => {
  switch (node.type) {
    case 'blockCode':
      return <BlockCode node={node} {...rest} />;
    case 'blockCodeMeta':
    case 'blockCodeLine':
      return <BlockCodeLineAndMeta node={node} {...rest} />;

    case 'blockFormula':
      return <BlockFormula node={node} {...rest} />;
    case 'blockFormulaMeta':
    case 'blockFormulaLine':
      return <BlockFormulaLineAndMeta node={node} {...rest} />;

    case 'quotation':
      return <Quotation node={node} {...rest} />;
    case 'itemization':
      return <Itemization node={node} {...rest} />;
    case 'normalLine':
      return <NormalLine node={node} {...rest} />;

    case 'inlineCode':
      return <InlineCode node={node} {...rest} />;

    case 'displayFormula':
    case 'inlineFormula':
      return <ContentFormula node={node} {...rest} />;

    case 'decoration':
      return <Decoration node={node} {...rest} />;

    case 'taggedLink':
      return <TaggedLink node={node} {...rest} />;
    case 'bracketLink':
      return <BracketLink node={node} {...rest} />;
    case 'hashtag':
      return <Hashtag node={node} {...rest} />;

    case 'normal':
      return <Normal node={node} {...rest} />;
  }
};

const BlockCode: React.FC<NodeProps<BlockCodeNode>> = ({ node, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;

  return (
    <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
      <Node node={facingMeta} {...rest} />
      {children.map((child, index) => (
        <Node key={index} node={child} {...rest} />
      ))}
      {trailingMeta && <Node node={trailingMeta} {...rest} />}
    </LineGroup>
  );
};

const BlockCodeLineAndMeta: React.FC<NodeProps<BlockCodeLineNode | BlockCodeMetaNode>> = ({
  node,
  textVisual,
  codeVisual,
}) => {
  const { lineIndex, indentDepth } = node;
  const code = node.type === 'blockCodeMeta' ? node.codeMeta : node.codeLine;
  const lineLength = indentDepth + code.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = codeVisual?.codeProps?.(code);
  const className = mergeClassNames(TextLinesConstants.code.className, codeElementProps?.className);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <LineContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength} className={className}>
        <code {...codeElementProps} className={className}>
          {[...code].map((char, index) => (
            <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
              {char}
            </Char>
          ))}
        </code>
      </LineContent>
    </Line>
  );
};

const BlockFormula: React.FC<NodeProps<BlockFormulaNode>> = ({
  node,
  cursorCoordinate,
  textSelection,
  formulaVisual,
  ...rest
}) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;
  const formula = children.map((child) => child.formulaLine).join('\n');
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);
  const spanElementProps = formulaVisual?.spanProps?.(formula);
  const className = mergeClassNames(TextLinesConstants.formula.className, spanElementProps?.className);

  return !cursorOn && !/^\s*$/.test(formula) ? (
    <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
      <LineGroupIndent indentDepth={facingMeta.indentDepth} />
      <LineGroupContent indentDepth={facingMeta.indentDepth} {...spanElementProps} className={className}>
        <KaTeX options={{ throwOnError: false, displayMode: true }}>{formula}</KaTeX>
      </LineGroupContent>
    </LineGroup>
  ) : (
    <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
      <Node
        node={facingMeta}
        cursorCoordinate={cursorCoordinate}
        textSelection={textSelection}
        formulaVisual={formulaVisual}
        {...rest}
      />
      {children.map((child, index) => (
        <Node
          key={index}
          node={child}
          cursorCoordinate={cursorCoordinate}
          textSelection={textSelection}
          formulaVisual={formulaVisual}
          {...rest}
        />
      ))}
      {trailingMeta && (
        <Node
          node={trailingMeta}
          cursorCoordinate={cursorCoordinate}
          textSelection={textSelection}
          formulaVisual={formulaVisual}
          {...rest}
        />
      )}
    </LineGroup>
  );
};

const BlockFormulaLineAndMeta: React.FC<NodeProps<BlockFormulaLineNode | BlockFormulaMetaNode>> = ({
  node,
  textVisual,
  formulaVisual,
}) => {
  const { lineIndex, indentDepth } = node;
  const formula = node.type === 'blockFormulaMeta' ? node.formulaMeta : node.formulaLine;
  const lineLength = indentDepth + formula.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const spanElementProps = formulaVisual?.spanProps?.(formula);
  const className = mergeClassNames(TextLinesConstants.formula.className, spanElementProps?.className);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <LineContent
        lineIndex={lineIndex}
        indentDepth={indentDepth}
        lineLength={lineLength}
        {...spanElementProps}
        className={className}
      >
        {[...formula].map((char, index) => (
          <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
            {char}
          </Char>
        ))}
      </LineContent>
    </Line>
  );
};

const Quotation: React.FC<NodeProps<QuotationNode>> = ({
  node,
  cursorCoordinate,
  textSelection,
  textVisual,
  ...rest
}) => {
  const { lineIndex, indentDepth, meta, contentLength, children } = node;
  const lineLength = indentDepth + meta.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <LineContent
        lineIndex={lineIndex}
        indentDepth={indentDepth}
        lineLength={lineLength}
        className={TextLinesConstants.quotation.className}
      >
        {[...meta].map((char, index) => (
          <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
            {cursorOn ? char : ''}
          </Char>
        ))}
        {children.map((child, index) => (
          <Node
            key={index}
            node={child}
            cursorCoordinate={cursorCoordinate}
            textSelection={textSelection}
            textVisual={textVisual}
            {...rest}
          />
        ))}
      </LineContent>
    </Line>
  );
};

const Itemization: React.FC<NodeProps<ItemizationNode>> = ({
  node,
  cursorCoordinate,
  textSelection,
  textVisual,
  ...rest
}) => {
  const { lineIndex, indentDepth, bullet, contentLength, children } = node;
  const lineLength = indentDepth + bullet.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <ItemBullet lineIndex={lineIndex} indentDepth={indentDepth} bullet={bullet} />
      <LineContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength} itemized>
        <ItemBulletContent lineIndex={lineIndex} indentDepth={indentDepth} bullet={bullet} cursorOn={cursorOn} />
        {children.map((child, index) => (
          <Node
            key={index}
            node={child}
            cursorCoordinate={cursorCoordinate}
            textSelection={textSelection}
            textVisual={textVisual}
            {...rest}
          />
        ))}
      </LineContent>
    </Line>
  );
};

const NormalLine: React.FC<NodeProps<NormalLineNode>> = ({
  node,
  cursorCoordinate,
  textSelection,
  textVisual,
  ...rest
}) => {
  const { lineIndex, contentLength, children } = node;
  const lineProps = textVisual?.lineProps?.(lineIndex);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineContent lineIndex={lineIndex} lineLength={contentLength}>
        {children.map((child, index) => (
          <Node
            key={index}
            node={child}
            cursorCoordinate={cursorCoordinate}
            textSelection={textSelection}
            textVisual={textVisual}
            {...rest}
          />
        ))}
      </LineContent>
    </Line>
  );
};

const InlineCode: React.FC<NodeProps<InlineCodeNode>> = ({ node, cursorCoordinate, textSelection, codeVisual }) => {
  const { lineIndex, facingMeta, code, trailingMeta } = node;
  const [first, last] = node.range;
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);
  const codeElementProps = codeVisual?.codeProps?.(code);
  const className = mergeClassNames(TextLinesConstants.code.className, codeElementProps?.className);

  return (
    <code {...codeElementProps} className={className}>
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {cursorOn ? char : ''}
        </Char>
      ))}
      {[...code].map((char, index) => (
        <Char
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + index}
        >
          {char}
        </Char>
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
          charIndex={last - (trailingMeta.length - 1) + index}
        >
          {cursorOn ? char : ''}
        </Char>
      ))}
    </code>
  );
};

const ContentFormula: React.FC<NodeProps<ContentFormulaNode>> = ({
  node,
  cursorCoordinate,
  textSelection,
  formulaVisual,
}) => {
  const { lineIndex, facingMeta, formula, trailingMeta } = node;
  const displayMode = node.type === 'displayFormula';
  const [first, last] = node.range;
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);
  const spanElementProps = formulaVisual?.spanProps?.(formula);
  const className = mergeClassNames(TextLinesConstants.formula.className, spanElementProps?.className);

  return (
    <CharGroup
      lineIndex={lineIndex}
      firstCharIndex={first + facingMeta.length}
      lastCharIndex={last - trailingMeta.length}
      {...spanElementProps}
      className={className}
    >
      {!cursorOn ? (
        <KaTeX options={{ throwOnError: false, displayMode }}>{formula}</KaTeX>
      ) : (
        [...facingMeta, ...formula, ...trailingMeta].map((char, index) => (
          <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
            {char}
          </Char>
        ))
      )}
    </CharGroup>
  );
};

const Decoration: React.FC<NodeProps<DecorationNode>> = ({ node, cursorCoordinate, textSelection, ...rest }) => {
  const { lineIndex, facingMeta, decoration, trailingMeta, children } = node;
  const [first, last] = node.range;
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);

  return (
    <span className={TextLinesConstants.decoration.className(decoration)}>
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {cursorOn ? char : ''}
        </Char>
      ))}
      {children.map((child, index) => (
        <Node key={index} node={child} cursorCoordinate={cursorCoordinate} textSelection={textSelection} {...rest} />
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
          charIndex={last - (trailingMeta.length - 1) + index}
        >
          {cursorOn ? char : ''}
        </Char>
      ))}
    </span>
  );
};

const TaggedLink: React.FC<NodeProps<TaggedLinkNode>> = ({
  node,
  cursorCoordinate,
  textSelection,
  linkForceActive,
  taggedLinkVisualMap,
}) => {
  const { lineIndex, linkName, trailingMeta } = node;
  const [facingMeta, tag] = splitTag(node.facingMeta);
  const [first, last] = node.range;
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);
  const taggedLinkVisual = taggedLinkVisualMap?.[getTagName(node.facingMeta)];

  return (
    <EmbededLink
      cursorOn={cursorOn}
      forceActive={linkForceActive}
      anchorProps={(active) => taggedLinkVisual?.anchorProps?.(linkName, active)}
    >
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {cursorOn ? char : ''}
        </Char>
      ))}
      {[...tag].map((char, index) => (
        <Char
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + index}
        >
          {cursorOn || !taggedLinkVisual?.tagHidden ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
        <Char
          key={first + facingMeta.length + tag.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + tag.length + index}
        >
          {char}
        </Char>
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
          charIndex={last - (trailingMeta.length - 1) + index}
        >
          {cursorOn ? char : ''}
        </Char>
      ))}
    </EmbededLink>
  );
};

const BracketLink: React.FC<NodeProps<BracketLinkNode>> = ({
  node,
  cursorCoordinate,
  textSelection,
  linkForceActive,
  bracketLinkVisual,
}) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first, last] = node.range;
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);

  return (
    <EmbededLink
      cursorOn={cursorOn}
      forceActive={linkForceActive}
      anchorProps={(active) => bracketLinkVisual?.anchorProps?.(linkName, active)}
    >
      {[...facingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {cursorOn ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
        <Char
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
          charIndex={first + facingMeta.length + index}
        >
          {char}
        </Char>
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
          charIndex={last - (trailingMeta.length - 1) + index}
        >
          {cursorOn ? char : ''}
        </Char>
      ))}
    </EmbededLink>
  );
};

const Hashtag: React.FC<NodeProps<HashtagNode>> = ({
  node,
  cursorCoordinate,
  textSelection,
  linkForceActive,
  hashtagVisual,
}) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first] = node.range;
  const cursorOn = cursorOnNode(node, cursorCoordinate, textSelection);

  return (
    <EmbededLink
      cursorOn={cursorOn}
      forceActive={linkForceActive}
      anchorProps={(active) => hashtagVisual?.anchorProps?.(getHashtagName(linkName), active)}
    >
      {[...facingMeta, ...linkName, ...trailingMeta].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};

const Normal: React.FC<NodeProps<NormalNode>> = ({ node }) => {
  const { lineIndex, text } = node;
  const [first] = node.range;

  return (
    <span>
      {[...text].map((char, index) => (
        <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
          {char}
        </Char>
      ))}
    </span>
  );
};
