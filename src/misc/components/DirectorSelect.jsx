import MenuItem from 'components/MenuItem';
import React from 'react';
import TextField from 'components/TextField';
import Typography from 'components/Typography';

const NO_DIRECTOR = '';

/**
 * Select of a director id (as a string).
 *
 * @param anyDirectorLabel if set, an option with this label and an empty
 * value is added before the directors
 */
function DirectorSelect({
  anyDirectorLabel,
  directors,
  disabled,
  helperText,
  isError,
  label,
  onChange,
  required,
  value,
}) {
  // Until the directors are loaded there is no option for the value, and the
  // select would warn about it, so nothing is selected meanwhile
  const isKnownDirector = directors
    .some(director => String(director.id) === value);

  return (
    <TextField
      disabled={disabled}
      helperText={helperText}
      isError={isError}
      label={label}
      onChange={({ target }) => onChange(target.value)}
      required={required}
      select
      value={isKnownDirector ? value : NO_DIRECTOR}
    >
      {anyDirectorLabel && (
        <MenuItem value={NO_DIRECTOR}>
          <Typography>
            {anyDirectorLabel}
          </Typography>
        </MenuItem>
      )}
      {directors.map(director => (
        <MenuItem
          key={director.id}
          value={String(director.id)}
        >
          <Typography>
            {director.name}
          </Typography>
        </MenuItem>
      ))}
    </TextField>
  );
}

export default DirectorSelect;
