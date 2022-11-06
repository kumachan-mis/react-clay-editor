import styled from '@emotion/styled';
import React from 'react';

export type MonospaceProps = React.PropsWithoutRef<React.ComponentProps<'code'>>;

export const Monospace: React.FC<MonospaceProps> = ({ ...rest }) => <StyledMonospace {...rest} />;

const StyledMonospace = styled.code`
  display: inline-block;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  background-color: rgba(27, 31, 35, 0.05);
`;
