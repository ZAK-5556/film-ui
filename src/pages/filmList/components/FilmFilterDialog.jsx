import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import DirectorSelect from 'misc/components/DirectorSelect';
import Button from 'components/Button';
import Card from 'components/Card';
import CardActions from 'components/CardActions';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import Dialog from 'components/Dialog';
import IconButton from 'components/IconButton';
import IconClose from 'components/icons/Close';
import React, { useState } from 'react';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';

import {
  EMPTY_FILTER,
  isValidYearFilter,
} from '../utils/listParams';

const getClasses = createUseStyles((theme) => ({
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(2)}px`,
  },
  spacer: {
    flexGrow: 1,
  },
}));

/**
 * Edits a copy of the filter, which is passed to onApply only on "Apply".
 */
function FilmFilterDialog({
  directors,
  filter,
  isDirectorsLoadFailed,
  onApply,
  onClose,
}) {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });
  const [values, setValues] = useState(filter);
  const [isYearInvalid, setIsYearInvalid] = useState(false);

  const changeValue = (fieldName, value) => setValues({
    ...values,
    [fieldName]: value,
  });

  const onApplyClick = () => {
    const year = values.year.trim();
    if (!isValidYearFilter(year)) {
      setIsYearInvalid(true);
      return;
    }
    onApply({
      country: values.country.trim(),
      directorId: values.directorId,
      year,
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open
    >
      <Card>
        <CardTitle>
          <Typography variant="title">
            {formatMessage({ id: 'filter.title' })}
          </Typography>
          <IconButton onClick={onClose}>
            <IconClose size={24} />
          </IconButton>
        </CardTitle>
        <CardContent>
          <div className={classes.fields}>
            <DirectorSelect
              anyDirectorLabel={formatMessage({
                id: 'filter.field.director.any',
              })}
              directors={directors}
              helperText={isDirectorsLoadFailed
                && formatMessage({ id: 'directorsLoadFailed' })}
              isError={isDirectorsLoadFailed}
              label={formatMessage({ id: 'filter.field.director' })}
              onChange={(value) => changeValue('directorId', value)}
              value={values.directorId}
            />
            <TextField
              helperText={formatMessage({
                id: isYearInvalid
                  ? 'filter.field.year.invalid'
                  : 'filter.field.year.hint',
              })}
              isError={isYearInvalid}
              label={formatMessage({ id: 'filter.field.year' })}
              onChange={({ target }) => {
                setIsYearInvalid(false);
                changeValue('year', target.value);
              }}
              value={values.year}
            />
            <TextField
              helperText={formatMessage({ id: 'filter.field.country.hint' })}
              label={formatMessage({ id: 'filter.field.country' })}
              onChange={({ target }) => changeValue('country', target.value)}
              value={values.country}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button
            colorVariant="secondary"
            onClick={() => {
              setIsYearInvalid(false);
              setValues(EMPTY_FILTER);
            }}
            variant="text"
          >
            <Typography color="inherit">
              {formatMessage({ id: 'filter.button.clear' })}
            </Typography>
          </Button>
          <div className={classes.spacer} />
          <Button
            colorVariant="secondary"
            onClick={onClose}
          >
            <Typography color="inherit">
              {formatMessage({ id: 'filter.button.cancel' })}
            </Typography>
          </Button>
          <Button
            onClick={onApplyClick}
            variant="primary"
          >
            <Typography color="inherit">
              <strong>
                {formatMessage({ id: 'filter.button.apply' })}
              </strong>
            </Typography>
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
}

export default FilmFilterDialog;
