import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import DirectorSelect from 'misc/components/DirectorSelect';
import React from 'react';
import TextField from 'components/TextField';
import useTheme from 'misc/hooks/useTheme';

const getClasses = createUseStyles((theme) => ({
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(2)}px`,
  },
}));

/**
 * Fields of a film. Invalid fields are highlighted with the error message.
 * Country and genres are optional.
 */
function FilmForm({
  directors,
  errors,
  isDirectorsLoadFailed,
  isDisabled,
  onChange,
  values,
}) {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const getErrorMessage = (fieldName) => errors[fieldName]
    && formatMessage(
      { id: `validation.${errors[fieldName].code}` },
      errors[fieldName]
    );

  const getFieldProps = (fieldName) => ({
    disabled: isDisabled,
    helperText: getErrorMessage(fieldName),
    isError: !!errors[fieldName],
    label: formatMessage({ id: `field.${fieldName}` }),
    onChange: ({ target }) => onChange(fieldName, target.value),
    required: true,
    value: values[fieldName],
  });

  return (
    <div className={classes.fields}>
      <TextField
        {...getFieldProps('title')}
        autoFocus
      />
      <DirectorSelect
        {...getFieldProps('directorId')}
        directors={directors}
        helperText={getErrorMessage('directorId') || (isDirectorsLoadFailed
          && formatMessage({ id: 'directorsLoadFailed' }))}
        isError={!!errors.directorId || isDirectorsLoadFailed}
        onChange={(value) => onChange('directorId', value)}
      />
      <TextField {...getFieldProps('year')} />
      <TextField
        {...getFieldProps('country')}
        required={false}
      />
      <TextField
        {...getFieldProps('genres')}
        helperText={getErrorMessage('genres')
          || formatMessage({ id: 'field.genres.hint' })}
        required={false}
      />
    </div>
  );
}

export default FilmForm;
