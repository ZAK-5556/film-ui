import React from 'react';
import AlertMUI from '@mui/material/Alert';
import SnackbarMUI from '@mui/material/Snackbar';

const AUTO_HIDE_DURATION_MS = 4000;

/**
 * Message about a successful action that hides automatically.
 */
function Snackbar({
  message,
  onClose,
  open,
}) {
  return (
    <SnackbarMUI
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      autoHideDuration={AUTO_HIDE_DURATION_MS}
      onClose={(event, reason) => {
        // a click somewhere on the page should not hide the message at once
        if (reason !== 'clickaway') {
          onClose();
        }
      }}
      open={open}
    >
      <AlertMUI
        onClose={onClose}
        severity="success"
        variant="filled"
      >
        {message}
      </AlertMUI>
    </SnackbarMUI>
  );
}

export default Snackbar;
