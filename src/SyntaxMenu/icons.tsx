import * as React from 'react';

import { mergeClassNames } from '../common/utils';

const SvgSection = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M484.6 990c-47.2 0-87.2-13.8-118.8-41-31.8-27.4-47.9-59.4-47.9-95.1 0-17.3 6.3-32.3 18.8-44.5 12.7-12.4 28.5-18.9 45.8-18.9 17.2 0 32.7 6.1 44.8 17.7 11.9 11.5 18 26.6 18 45.1 0 10.8-1.8 22.8-5.3 35.6-3.5 12.6-4.2 19.1-4.2 22.3 0 3.5.9 7.7 7.4 12.2 12.2 8.4 26.9 12.5 44.9 12.5 21.6 0 40.9-7.5 58.9-23 17.8-15.2 26.4-30.9 26.4-47.9 0-18.9-5-35.2-15.4-50-17.5-24.7-50.6-53.5-98.2-85.8-76.4-51.2-127.4-95.5-155.6-135.4-21.9-31.3-33-65-33-100.2 0-35.5 11.6-70.8 34.5-104.9 19.6-29.2 48.6-55.6 86.4-78.6-20.2-21.7-35.3-42.2-45.1-61-12.3-23.7-18.6-48.2-18.6-72.9 0-45.8 18.1-85.3 53.8-117.6C418.1 26.4 462.6 10 514.7 10c47.9 0 88.2 13.5 119.8 40.1 31.9 26.9 48.1 58.3 48.1 93.4 0 17.9-6.7 33.8-19.9 47.5l-.3.3c-7.6 7.6-21.6 16.6-45 16.6-18.3 0-34.4-6-46.5-17.4-12-11.3-18.1-24.8-18.1-40.2 0-6.6 1.6-16.7 5.1-31.6 1.7-7.1 2.5-13.5 2.5-19.4 0-9.9-3.6-17.5-11.2-23.9-7.9-6.6-19.2-9.9-34.6-9.9-23.8 0-43.3 7.2-59.7 22.1-16.4 14.9-24.4 32.6-24.4 54.1 0 19.3 4.4 35.2 13 47.2 16.4 22.9 44.8 47.6 84.4 73.5 80.6 52.2 136.8 100.2 167 142.4 22.3 31.7 33.6 65.4 33.6 100.3 0 35-11.4 70.3-33.8 105-19.3 29.8-48.5 56.7-87 80.1 21.2 22.5 36.2 42.1 45.5 59.9 11.6 22 17.4 46 17.4 71.3 0 47.5-18.1 87.9-53.8 120-35.5 32.3-80.1 48.6-132.2 48.6zm-47.4-639c-46.2 27.7-68.6 59.5-68.6 97 0 21.8 6.2 41.3 19 59.6 19.1 26.7 56.7 59.4 111.8 96.9 23.3 15.9 44.4 31.3 62.8 46 47-28.2 69.8-59.7 69.8-95.9 0-19.7-7.8-40.9-23.2-63.1-16.1-23.1-50.6-53.4-102.5-89.9-27.1-18.6-50.3-35.7-69.1-50.6z" />
  </svg>
);

const SvgItemize = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M101.9 438.7H40.6c-16.9 0-30.6 13.7-30.6 30.7v61.3c0 16.9 13.7 30.7 30.6 30.7h61.2c16.9 0 30.6-13.7 30.6-30.7v-61.3c.1-17-13.6-30.7-30.5-30.7zm857.5 30.6H316.2c-16.9 0-30.6 13.7-30.6 30.7 0 16.9 13.7 30.7 30.6 30.7h643.1c16.9 0 30.6-13.7 30.6-30.7.1-16.9-13.6-30.7-30.5-30.7zM101.9 683.9H40.6c-16.9 0-30.6 13.7-30.6 30.7v61.3c0 16.9 13.7 30.7 30.6 30.7h61.2c16.9 0 30.6-13.7 30.6-30.7v-61.3c.1-17-13.6-30.7-30.5-30.7zm857.5 30.7H316.2c-16.9 0-30.6 13.7-30.6 30.7 0 16.9 13.7 30.7 30.6 30.7h643.1c16.9 0 30.6-13.7 30.6-30.7s-13.6-30.7-30.5-30.7zM101.9 193.5H40.6c-16.9 0-30.6 13.7-30.6 30.7v61.3c0 16.9 13.7 30.7 30.6 30.7h61.2c16.9 0 30.6-13.7 30.6-30.7v-61.3c.1-17-13.6-30.7-30.5-30.7zm214.3 91.9h643.1c16.9 0 30.6-13.7 30.6-30.7 0-16.9-13.7-30.7-30.6-30.7H316.2c-16.9 0-30.6 13.7-30.6 30.7s13.7 30.7 30.6 30.7z" />
  </svg>
);

