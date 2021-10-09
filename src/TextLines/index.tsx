import * as React from 'react';

import { Props, NodeProps } from './types';
import { TextLinesConstants } from './constants';
import { mergeClassNames } from './utils';
import {
  LineGroup,
  LineGroupIndent,
  LineGroupContent,
  Line,
  LineIndent,
  LineContent,
  CharGroup,
  Char,
} from './components';
import { parseText, getHashTagName, getTagName } from './parser';
import { ParsingOptions } from './parser/types';
import { KaTeX } from '../KaTeX';

export const TextLines: React.FC<Props> = ({
  text,
  syntax = 'bracket',
  cursorCoordinate,
  bracketLinkProps = {},
  hashTagProps = {},
  taggedLinkPropsMap = {},
  codeProps = {},
  formulaProps = {},
  style,
}) => {
  const options: ParsingOptions = {
    taggedLinkRegexes: Object.entries(taggedLinkPropsMap).map(([tagName, linkProps]) =>
      TextLinesConstants.regexes.common.taggedLink(tagName, linkProps.linkNameRegex)
    ),
    disabledMap: {
      bracketLink: bracketLinkProps.disabled,
      hashTag: hashTagProps.disabled,
      code: codeProps.disabled,
      formula: formulaProps.disabled,
    },
    syntax,
  };
  const nodes = parseText(text, options);

  return (
    <div className={TextLinesConstants.className} style={style}>
      {nodes.map((node, index) => (
        <Node
          key={index}
          node={node}
          bracketLinkProps={bracketLinkProps}
          hashTagProps={hashTagProps}
          taggedLinkPropsMap={taggedLinkPropsMap}
          codeProps={codeProps}
          formulaProps={formulaProps}
          curcorLineIndex={cursorCoordinate?.lineIndex}
        />
      ))}
    </div>
  );
};

