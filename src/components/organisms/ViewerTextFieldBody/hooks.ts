import { useTextNodesValueContext } from '../../../contexts/TextNodesContext';
import { useViewerPropsValueContext } from '../../../contexts/ViewerPropsContext';
import { TextProps } from '../../molecules/text/Text';

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