const SvgBold = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M126.4 990V10H449c122.5 0 216.4 24.5 285.8 69.4 69.4 44.9 102.1 114.3 102.1 200.1 0 44.9-12.3 89.8-32.7 122.5-20.4 36.8-57.2 65.3-102.1 81.7 57.2 12.2 102.1 36.7 130.7 77.6 28.6 40.8 40.8 85.7 40.8 134.8 0 93.9-32.7 167.4-98 216.4C710.3 961.4 620.5 990 498 990H126.4zM351 418.3h89.8c53.1 0 93.9-8.2 122.5-28.6 28.6-20.4 40.8-49 40.8-85.7 0-40.8-12.3-73.5-40.8-89.8-28.6-16.3-65.3-28.6-118.4-28.6H351v232.7zm0 151.1v245h147c49 0 85.8-8.2 110.3-28.6 24.5-20.4 36.8-49 36.8-89.8s-12.3-73.5-32.7-93.9c-20.4-20.4-57.2-32.7-106.2-32.7H351z" />
  </svg>
);

const SvgItalic = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M920 10v70H780L430 920h140v70H80v-70h140L570 80H430V10h490z" />
  </svg>
);

const SvgUnderline = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M198.15 12.86c-.61 1.43-.61 122.7-.2 269.34.82 286.51.61 281.81 11.66 336.62 22.09 109 82.42 184.06 172.4 214.32 54.19 18.2 126.39 21.68 187.94 9 115.54-23.31 191.62-101.44 219.22-224.96 12.47-56.24 12.27-51.13 12.47-341.32V11.02l-52.56-.61-52.56-.41-.82 268.31c-.61 262.59-.82 269.13-4.91 295.1-10.23 61.56-28.22 103.48-58.69 135.59-25.56 27-56.03 43.36-94.28 50.51-25.56 4.91-73.42 3.27-94.89-2.86-71.16-20.85-115.53-79.34-132.1-174.03-6.14-35.79-7.16-76.69-7.16-323.74V10h-52.15c-42.33 0-52.56.61-53.37 2.86zM197.33 951.76v37.83l14.93.2c7.98 0 143.97.21 302.06.21h287.33l.61-38.04.41-38.04H197.33v37.84z" />
  </svg>
);

const SvgBracket = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M561.3 990V867.5h122.5v-735H561.3V10h245v980h-245zm-367.5-61.2V10h245v122.5H316.3v735h122.5V990h-245v-61.2z" />
  </svg>
);

