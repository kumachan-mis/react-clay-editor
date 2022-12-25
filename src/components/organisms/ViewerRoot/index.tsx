import { Root } from 'src/components/atoms/root/Root';
import { TextValueContextProvider } from 'src/contexts/TextContext';
import { TextNodesContextProvider } from 'src/contexts/TextNodesContext';
import { ViewerProps, ViewerPropsContextProvider } from 'src/contexts/ViewerPropsContext';

import React from 'react';

export type ViewerRootProps = React.PropsWithChildren<{ text: string } & ViewerProps>;

export const ViewerRoot: React.FC<ViewerRootProps> = ({ text, children, ...props }) => (
  <TextValueContextProvider text={text}>
    <ViewerPropsContextProvider props={props}>
      <TextNodesContextProvider text={text} props={props}>
        <ViewerRootInner className={props.className}>{children}</ViewerRootInner>
      </TextNodesContextProvider>
    </ViewerPropsContextProvider>
  </TextValueContextProvider>
);

const ViewerRootInner: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <Root className={className}>{children}</Root>
);
