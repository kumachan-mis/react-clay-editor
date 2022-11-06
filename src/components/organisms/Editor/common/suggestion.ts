import { Props, State } from '../types';

import { insertText } from './text';

type SuggestionConfig = {
  suggestionType: 'text' | 'bracketLink' | 'hashtag' | 'taggedLink' | 'none';
  facingRegex: RegExp;
  trailingRegex: RegExp;
  getSuggestionStart?: (text: string | undefined) => number;
  suggestions?: string[];
  initialSuggestionIndex?: number;
  disabled?: boolean;
};

const suggestionConstants = {
  bracketLink: {
    facingRegex: /^.*\[(?<text>[^[\]]*)$/,
    trailingRegex: /^([\]\s].*)?$/,
  },
  hashtag: {
    facingRegex: /^.*#(?<text>\S*)$/,
    trailingRegex: /^(\s.*)?$/,
  },
  taggedLink: (tagName: string) => {
    const tag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return {
      facingRegex: RegExp(`^.*\\[(?<tag>${tag}:)( (?<text>[^[\\]]*))?$`),
      trailingRegex: /^([\]\s].*)?$/,
      getSuggestionStart: (text: string | undefined): number => (text === undefined ? 0 : text.length + 1),
    };
  },
  decoration: {
    facingRegex: /^.*\[\*{1,3} (?<text>[^[\]]*)$/,
    trailingRegex: /^([\]\s].*)?$/,
  },
  heading: {
    facingRegex: /^#{1,3} (?<text>[^[\]]*)$/,
    trailingRegex: /^([\]\s].*)?$/,
  },
  text: {
    facingRegex: /^(.*\s)?(?<text>\S+)$/,
    trailingRegex: /^(\s.*)?$/,
  },
};

export function showSuggestion(text: string, props: Props, state: State): [string, State] {
  const configs: SuggestionConfig[] = [];

  if (!props.syntax || props.syntax === 'bracket') {
    // bracket syntax
    configs.push({ suggestionType: 'text', ...props.textProps, ...suggestionConstants.decoration });
  } else {
    // markdown syntax
    configs.push({ suggestionType: 'text', ...props.textProps, ...suggestionConstants.heading });
  }

  for (const [tagName, taggedLinkProps] of Object.entries(props.taggedLinkPropsMap || {})) {
    configs.push({ suggestionType: 'taggedLink', ...taggedLinkProps, ...suggestionConstants.taggedLink(tagName) });
  }

  configs.push({ suggestionType: 'bracketLink', ...props.bracketLinkProps, ...suggestionConstants.bracketLink });
  configs.push({ suggestionType: 'hashtag', ...props.hashtagProps, ...suggestionConstants.hashtag });
  configs.push({ suggestionType: 'text', ...props.textProps, ...suggestionConstants.text });

  for (const config of configs) {
    const newState = showConfiguredSuggestion(text, state, config);
    if (newState) return [text, newState];
  }
  return [text, resetSuggestion(state)];
}

function showConfiguredSuggestion(text: string, state: State, config: SuggestionConfig): State | undefined {
  if (!state.cursorCoordinate) return undefined;

  const { lineIndex, charIndex } = state.cursorCoordinate;
  const currentLine = text.split('\n')[lineIndex];
  const [facingText, trailingText] = [currentLine.substring(0, charIndex), currentLine.substring(charIndex)];
  if (!config.facingRegex.test(facingText) || !config.trailingRegex.test(trailingText)) return undefined;

  const allSuggestions = config.suggestions;
  if (!allSuggestions || allSuggestions.length === 0 || config.disabled) return resetSuggestion(state);

  const groups = facingText.match(config.facingRegex)?.groups as Record<string, string>;
  const suggestions = allSuggestions.filter((suggestion) => suggestion.startsWith(groups.text || ''));
  if (suggestions.length === 0) return resetSuggestion(state);

  let suggestionIndex = config.initialSuggestionIndex;
  if (!suggestionIndex || suggestions.length !== allSuggestions.length) suggestionIndex = 0;
  const suggestionStart = config.getSuggestionStart?.(groups.text) || groups.text?.length || 0;
  return { ...state, suggestionType: config.suggestionType, suggestions, suggestionIndex, suggestionStart };
}

export function showIMEBasedSuggestion(
  text: string,
  props: Props,
  state: State,
  specifiedText: string
): [string, State] {
  const allSuggestions = props.textProps?.suggestions;
  if (!allSuggestions || allSuggestions.length === 0) return [text, resetSuggestion(state)];

  const suggestions = allSuggestions.filter((suggestion) => suggestion.startsWith(specifiedText));
  if (suggestions.length === 0) return [text, resetSuggestion(state)];

  let suggestionIndex = props.textProps?.initialSuggestionIndex;
  if (!suggestionIndex || suggestions.length !== allSuggestions.length) suggestionIndex = 0;
  const suggestionStart = specifiedText.length;
  return [text, { ...state, suggestionType: 'text', suggestions, suggestionIndex, suggestionStart }];
}

export function insertSuggestion(text: string, state: State, suggestion: string, start: number): [string, State] {
  const [newText, newState] = ((): [string, State] => {
    switch (state.suggestionType) {
      case 'bracketLink':
        return insertText(text, state, suggestion.substring(start));
      case 'hashtag':
        return insertText(text, state, `${suggestion.replaceAll(' ', '_')} `.substring(start));
      case 'taggedLink':
        return insertText(text, state, ` ${suggestion}`.substring(start));
      case 'text':
        return insertText(text, state, suggestion.substring(start));
      case 'none':
        return [text, state];
    }
  })();
  return [newText, resetSuggestion(newState)];
}

export function resetSuggestion(state: State): State {
  return { ...state, suggestionType: 'none', suggestions: [], suggestionIndex: -1, suggestionStart: 0 };
}
