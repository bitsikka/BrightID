// @flow

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BLACK } from '@/theme/colors';

type Props = {
  color: string,
  width: number,
  height: number,
};

const Certificate = ({ color = BLACK, width = 24, height = 24 }: Props) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4,3C2.89,3 2,3.89 2,5V15A2,2 0 0,0 4,17H12V22L15,19L18,22V17H20A2,2 0 0,0 22,15V8L22,6V5A2,2 0 0,0 20,3H16V3H4M12,5L15,7L18,5V8.5L21,10L18,11.5V15L15,13L12,15V11.5L9,10L12,8.5V5M4,5H9V7H4V5M4,9H7V11H4V9M4,13H9V15H4V13Z"
      fill={color}
    />
  </Svg>
);

export default Certificate;
