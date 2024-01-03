import styled from '@emotion/styled';

export type MonospaceProps = React.PropsWithoutRef<React.ComponentProps<'code'>>;

export const Monospace: React.FC<MonospaceProps> = ({ ...rest }) => <StyledMonospace {...rest} />;

const StyledMonospace = styled.code(
  (props) => `
  display: inline-block;
  font-family: ${props.theme.monospace.fontFamily};
  background-color: ${props.theme.monospace.backgroundColor};
`
);
