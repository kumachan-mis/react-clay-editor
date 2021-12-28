import * as React from 'react';
import { SVGProps } from 'react';

const SvgTaggedlink = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M299.8 217c0-22.9-8.1-42.4-24.3-58.5s-35.7-24.3-58.5-24.3-42.4 8.1-58.5 24.3-24.3 35.7-24.3 58.5c0 22.9 8.1 42.4 24.3 58.5 16.2 16.2 35.7 24.3 58.5 24.3s42.4-8.1 58.5-24.3 24.3-35.6 24.3-58.5zM990 589.6c0 22.9-8 42.3-23.9 58.2L648.5 966.1C631.6 982 612 990 589.6 990c-22.9 0-42.3-8-58.2-23.9L68.9 502.9c-16.4-16-30.3-37.7-41.7-65.3S10 384.8 10 361.9V92.8c0-22.4 8.2-41.8 24.6-58.2S70.4 10 92.8 10h269.1c22.9 0 48.1 5.7 75.7 17.1s49.6 25.3 66 41.7l462.5 461.9c15.9 16.8 23.9 36.5 23.9 58.9z" />
  </svg>
);

export default SvgTaggedlink;
