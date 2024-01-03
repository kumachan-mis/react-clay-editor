import { TextNodeComponent } from './TextNodeComponent';
import { useTextNodeComponent } from './TextNodeComponent.hooks';
import { TextProps } from './types';

export const Text: React.FC<TextProps> = ({ nodes, cursorCoordinate, cursorSelection, ...visuals }) => {
  const { getEditMode, linkForceClickable } = useTextNodeComponent(cursorCoordinate, cursorSelection);

  return (
    <>
      {nodes.map((node, index) => (
        <TextNodeComponent
          getEditMode={getEditMode}
          key={index}
          linkForceClickable={linkForceClickable}
          node={node}
          {...visuals}
        />
      ))}
    </>
  );
};
