import styled from '@emotion/styled';

export const DividerConstants = {
  selectId: 'divider',
  selectIdRegex: /divider/,
};

export const Divider: React.FC = () => <StyledDivider data-selectid={DividerConstants.selectId} />;

const StyledDivider = styled.div(
  (props) => `
  width: 100%;
  border-bottom: solid 1px ${props.theme.base.dividerColor};
`
);
