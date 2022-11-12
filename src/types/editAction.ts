import { CursorCoordinate } from './cursorCoordinate';

export type EditAction = ReplaceAction | InsertAction | DeleteAction;

type ReplaceAction = {
  actionType: 'replace';
  coordinate: CursorCoordinate;
  deletedText: string;
  insertedText: string;
};

type InsertAction = {
  actionType: 'insert';
  coordinate: CursorCoordinate;
  text: string;
};

type DeleteAction = {
  actionType: 'delete';
  coordinate: CursorCoordinate;
  text: string;
};
