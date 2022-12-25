import { Text } from 'src/components/molecules/text/Text';

import { useText } from './hooks';

import React from 'react';

export const ViewerTextFieldBody: React.FC = () => {
  const textProps = useText();

  return <Text {...textProps} />;
};
