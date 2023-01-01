import styled from '@emotion/styled';
import React from 'react';

const ApiExplanation: React.FC<{
  colorized: 'all' | 'fixed-container' | 'fixed-content' | 'scrollable-container' | 'scrollable-content';
}> = ({ colorized }) => (
  <FixedContainer colorized={['all', 'fixed-container'].includes(colorized)}>
    <FixedContent colorized={['all', 'fixed-content'].includes(colorized)}>fixed content</FixedContent>
    <ScrollableContainer colorized={['all', 'scrollable-container'].includes(colorized)}>
      {[...new Array(3)].map((_, i) => (
        <ScrollableContent key={i} colorized={['all', 'scrollable-content'].includes(colorized)}>
          {[...new Array(5)].map((_, i) => (
            <div key={i}>scrollable content</div>
          ))}
        </ScrollableContent>
      ))}
    </ScrollableContainer>
    <FixedContent colorized={['all', 'fixed-content'].includes(colorized)}>fixed content</FixedContent>
  </FixedContainer>
);

const colorPalette = {
  fixedContainer: '#ff8787',
  fixedContent: '#f8c4b4',
  scrollableContainer: '#bce29e',
  scrollableContent: '#e5ebb2',
};

const FixedContainer = styled.div<{ colorized: boolean }>(
  ({ colorized }) => `
  width: 600px;
  height: 240px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: solid 6px ${colorized ? colorPalette.fixedContainer : '#d1d1d1'};
`
);

const FixedContent = styled.div<{ colorized: boolean }>(
  ({ colorized }) => `
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6px;
  color: ${colorized ? '#333333' : '#bbbbbb'};
  background-color: ${colorized ? colorPalette.fixedContent : '#dddddd'};
`
);

const ScrollableContainer = styled.div<{ colorized: boolean }>(
  ({ colorized }) => `
  flex-grow: 1;
  overflow-y: scroll;
  margin: 0px 6px 0px 6px;
  border: solid 6px ${colorized ? colorPalette.scrollableContainer : '#d1d1d1'};
`
);

const ScrollableContent = styled.div<{ colorized: boolean }>(
  ({ colorized }) => `
  height: auto;
  text-align: center;
  margin: 6px;
  color: ${colorized ? '#333333' : '#bbbbbb'};
  background-color: ${colorized ? colorPalette.scrollableContent : '#dddddd'};
`
);

export default ApiExplanation;
export { colorPalette };
