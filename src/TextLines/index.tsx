import React from 'react';

import { KaTeX } from '../KaTeX';
import { mergeClassNames } from '../common/utils';
import { getHashtagName, splitTag, getTagName } from '../parser/utils';

import {
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
import { cursorOnNode } from './utils';

export const TextLines: React.FC<Props> = ({ nodes, cursorCoordinate, className, style, ...syntaxProps }) => (
  <div className={mergeClassNames(TextLinesConstants.className, className)} style={style}>
    {nodes.map((node, index) => (
      <Node key={index} node={node} cursorLineIndex={cursorCoordinate?.lineIndex} {...syntaxProps} />
    ))}
  </div>
);

const Node: React.FC<NodeProps> = ({ node, cursorLineIndex, ...syntaxProps }) => {
  switch (node.type) {
    case 'blockCode': {
      const { facingMeta, children, trailingMeta } = node;
      const [first, last] = node.range;

      return (
        <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
          <Node node={facingMeta} cursorLineIndex={cursorLineIndex} {...syntaxProps} />
          {children.map((child, index) => (
            <Node key={index} node={child} cursorLineIndex={cursorLineIndex} {...syntaxProps} />
          ))}
          {trailingMeta && <Node node={trailingMeta} cursorLineIndex={cursorLineIndex} {...syntaxProps} />}
        </LineGroup>
      );
    }
    case 'blockCodeMeta':
    case 'blockCodeLine': {
      const { lineIndex, indentDepth } = node;
      const code = node.type === 'blockCodeMeta' ? node.codeMeta : node.codeLine;
      const lineLength = indentDepth + code.length;
      const codeElementProps = syntaxProps.codeProps?.codeProps?.(code);
      const className = mergeClassNames(TextLinesConstants.code.className, codeElementProps?.className);

      return (
        <Line lineIndex={lineIndex}>
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
    }
    case 'blockFormula': {
      const { facingMeta, children, trailingMeta } = node;
      const [first, last] = node.range;
      const formula = children.map((child) => child.formulaLine).join('\n');
      const cursorOn = cursorOnNode(cursorLineIndex, node);
      const spanElementProps = syntaxProps.formulaProps?.spanProps?.(formula);
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
          <Node node={facingMeta} cursorLineIndex={cursorLineIndex} {...syntaxProps} />
          {children.map((child, index) => (
            <Node key={index} node={child} cursorLineIndex={cursorLineIndex} {...syntaxProps} />
          ))}
          {trailingMeta && <Node node={trailingMeta} cursorLineIndex={cursorLineIndex} {...syntaxProps} />}
        </LineGroup>
      );
    }
    case 'blockFormulaMeta':
    case 'blockFormulaLine': {
      const { lineIndex, indentDepth } = node;
      const formula = node.type === 'blockFormulaMeta' ? node.formulaMeta : node.formulaLine;
      const lineLength = indentDepth + formula.length;
      const spanElementProps = syntaxProps.formulaProps?.spanProps?.(formula);
      const className = mergeClassNames(TextLinesConstants.formula.className, spanElementProps?.className);

      return (
        <Line lineIndex={lineIndex}>
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
    }
    case 'quotation': {
      const { lineIndex, indentDepth, meta, contentLength, children } = node;
      const lineLength = indentDepth + meta.length + contentLength;
      const cursorOn = cursorOnNode(cursorLineIndex, node);

      return (
        <Line lineIndex={lineIndex}>
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
              <Node key={index} node={child} cursorLineIndex={cursorLineIndex} {...syntaxProps} />
            ))}
          </LineContent>
        </Line>
      );
    }
    case 'itemization': {
      const { lineIndex, indentDepth, bullet, contentLength, children } = node;
      const lineLength = indentDepth + bullet.length + contentLength;
      const cursorOn = cursorOnNode(cursorLineIndex, node);

      return (
        <Line lineIndex={lineIndex}>
          <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
          <ItemBullet lineIndex={lineIndex} indentDepth={indentDepth} bullet={bullet} />
          <LineContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength} itemized>
            <ItemBulletContent lineIndex={lineIndex} indentDepth={indentDepth} bullet={bullet} cursorOn={cursorOn} />
            {children.map((child, index) => (
              <Node key={index} node={child} cursorLineIndex={cursorLineIndex} {...syntaxProps} />
            ))}
          </LineContent>
        </Line>
      );
    }
    case 'normalLine': {
      const { lineIndex, contentLength, children } = node;

      return (
        <Line lineIndex={lineIndex}>
          <LineContent lineIndex={lineIndex} lineLength={contentLength}>
            {children.map((child, index) => (
              <Node key={index} node={child} cursorLineIndex={cursorLineIndex} {...syntaxProps} />
            ))}
          </LineContent>
        </Line>
      );
    }
    case 'inlineCode': {
      const { lineIndex, facingMeta, code, trailingMeta } = node;
      const [first, last] = node.range;
      const cursorOn = cursorOnNode(cursorLineIndex, node);
      const codeElementProps = syntaxProps.codeProps?.codeProps?.(code);
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
    }
    case 'displayFormula':
    case 'inlineFormula': {
      const { lineIndex, facingMeta, formula, trailingMeta } = node;
      const displayMode = node.type === 'displayFormula';
      const [first, last] = node.range;
      const cursorOn = cursorOnNode(cursorLineIndex, node);
      const spanElementProps = syntaxProps.formulaProps?.spanProps?.(formula);
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
    }
    case 'decoration': {
      const { lineIndex, facingMeta, decoration, trailingMeta, children } = node;
      const [first, last] = node.range;
      const cursorOn = cursorOnNode(cursorLineIndex, node);

      return (
        <span className={TextLinesConstants.decoration.className(decoration)}>
          {[...facingMeta].map((char, index) => (
            <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
              {cursorOn ? char : ''}
            </Char>
          ))}
          {children.map((child, index) => (
            <Node key={index} node={child} cursorLineIndex={cursorLineIndex} {...syntaxProps} />
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
    }
    case 'taggedLink': {
      const { lineIndex, linkName, trailingMeta } = node;
      const [facingMeta, tag] = splitTag(node.facingMeta);
      const [first, last] = node.range;
      const cursorOn = cursorOnNode(cursorLineIndex, node);
      const taggedLinkProps = syntaxProps.taggedLinkPropsMap?.[getTagName(node.facingMeta)];
      const anchorElementProps = taggedLinkProps?.anchorProps?.(linkName);

      return (
        <EmbededLink cursorOn={cursorOn} {...anchorElementProps}>
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
              {cursorOn || !taggedLinkProps?.tagHidden ? char : ''}
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
    }
    case 'bracketLink': {
      const { lineIndex, facingMeta, linkName, trailingMeta } = node;
      const [first, last] = node.range;
      const cursorOn = cursorOnNode(cursorLineIndex, node);
      const anchorElementProps = syntaxProps.bracketLinkProps?.anchorProps?.(linkName);

      return (
        <EmbededLink cursorOn={cursorOn} {...anchorElementProps}>
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
    }
    case 'hashtag': {
      const { lineIndex, facingMeta, linkName, trailingMeta } = node;
      const [first] = node.range;
      const cursorOn = cursorOnNode(cursorLineIndex, node);
      const anchorElementProps = syntaxProps.hashtagProps?.anchorProps?.(getHashtagName(linkName));

      return (
        <EmbededLink cursorOn={cursorOn} {...anchorElementProps}>
          {[...facingMeta, ...linkName, ...trailingMeta].map((char, index) => (
            <Char key={first + index} lineIndex={lineIndex} charIndex={first + index}>
              {char}
            </Char>
          ))}
        </EmbededLink>
      );
    }
    case 'normal': {
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
    }
  }
};