const Node: React.FC<NodeProps> = ({
  node,
  bracketLinkProps,
  hashTagProps,
  taggedLinkPropsMap,
  codeProps,
  formulaProps,
  curcorLineIndex,
}) => {
  switch (node.type) {
    case 'blockCode': {
      const { facingMeta, children, trailingMeta } = node;
      return (
        <>
          <Node
            node={facingMeta}
            bracketLinkProps={bracketLinkProps}
            hashTagProps={hashTagProps}
            taggedLinkPropsMap={taggedLinkPropsMap}
            codeProps={codeProps}
            formulaProps={formulaProps}
            curcorLineIndex={curcorLineIndex}
          />
          {children.map((child, index) => (
            <Node
              key={index}
              node={child}
              bracketLinkProps={bracketLinkProps}
              hashTagProps={hashTagProps}
              taggedLinkPropsMap={taggedLinkPropsMap}
              codeProps={codeProps}
              formulaProps={formulaProps}
              curcorLineIndex={curcorLineIndex}
            />
          ))}
          {trailingMeta && (
            <Node
              node={trailingMeta}
              bracketLinkProps={bracketLinkProps}
              hashTagProps={hashTagProps}
              taggedLinkPropsMap={taggedLinkPropsMap}
              codeProps={codeProps}
              formulaProps={formulaProps}
              curcorLineIndex={curcorLineIndex}
            />
          )}
        </>
      );
    }
    case 'blockCodeMeta':
    case 'blockCodeLine': {
      const { lineIndex, indentDepth } = node;
      const code = node.type == 'blockCodeMeta' ? node.codeMeta : node.codeLine;
      const codeElementProps = codeProps.codeProps?.(code);
      const className = mergeClassNames(TextLinesConstants.code.className, codeElementProps?.className);

      return (
        <Line lineIndex={lineIndex}>
          <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
          <LineContent
            lineIndex={lineIndex}
            indentDepth={indentDepth}
            contentLength={code.length}
            spanProps={{ className }}
          >
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
      const [from, to] = node.range;
      const formula = children.map((child) => child.formulaLine).join('\n');
      const cursorOn = curcorLineIndex !== undefined && from <= curcorLineIndex && curcorLineIndex <= to;
      const spanElementProps = formulaProps.spanProps?.(formula);
      const className = mergeClassNames(TextLinesConstants.formula.className, spanElementProps?.className);

      return !cursorOn && !/^\s*$/.test(formula) ? (
        <LineGroup
          fromLineIndex={from + 1}
          toLineIndex={trailingMeta ? to - 1 : to}
          divProps={{ onMouseDown: (event) => event.nativeEvent.stopImmediatePropagation() }}
        >
          <LineGroupIndent indentDepth={facingMeta.indentDepth} />
          <LineGroupContent indentDepth={facingMeta.indentDepth} spanProps={{ className }}>
            <KaTeX options={{ throwOnError: false, displayMode: true }}>{formula}</KaTeX>
          </LineGroupContent>
        </LineGroup>
      ) : (
        <>
          <Node
            node={facingMeta}
            bracketLinkProps={bracketLinkProps}
            hashTagProps={hashTagProps}
            taggedLinkPropsMap={taggedLinkPropsMap}
            codeProps={codeProps}
            formulaProps={formulaProps}
            curcorLineIndex={curcorLineIndex}
          />
          {children.map((child, index) => (
            <Node
              key={index}
              node={child}
              bracketLinkProps={bracketLinkProps}
              hashTagProps={hashTagProps}
              taggedLinkPropsMap={taggedLinkPropsMap}
              codeProps={codeProps}
              formulaProps={formulaProps}
              curcorLineIndex={curcorLineIndex}
            />
          ))}
          {trailingMeta && (
            <Node
              node={trailingMeta}
              bracketLinkProps={bracketLinkProps}
              hashTagProps={hashTagProps}
              taggedLinkPropsMap={taggedLinkPropsMap}
              codeProps={codeProps}
              formulaProps={formulaProps}
              curcorLineIndex={curcorLineIndex}
            />
          )}
        </>
      );
    }
    case 'blockFormulaMeta':
    case 'blockFormulaLine': {
      const { lineIndex, indentDepth } = node;
      const formula = node.type == 'blockFormulaMeta' ? node.formulaMeta : node.formulaLine;
      const spanElementProps = formulaProps.spanProps?.(formula);
      const className = mergeClassNames(TextLinesConstants.formula.className, spanElementProps?.className);

      return (
        <Line lineIndex={lineIndex}>
          <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
          <LineContent
            lineIndex={lineIndex}
            indentDepth={indentDepth}
            contentLength={formula.length}
            spanProps={{ className }}
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
      const { lineIndex, indentDepth, contentLength, meta, children } = node;
      const cursorOn = curcorLineIndex == lineIndex;

      return (
        <Line lineIndex={lineIndex}>
          <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
          <LineContent
            lineIndex={lineIndex}
            indentDepth={indentDepth}
            contentLength={meta.length + contentLength}
            spanProps={{ className: TextLinesConstants.quotation.className }}
          >
            {[...meta].map((char, index) => (
              <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
                {cursorOn ? char : '\u200b'}
              </Char>
            ))}
            {children.map((child, index) => (
              <Node
                key={index}
                node={child}
                bracketLinkProps={bracketLinkProps}
                hashTagProps={hashTagProps}
                taggedLinkPropsMap={taggedLinkPropsMap}
                codeProps={codeProps}
                formulaProps={formulaProps}
                curcorLineIndex={curcorLineIndex}
              />
            ))}
          </LineContent>
        </Line>
      );
    }
    case 'itemization': {
      const { lineIndex, indentDepth, contentLength, children } = node;

      return (
        <Line lineIndex={lineIndex}>
          <LineIndent lineIndex={lineIndex} indentDepth={indentDepth + 1}>
            <span className={TextLinesConstants.itemization.bullet.className} />
          </LineIndent>
          <LineContent lineIndex={lineIndex} indentDepth={indentDepth + 1} contentLength={contentLength}>
            {children.map((child, index) => (
              <Node
                key={index}
                node={child}
                bracketLinkProps={bracketLinkProps}
                hashTagProps={hashTagProps}
                taggedLinkPropsMap={taggedLinkPropsMap}
                codeProps={codeProps}
                formulaProps={formulaProps}
                curcorLineIndex={curcorLineIndex}
              />
            ))}
          </LineContent>
        </Line>
      );
    }
    case 'normalLine': {
      const { lineIndex, contentLength, children } = node;

      return (
        <Line lineIndex={lineIndex}>
          <LineContent lineIndex={lineIndex} indentDepth={0} contentLength={contentLength}>
            {children.map((child, index) => (
              <Node
                key={index}
                node={child}
                bracketLinkProps={bracketLinkProps}
                hashTagProps={hashTagProps}
                taggedLinkPropsMap={taggedLinkPropsMap}
                codeProps={codeProps}
                formulaProps={formulaProps}
                curcorLineIndex={curcorLineIndex}
              />
            ))}
          </LineContent>
        </Line>
      );
    }
    case 'inlineCode': {
      const { lineIndex, facingMeta, code, trailingMeta } = node;
      const [from, to] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;
      const codeElementProps = codeProps.codeProps?.(code);
      const className = mergeClassNames(TextLinesConstants.code.className, codeElementProps?.className);

      return (
        <code {...codeElementProps} className={className}>
          {[...facingMeta].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
          {[...code].map((char, index) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + index}
            >
              {char}
            </Char>
          ))}
          {[...trailingMeta].map((char, index) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
            >
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
        </code>
      );
    }
    case 'displayFormula':
    case 'inlineFormula': {
      const { lineIndex, facingMeta, formula, trailingMeta } = node;
      const displayMode = node.type == 'displayFormula';
      const [from, to] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;
      const spanElementProps = formulaProps.spanProps?.(formula);
      const className = mergeClassNames(TextLinesConstants.formula.className, spanElementProps?.className);

      return !cursorOn ? (
        <CharGroup
          lineIndex={lineIndex}
          fromCharIndex={from + facingMeta.length}
          toCharIndex={to - trailingMeta.length}
          spanProps={{ className, onMouseDown: (event) => event.nativeEvent.stopImmediatePropagation() }}
        >
          <KaTeX options={{ throwOnError: false, displayMode }}>{formula}</KaTeX>
        </CharGroup>
      ) : (
        <span style={spanElementProps?.style}>
          {[...facingMeta, ...formula, ...trailingMeta].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {char}
            </Char>
          ))}
        </span>
      );
    }
    case 'text': {
      const { lineIndex, facingMeta, decoration, trailingMeta, children } = node;
      const [from, to] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;

      return (
        <span className={TextLinesConstants.decoration.className(decoration)}>
          {[...facingMeta].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
          {children.map((child, index) => (
            <Node
              key={index}
              node={child}
              bracketLinkProps={bracketLinkProps}
              hashTagProps={hashTagProps}
              taggedLinkPropsMap={taggedLinkPropsMap}
              codeProps={codeProps}
              formulaProps={formulaProps}
              curcorLineIndex={curcorLineIndex}
            />
          ))}
          {[...trailingMeta].map((char, index) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
            >
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
        </span>
      );
    }
    case 'taggedLink': {
      const { lineIndex, facingMeta, tag, linkName, trailingMeta } = node;
      const [from, to] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;
      const taggedLinkProps = taggedLinkPropsMap[getTagName(tag)];
      const anchorElementProps = taggedLinkProps.anchorProps?.(linkName);
      const className = mergeClassNames(TextLinesConstants.link.className, anchorElementProps?.className);

      return (
        <a {...anchorElementProps} className={className}>
          {[...facingMeta].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
          {[...tag].map((char, index) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + index}
            >
              {cursorOn || !taggedLinkProps.tagHidden ? char : '\u200b'}
            </Char>
          ))}
          {[...linkName].map((char, index) => (
            <Char
              key={from + facingMeta.length + tag.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + tag.length + index}
            >
              {char}
            </Char>
          ))}
          {[...trailingMeta].map((char, index) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
            >
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
        </a>
      );
    }
    case 'bracketLink': {
      const { lineIndex, facingMeta, linkName, trailingMeta } = node;
      const [from, to] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;
      const anchorElementProps = bracketLinkProps.anchorProps?.(linkName);
      const className = mergeClassNames(TextLinesConstants.link.className, anchorElementProps?.className);

      return (
        <a {...anchorElementProps} className={className}>
          {[...facingMeta].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
          {[...linkName].map((char, index) => (
            <Char
              key={from + facingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={from + facingMeta.length + index}
            >
              {char}
            </Char>
          ))}
          {[...trailingMeta].map((char, index) => (
            <Char
              key={to - trailingMeta.length + index}
              lineIndex={lineIndex}
              charIndex={to - trailingMeta.length + index}
            >
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
        </a>
      );
    }
    case 'hashTag': {
      const { lineIndex, hashTag } = node;
      const [from] = node.range;
      const anchorElementProps = hashTagProps.anchorProps?.(getHashTagName(hashTag));
      const className = mergeClassNames(TextLinesConstants.link.className, anchorElementProps?.className);

      return (
        <a {...anchorElementProps} className={className}>
          {[...hashTag].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {char}
            </Char>
          ))}
        </a>
      );
    }
    case 'normal': {
      const { lineIndex, text } = node;
      const [from] = node.range;

      return (
        <span>
          {[...text].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {char}
            </Char>
          ))}
        </span>
      );
    }
  }
};
