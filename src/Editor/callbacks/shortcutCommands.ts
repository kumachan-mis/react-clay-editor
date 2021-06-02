import { ShortcutCommand } from '../types';
import { isMacOS } from '../../common/utils';

export function shortcutCommand(event: React.KeyboardEvent<HTMLTextAreaElement>): ShortcutCommand | undefined {
  if (forwardDeleteTriggered(event)) return 'forwardDelete';
  if (backwardDeleteTriggered(event)) return 'backwardDelete';
  if (selectAllTriggered(event)) return 'selectAll';
  if (undoTriggered(event)) return 'undo';
  if (redoTriggered(event)) return 'redo';
  if (moveUpTriggered(event)) return 'moveUp';
  if (moveDownTriggered(event)) return 'moveDown';
  if (moveLeftTriggered(event)) return 'moveLeft';
  if (moveRightTriggered(event)) return 'moveRight';
  if (moveWordTopTriggered(event)) return 'moveWordTop';
  if (moveWordBottomTriggered(event)) return 'moveWordBottom';
  if (moveLineTopTriggered(event)) return 'moveLineTop';
  if (moveLineBottomTriggered(event)) return 'moveLineBottom';
  if (moveTextTopTriggered(event)) return 'moveTextTop';
  if (moveTextBottomTriggered(event)) return 'moveTextBottom';
  return undefined;
}

function forwardDeleteTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return isMacOS() && event.key == 'd' && event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function backwardDeleteTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}

function selectAllTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    event.key == 'a' &&
    !event.altKey &&
    !event.shiftKey
  );
}

function undoTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    event.key == 'z' &&
    !event.altKey &&
    !event.shiftKey
  );
}

function redoTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return (
    (!isMacOS() ? event.ctrlKey && !event.metaKey : event.metaKey && !event.ctrlKey) &&
    ((event.shiftKey && event.key == 'z') || (!event.shiftKey && event.key == 'y')) &&
    !event.altKey
  );
}

function moveUpTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.ctrlKey && (event.key == 'p' || event.key == 'P') && !event.metaKey && !event.altKey;
}

function moveDownTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.ctrlKey && (event.key == 'n' || event.key == 'N') && !event.metaKey && !event.altKey;
}

function moveLeftTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.ctrlKey && (event.key == 'b' || event.key == 'B') && !event.metaKey && !event.altKey;
}

function moveRightTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.ctrlKey && (event.key == 'f' || event.key == 'F') && !event.metaKey && !event.altKey;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveWordTopTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveWordBottomTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}

function moveLineTopTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return isMacOS() && event.ctrlKey && (event.key == 'a' || event.key == 'A') && !event.metaKey && !event.altKey;
}

function moveLineBottomTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return isMacOS() && event.ctrlKey && (event.key == 'e' || event.key == 'E') && !event.metaKey && !event.altKey;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveTextTopTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function moveTextBottomTriggered(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return false;
}
