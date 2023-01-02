import { TextField } from '../../atoms/root/TextField';
import { TextFieldRoot } from '../../atoms/root/TextFieldRoot';

import React from 'react';

export type ViewerTextFieldRootProps = React.PropsWithChildren;

export const ViewerTextFieldRoot: React.FC<ViewerTextFieldRootProps> = ({ children }) => (
  <TextFieldRoot>
    <TextField>{children}</TextField>
  </TextFieldRoot>
);
