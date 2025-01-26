import styled from '@emotion/styled';
import React from 'react';

export type MonospaceProps = React.PropsWithoutRef<React.ComponentProps<'code'>>;

const StyledMonospace = styled.code(
  (props) => `
  display: inline-block;
  font-family: ${props.theme.monospace.fontFamily};
  background-color: ${props.theme.monospace.backgroundColor};
`,
);

const MonospaceComponent: React.FC<MonospaceProps> = ({ ...rest }) => <StyledMonospace {...rest} />;

export const Monospace = React.memo(MonospaceComponent);
