import React from 'react';

import { Text } from '../../molecules/text/Text';

import { useText } from './hooks';

export const ViewerTextFieldBody: React.FC = () => {
  const textProps = useText();

  return <Text {...textProps} />;
};
