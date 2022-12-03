import React from 'react';

import { TextField } from '../../atoms/root/TextField';
import { TextFieldRoot } from '../../atoms/root/TextFieldRoot';

export type ViewerTextFieldRootProps = React.PropsWithChildren;

export const ViewerTextFieldRoot: React.FC<ViewerTextFieldRootProps> = ({ children }) => (
  <TextFieldRoot>
    <TextField>{children}</TextField>
  </TextFieldRoot>
);
