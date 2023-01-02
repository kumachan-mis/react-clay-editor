import { TextValueContextProvider } from '../../../contexts/TextContext';
import { TextNodesContextProvider } from '../../../contexts/TextNodesContext';
import { ViewerProps, ViewerPropsContextProvider } from '../../../contexts/ViewerPropsContext';
import { Root } from '../../atoms/root/Root';

import React from 'react';

export type ViewerRootProps = React.PropsWithChildren<{ text: string; className?: string } & ViewerProps>;

export const ViewerRoot: React.FC<ViewerRootProps> = ({ text, className, children, ...props }) => (
  <TextValueContextProvider text={text}>
    <ViewerPropsContextProvider props={props}>
      <TextNodesContextProvider text={text} props={props}>
        <ViewerRootInner className={className}>{children}</ViewerRootInner>
      </TextNodesContextProvider>
    </ViewerPropsContextProvider>
  </TextValueContextProvider>
);

const ViewerRootInner: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <Root className={className}>{children}</Root>
);
