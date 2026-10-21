import React from 'react';
import ChipMUI from '@mui/material/Chip';

function Chip({
  label,
  onDelete,
}) {
  return (
    <ChipMUI
      label={label}
      onDelete={onDelete}
      size="small"
    />
  );
}

export default Chip;
