import React from 'react';

import { TextNodeComponent } from './TextNodeComponent';
import { useTextNodeComponent } from './TextNodeComponent.hooks';
import { TextProps } from './types';

export const Text: React.FC<TextProps> = ({ nodes, cursorCoordinate, textSelection, ...visuals }) => {
  const { editMode, linkForceClickable } = useTextNodeComponent(cursorCoordinate, textSelection);

  return (
    <>
      {nodes.map((node, index) => (
        <TextNodeComponent
          key={index}
          node={node}
          editMode={editMode}
          linkForceClickable={linkForceClickable}
          {...visuals}
        />
      ))}
    </>
  );
};
