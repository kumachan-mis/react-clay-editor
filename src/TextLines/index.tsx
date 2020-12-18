import * as React from 'react';

import { Props, NodeProps, TaggedLinkPropsMap } from './types';
import {
  TextLinesConstants,
  defaultTextDecoration,
  defaultLinkStyle,
  defaultLinkOverriddenStyleOnHover,
  defaultCodeStyle,
} from './constants';
import {
  Line,
  LineIndent,
  LineContent,
  CharGroup,
  Char,
  AnchorWithHoverStyle,
  MarginBottom,
} from './components';
import { parseText, getDecorationStyle, getHashTagName, getTagName } from './parser';
import { ParsingOptions } from './parser/types';
import { BracketLinkProps, HashTagProps, CodeProps, FormulaProps } from '../Editor/types';
import { KaTeX } from '../KaTeX';
import '../style.css';

export const TextLines: React.FC<Props> = ({
  text,
  textDecoration = defaultTextDecoration,
  bracketLinkProps = {
    anchorProps: () => ({
      style: defaultLinkStyle,
      overriddenStyleOnHover: defaultLinkOverriddenStyleOnHover,
    }),
  } as BracketLinkProps,
  hashTagProps = {
    anchorProps: () => ({
      style: defaultLinkStyle,
      overriddenStyleOnHover: defaultLinkOverriddenStyleOnHover,
    }),
  } as HashTagProps,
  taggedLinkPropsMap = {
    // empty object
  } as TaggedLinkPropsMap,
  codeProps = {
    codeProps: () => ({ style: defaultCodeStyle }),
  } as CodeProps,
  formulaProps = {
    // empty object
  } as FormulaProps,
  cursorCoordinate,
}) => {
  const options: ParsingOptions = {
    taggedLinkRegexes: Object.entries(taggedLinkPropsMap).map(([tagName, linkProps]) =>
      TextLinesConstants.regexes.taggedLink(tagName, linkProps.linkNameRegex)
    ),
    disabledMap: {
      bracketLink: bracketLinkProps.disabled,
      hashTag: hashTagProps.disabled,
      code: codeProps.disabled,
      formula: formulaProps.disabled,
    },
  };
  const nodes = parseText(text, options);

  return (
    <div className={TextLinesConstants.className}>
      {nodes.map((node, index) => (
        <Node
          key={index}
          node={node}
          textDecoration={textDecoration}
          bracketLinkProps={bracketLinkProps}
          hashTagProps={hashTagProps}
          taggedLinkPropsMap={taggedLinkPropsMap}
          codeProps={codeProps}
          formulaProps={formulaProps}
          curcorLineIndex={cursorCoordinate?.lineIndex}
        />
      ))}
      <MarginBottom />
    </div>
  );
};

const Node: React.FC<NodeProps> = ({
  node,
  textDecoration,
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
            textDecoration={textDecoration}
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
              textDecoration={textDecoration}
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
              textDecoration={textDecoration}
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

      return (
        <Line lineIndex={lineIndex} defaultFontSize={textDecoration.fontSizes.level1}>
          <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
          <LineContent
            lineIndex={lineIndex}
            indentDepth={indentDepth}
            contentLength={code.length}
            spanPorps={{ style: codeElementProps?.style }}
          >
            <code {...codeElementProps}>
              {[...code].map((char, index) => (
                <Char
                  key={indentDepth + index}
                  lineIndex={lineIndex}
                  charIndex={indentDepth + index}
                >
                  {char}
                </Char>
              ))}
            </code>
          </LineContent>
        </Line>
      );
    }
    case 'blockFormula': {
      return <></>;
    }
    case 'blockFormulaMeta':
    case 'blockFormulaLine': {
      return <></>;
    }
    case 'quotation': {
      const { lineIndex, indentDepth, contentLength, meta, children } = node;
      const cursorOn = curcorLineIndex == lineIndex;

      return (
        <Line lineIndex={lineIndex} defaultFontSize={textDecoration.fontSizes.level1}>
          <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
          <LineContent
            lineIndex={lineIndex}
            indentDepth={indentDepth}
            contentLength={contentLength}
            spanPorps={{ style: TextLinesConstants.quotation.content.style }}
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
                textDecoration={textDecoration}
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
        <Line lineIndex={lineIndex} defaultFontSize={textDecoration.fontSizes.level1}>
          <LineIndent lineIndex={lineIndex} indentDepth={indentDepth}>
            <span className={TextLinesConstants.itemization.dot.className} />
          </LineIndent>
          <LineContent
            lineIndex={lineIndex}
            indentDepth={indentDepth}
            contentLength={contentLength}
          >
            {children.map((child, index) => (
              <Node
                key={index}
                node={child}
                textDecoration={textDecoration}
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

      return (
        <code {...codeElementProps}>
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
      const [from, to] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;
      const displayMode = node.type == 'displayFormula';

      return !cursorOn ? (
        <CharGroup
          lineIndex={lineIndex}
          fromCharIndex={from + facingMeta.length}
          toCharIndex={to - trailingMeta.length}
        >
          <KaTeX
            options={{ throwOnError: false, displayMode }}
            onMouseDown={(event) => event.nativeEvent.stopImmediatePropagation()}
          >
            {formula}
          </KaTeX>
        </CharGroup>
      ) : (
        <span>
          {[...facingMeta, ...formula, ...trailingMeta].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {char}
            </Char>
          ))}
        </span>
      );
    }
    case 'decoration': {
      const { lineIndex, facingMeta, decoration, trailingMeta, children } = node;
      const [from, to] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;
      const decorationStyle = getDecorationStyle(decoration, textDecoration);

      return (
        <span style={TextLinesConstants.decoration.style(decorationStyle)}>
          {[...facingMeta, ...decoration].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {cursorOn ? char : '\u200b'}
            </Char>
          ))}
          {children.map((child, index) => (
            <Node
              key={index}
              node={child}
              textDecoration={textDecoration}
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

      return (
        <AnchorWithHoverStyle {...anchorElementProps} cursorOn={cursorOn}>
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
        </AnchorWithHoverStyle>
      );
    }
    case 'bracketLink': {
      const { lineIndex, facingMeta, linkName, trailingMeta } = node;
      const [from, to] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;
      const anchorElementProps = bracketLinkProps.anchorProps?.(linkName);

      return (
        <AnchorWithHoverStyle {...anchorElementProps} cursorOn={cursorOn}>
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
              {cursorOn ? char : '\u200b'}
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
        </AnchorWithHoverStyle>
      );
    }
    case 'hashTag': {
      const { lineIndex, hashTag } = node;
      const [from] = node.range;
      const cursorOn = curcorLineIndex == lineIndex;
      const anchorElementProps = hashTagProps.anchorProps?.(getHashTagName(hashTag));

      return (
        <AnchorWithHoverStyle {...anchorElementProps} cursorOn={cursorOn}>
          {[...hashTag].map((char, index) => (
            <Char key={from + index} lineIndex={lineIndex} charIndex={from + index}>
              {char}
            </Char>
          ))}
        </AnchorWithHoverStyle>
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
