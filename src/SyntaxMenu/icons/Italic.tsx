import * as React from 'react';
import { SVGProps } from 'react';

const SvgItalic = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M920 10v70H780L430 920h140v70H80v-70h140L570 80H430V10h490z" />
  </svg>
);

export default SvgItalic;