const SvgHashtag = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="m553.9 572.6 36.3-145.2H446.1l-36.3 145.2h144.1zm435.7-285.9-31.8 127.1c-2.6 9.1-8.5 13.6-17.6 13.6H754.7l-36.3 145.2h176.4c5.7 0 10.4 2.3 14.2 6.8 3.8 5.3 4.9 10.6 3.4 15.9l-31.8 127.1c-1.9 9.1-7.8 13.6-17.6 13.6H677.6l-46 186.1c-2.6 9.1-8.5 13.6-17.6 13.6H487c-6.1 0-11-2.3-14.7-6.8-3.4-4.5-4.5-9.8-3.4-15.9L513 736H369l-46 186.1c-2.6 9.1-8.5 13.6-17.6 13.6H177.8c-5.7 0-10.4-2.3-14.2-6.8-3.4-4.5-4.5-9.8-3.4-15.9l44.2-177H28c-5.7 0-10.4-2.3-14.2-6.8-3.4-4.5-4.5-9.8-3.4-15.9l31.8-127.1c2.6-9.1 8.5-13.6 17.6-13.6h185.5l36.3-145.2H105.2c-5.7 0-10.4-2.3-14.2-6.8-3.8-5.3-4.9-10.6-3.4-15.9l31.8-127.1c1.9-9.1 7.8-13.6 17.6-13.6h185.5l46-186.1c2.6-9.1 8.7-13.6 18.2-13.6h127.1c5.7 0 10.4 2.3 14.2 6.8 3.4 4.5 4.5 9.8 3.4 15.9L487 264h144l46-186.1c2.6-9.1 8.7-13.6 18.2-13.6h127.1c5.7 0 10.4 2.3 14.2 6.8 3.4 4.5 4.5 9.8 3.4 15.9l-44.2 177H972c5.7 0 10.4 2.3 14.2 6.8 3.4 4.6 4.5 9.8 3.4 15.9z" />
  </svg>
);

const SvgTaggedlink = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M299.8 217c0-22.9-8.1-42.4-24.3-58.5s-35.7-24.3-58.5-24.3-42.4 8.1-58.5 24.3-24.3 35.7-24.3 58.5c0 22.9 8.1 42.4 24.3 58.5 16.2 16.2 35.7 24.3 58.5 24.3s42.4-8.1 58.5-24.3 24.3-35.6 24.3-58.5zM990 589.6c0 22.9-8 42.3-23.9 58.2L648.5 966.1C631.6 982 612 990 589.6 990c-22.9 0-42.3-8-58.2-23.9L68.9 502.9c-16.4-16-30.3-37.7-41.7-65.3S10 384.8 10 361.9V92.8c0-22.4 8.2-41.8 24.6-58.2S70.4 10 92.8 10h269.1c22.9 0 48.1 5.7 75.7 17.1s49.6 25.3 66 41.7l462.5 461.9c15.9 16.8 23.9 36.5 23.9 58.9z" />
  </svg>
);

const SvgCode = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M39.86 102.28c-16.56 5.83-29.39 23.33-29.63 40.12 0 4.2 18.43 62.52 40.82 129.94 22.4 67.42 40.82 123.87 40.82 125.5 0 1.63-16.33 19.36-36.39 39.19-60.65 60.19-60.65 65.78 0 125.97 20.07 19.83 36.4 37.8 36.4 39.66 0 1.87-18.43 58.55-40.82 125.74S10.24 854.14 10.24 858.57c0 16.56 14.93 35.46 32.19 40.36 12.6 3.5 258.47 3.27 268.97-.47 19.6-6.53 30.09-21 30.09-41.75 0-15.87-7.23-28.7-21-36.63l-10.5-6.3-97.28-.7c-53.65-.47-97.51-1.4-97.51-2.33 0-.93 15.63-48.99 34.99-106.61 35.69-107.08 38.72-119.91 32.42-132.5-1.4-2.8-17.5-20.06-35.46-38.49l-33.13-33.13 33.13-33.36c17.96-18.2 34.06-35.46 35.46-38.26 6.3-12.6 3.27-25.43-32.42-132.5-19.13-57.62-34.99-105.67-34.99-106.61 0-.93 43.86-1.87 97.51-2.33l97.28-.7 10.5-6.3c13.76-7.93 21-20.76 21-36.62 0-20.76-10.5-35.23-30.09-41.76-12.37-4.43-259.64-3.73-271.54.7zM688.37 101.12c-35.23 10.73-40.59 60.89-8.16 79.31l10.03 5.83 97.51.7c53.42.47 97.28 1.4 97.28 2.33 0 .93-15.63 48.99-34.99 106.61-35.69 107.07-38.72 119.9-32.43 132.5 1.4 2.8 17.5 20.06 35.46 38.26l33.13 33.36-33.13 33.13c-17.96 18.43-34.06 35.69-35.46 38.49-6.3 12.6-3.26 25.43 32.43 132.5 19.36 57.62 34.99 105.67 34.99 106.61 0 .93-43.86 1.87-97.28 2.33l-97.51.7-10.5 6.3c-27.53 16.09-28.46 55.99-1.87 73.48l9.8 6.53 130.17.7c86.31.47 133.44-.23 139.5-1.87 17.5-4.67 32.43-23.56 32.66-40.82 0-3.97-18.43-62.05-40.82-129.47s-40.82-124.1-40.82-125.97c0-1.87 16.33-19.83 36.39-39.66 37.32-37.09 45.25-48.05 45.25-62.98s-7.93-25.89-45.26-62.98c-20.06-19.83-36.39-37.79-36.39-39.66s18.43-58.55 40.82-125.97 40.82-125.5 40.82-129.47c-.23-17.03-15.16-35.92-32.19-40.82-10.49-2.8-259.63-2.8-269.43 0zM466.99 238.52c-24.96 8.16-49.45 27.99-62.99 51.55-18.2 31.26-18.2 76.05 0 107.31 37.56 64.85 125.28 75.58 175.9 21.46 20.53-21.93 29.86-45.26 29.86-75.12 0-38.49-18.9-72.32-51.56-93.54-24.96-15.86-62.75-20.76-91.21-11.66zM466.29 506.32c-47.12 16.79-75.82 56.92-75.82 105.91 0 41.76 22.86 78.62 60.42 97.74l14.46 7.23-10.03 7.93c-5.6 4.43-16.1 11.43-23.56 15.63-31.96 17.96-41.29 29.16-41.29 49.22 0 26.59 21.69 45.96 47.82 42.92 6.3-.47 17.73-5.37 29.63-12.13 71.15-40.59 118.74-99.38 136.23-168.43 9.57-37.79 6.3-71.85-9.1-97.28-10.02-16.32-29.85-34.04-48.28-42.91-16.33-7.93-19.13-8.63-43.16-9.1-20.06-.7-28.22.24-37.32 3.27z" />
  </svg>
);

