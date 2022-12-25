import { TextNodeComponent } from './TextNodeComponent';
import { useTextNodeComponent } from './TextNodeComponent.hooks';
import { TextProps } from './types';

import React from 'react';

export const Text: React.FC<TextProps> = ({ nodes, cursorCoordinate, cursorSelection, ...visuals }) => {
  const { getEditMode, linkForceClickable } = useTextNodeComponent(cursorCoordinate, cursorSelection);

  return (
    <>
      {nodes.map((node, index) => (
        <TextNodeComponent
          key={index}
          node={node}
          getEditMode={getEditMode}
          linkForceClickable={linkForceClickable}
          {...visuals}
        />
      ))}
    </>
  );
};
