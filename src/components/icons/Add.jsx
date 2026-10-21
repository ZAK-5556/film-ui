import React from 'react';
import SvgIcon from '../SvgIcon';
import useTheme from 'misc/hooks/useTheme';

const Add = ({
  color = 'default', // default | header | error | success | warning | info | <string>
  size = 32,
}) => {
  const { theme } = useTheme();
  const actualColor = theme.icon.color[color] || color;
  return (
    <SvgIcon
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      viewBox="0 0 24 24"
    >
      <path
        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
        fill={actualColor}
      />
    </SvgIcon>
  );
};

export default Add;
