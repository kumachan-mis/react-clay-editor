import { DARK_THEME, LIGHT_THEME } from '../../../common/constants';
import { TextValueContextProvider } from '../../../contexts/TextContext';
import { TextNodesContextProvider } from '../../../contexts/TextNodesContext';
import { ViewerProps, ViewerPropsContextProvider } from '../../../contexts/ViewerPropsContext';
import { Root } from '../../atoms/root/Root';

import { ThemeProvider } from '@emotion/react';

export type ViewerRootProps = React.PropsWithChildren<
  { readonly text: string; readonly className?: string } & ViewerProps
>;

export const ViewerRoot: React.FC<ViewerRootProps> = ({ text, className, children, ...props }) => (
  <TextValueContextProvider text={text}>
    <ViewerPropsContextProvider props={props}>
      <TextNodesContextProvider props={props} text={text}>
        <ThemeProvider theme={props.palette !== 'dark' ? LIGHT_THEME : DARK_THEME}>
          <ViewerRootInner className={className}>{children}</ViewerRootInner>
        </ThemeProvider>
      </TextNodesContextProvider>
    </ViewerPropsContextProvider>
  </TextValueContextProvider>
);

const ViewerRootInner: React.FC<React.PropsWithChildren<{ readonly className?: string }>> = ({
  className,
  children,
}) => <Root className={className}>{children}</Root>;
