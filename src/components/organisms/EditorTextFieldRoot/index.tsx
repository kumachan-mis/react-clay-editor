import { TextField } from '../../atoms/root/TextField';
import { TextFieldRoot } from '../../atoms/root/TextFieldRoot';

import { useTextField } from './hooks';

import React from 'react';

export type EditorTextFieldRootProps = React.PropsWithChildren;

export const EditorTextFieldRoot: React.FC<EditorTextFieldRootProps> = ({ children }) => {
  const textFieldProps = useTextField();

  return (
    <TextFieldRoot>
      <TextField {...textFieldProps}>{children}</TextField>
    </TextFieldRoot>
  );
};