const SvgFormula = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" xmlSpace="preserve" {...props}>
    <path d="M873.6 451.8c6.1-6.1 12.3-12.3 18.4-12.3h85.7c6.1 0 12.3-6.1 12.3-12.2v-98c0-6.1-6.1-12.2-12.3-12.2h-98c-6.1 0-18.4 6.1-18.4 12.2L757.2 439.5c-6.1 6.1-12.2 6.1-12.2 0l-55.1-110.3c-6.1-6.1-12.3-12.2-18.4-12.2H512.2c-6.1 0-12.3 6.1-12.3 12.2v98c0 6.1 6.1 12.2 12.3 12.2h98c6.1 0 12.3 6.1 18.4 12.3l36.7 79.6v18.4L555.1 678.4c-6.1 0-12.2 6.1-18.4 6.1H451c-6.1 0-12.3 6.1-12.3 12.2v98c0 6.1 6.1 12.3 12.3 12.3h98c6.1 0 18.4-6.1 18.4-12.3l140.9-159.2c6.1-6.1 12.3-6.1 12.3 0l79.6 159.2c0 6.1 12.3 12.3 18.4 12.3h98c6.1 0 12.3-6.1 12.3-12.3v-98c0-6.1-6.1-12.2-12.3-12.2h-36.7c-6.1 0-12.2-6.1-18.4-12.3l-61.3-122.5v-18.4l73.4-79.5zM371.4 72c-30.6 24.5-61.3 61.3-79.6 122.5L261.1 317H83.5c-6.1 0-12.3 6.1-12.3 12.2v98c0 6.1 6.1 12.2 12.3 12.2h147L138.6 807c-18.4 73.5-67.4 61.3-67.4 61.3H10v122.5h61.3c49 0 98-6.1 122.5-36.8 30.6-30.6 49-85.8 61.3-147L347 439.5h140.9c6.1 0 12.3-6.1 12.3-12.2v-98c0-6.1-6.1-12.2-12.3-12.2H377.5l30.6-116.4c6.1-18.4 36.8-49 55.1-61.3 67.4-49 159.3-18.4 220.5-6.1V29.1C622.5 16.9 487.8-26 371.4 72z" />
  </svg>
);
