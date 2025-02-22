import styled from '@emotion/styled';

export type CursorTextAreaProps = {
  readonly position: { top: number; left: number };
  readonly cursorSize: number;
  readonly value?: string;
} & React.PropsWithoutRef<React.ComponentProps<'textarea'>>;

export const CursorTextArea: React.FC<CursorTextAreaProps> = ({ position, cursorSize, ...rest }) => (
  <StyledCursorTextArea
    autoCapitalize="none"
    cursorSize={cursorSize}
    position={position}
    spellCheck={false}
    wrap="off"
    {...rest}
  />
);

const StyledCursorTextArea = styled.textarea<{
  position: { top: number; left: number };
  cursorSize: number;
  value?: string;
}>(
  (props) => `
  position: absolute;
  overflow: hidden;
  border: none;
  outline: none;
  resize: none;
  padding: 0px;
  z-index: 1;
  top: ${props.position.top}px;
  left: ${props.position.left}px;
  width: ${Math.min(props.value?.length ?? 0, 10) * props.cursorSize}px;
  height: ${props.cursorSize}px;
  min-height: ${props.cursorSize}px;
  font-size: ${props.cursorSize / 1.2}px;
  font-family: ${props.theme.base.fontFamily};
  color: ${props.theme.base.color};
  background-color: ${props.theme.base.backgroundColor};
`,
);
