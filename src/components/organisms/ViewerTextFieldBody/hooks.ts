import { TextProps } from 'src/components/molecules/text/Text/types';
import { useTextNodesValueContext } from 'src/contexts/TextNodesContext';
import { useViewerPropsValueContext } from 'src/contexts/ViewerPropsContext';

export function useText(): TextProps {
  const nodes = useTextNodesValueContext();
  const props = useViewerPropsValueContext();

  return {
    nodes,
    textVisual: props.textProps,
    bracketLinkVisual: props.bracketLinkProps,
    hashtagVisual: props.hashtagProps,
    codeVisual: props.codeProps,
    formulaVisual: props.formulaProps,
    taggedLinkVisualMap: props.taggedLinkPropsMap,
  };
}
