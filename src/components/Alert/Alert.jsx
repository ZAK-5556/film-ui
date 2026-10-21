import React from 'react';
import AlertMUI from '@mui/material/Alert';
import AlertTitleMUI from '@mui/material/AlertTitle';

/**
 * Error message that stays on the screen.
 */
function Alert({
  children,
  title,
}) {
  return (
    <AlertMUI severity="error">
      <AlertTitleMUI>
        {title}
      </AlertTitleMUI>
      {children}
    </AlertMUI>
  );
}

export default Alert;
