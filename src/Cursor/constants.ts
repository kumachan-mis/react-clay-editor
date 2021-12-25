import styles from './style.css';
import { Position } from './types';

export const CursorConstants = {
  cursorBar: {
    className: styles.cursorBar,
    style: (position: Position, cursorSize: number): React.CSSProperties => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
      height: `${cursorSize}px`,
    }),
  },
  svg: { width: '2px' },
  rect: { x: 0, y: 0, width: '1px', height: '100%' },
  textArea: {
    className: styles.cursorTextarea,
    wrap: 'off',
    spellCheck: false,
    autoCapitalize: 'none',
    style: (position: Position, cursorSize: number, length: number): React.CSSProperties => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
      width: `${Math.min(length, 10) * cursorSize}px`,
      height: `${cursorSize}px`,
      minHeight: `${cursorSize}px`,
      fontSize: `${cursorSize}px`,
    }),
  },
  suggestion: {
    list: {
      className: styles.suggestionList,
      selectId: 'suggestion-list',
      style: (position: Position, cursorSize: number): React.CSSProperties => ({
        top: `${position.top + cursorSize + 2}px`,
        left: `${position.left}px`,
      }),
    },
    header: {
      className: styles.suggestionHeader,
      selectId: 'suggestion-header',
      name: (suggestionType: 'text' | 'bracketLink' | 'hashTag' | 'taggedLink' | 'none'): string => {
        switch (suggestionType) {
          case 'text':
            return 'Text Suggestion';
          case 'bracketLink':
            return 'Bracket Link Suggestion';
          case 'hashTag':
            return 'HashTag Suggestion';
          case 'taggedLink':
            return 'Tagged Link Suggestion';
          default:
            return '';
        }
      },
    },
    container: {
      className: styles.suggestionContainer,
    },
    item: {
      className: styles.suggestionItem,
      selectId: (index: number): string => `suggestion-item-${index}`,
    },
  },
};
