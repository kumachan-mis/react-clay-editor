import { CursorCoordinate } from './cursorCoordinate';

export type EditAction =
  | {
      actionType: 'replace';
      coordinate: CursorCoordinate;
      deletedText: string;
      insertedText: string;
    }
  | {
      actionType: 'insert';
      coordinate: CursorCoordinate;
      text: string;
    }
  | {
      actionType: 'delete';
      coordinate: CursorCoordinate;
      text: string;
    };
