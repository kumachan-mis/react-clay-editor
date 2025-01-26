import styled from '@emotion/styled';

const Api: React.FC<{
  readonly colorized:
    | 'all'
    | 'container'
    | 'content'
    | 'fixed-container'
    | 'fixed-content'
    | 'scrollable-container'
    | 'scrollable-content';
}> = ({ colorized }) => (
  <FixedContainer colorized={['all', 'container', 'fixed-container'].includes(colorized)}>
    <FixedContent colorized={['all', 'content', 'fixed-content'].includes(colorized)}>fixed content</FixedContent>
    <ScrollableContainer colorized={['all', 'container', 'scrollable-container'].includes(colorized)}>
      {[...Array(3).keys()].map((i) => (
        <ScrollableContent colorized={['all', 'content', 'scrollable-content'].includes(colorized)} key={i}>
          {[...Array(5).keys()].map((i) => (
            <div key={i}>scrollable content</div>
          ))}
        </ScrollableContent>
      ))}
    </ScrollableContainer>
  </FixedContainer>
);

const colorPalette: Record<string, string> = {
  fixedContainer: '#ff8787',
  fixedContent: '#f8c4b4',
  scrollableContainer: '#bce29e',
  scrollableContent: '#e5ebb2',
  text: '#333333',
  disabledContainer: '#d1d1d1',
  disabledContent: '#dddddd',
  disabledText: '#bbbbbb',
};

const FixedContainer = styled.div<{ colorized: boolean }>(
  ({ colorized }) => `
  width: 600px;
  height: 240px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: solid 6px ${colorized ? colorPalette.fixedContainer : colorPalette.disabledContainer};
  background-color: rgba(243, 246, 249, 1.0);
`,
);

const FixedContent = styled.div<{ colorized: boolean }>(
  ({ colorized }) => `
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6px;
  color: ${colorized ? colorPalette.text : colorPalette.disabledText};
  background-color: ${colorized ? colorPalette.fixedContent : colorPalette.disabledContent};
`,
);

const ScrollableContainer = styled.div<{ colorized: boolean }>(
  ({ colorized }) => `
  flex-grow: 1;
  overflow-y: scroll;
  margin: 0px 6px 6px 6px;
  border: solid 6px ${colorized ? colorPalette.scrollableContainer : colorPalette.disabledContainer};
`,
);

const ScrollableContent = styled.div<{ colorized: boolean }>(
  ({ colorized }) => `
  height: auto;
  text-align: center;
  margin: 6px;
  color: ${colorized ? colorPalette.text : colorPalette.disabledText};
  background-color: ${colorized ? colorPalette.scrollableContent : colorPalette.disabledContent};
`,
);

export default Api;
export { colorPalette };
