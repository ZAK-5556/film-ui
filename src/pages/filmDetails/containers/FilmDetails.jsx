import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import * as pages from 'constants/pages';
import Alert from 'components/Alert';
import Button from 'components/Button';
import Card from 'components/Card';
import CardActions from 'components/CardActions';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import IconArrowBack from 'components/icons/ArrowBack';
import IconButton from 'components/IconButton';
import IconEdit from 'components/icons/Edit';
import Loading from 'components/Loading';
import { NEW_FILM_ID } from 'constants/films';
import pagesURLs from 'constants/pagesURLs';
import React, { useCallback, useEffect, useState } from 'react';
import Snackbar from 'components/Snackbar';
import Typography from 'components/Typography';
import {
  createFilm,
  getFilm,
  updateFilm,
} from 'misc/requests/films';
import useDirectors from 'misc/hooks/useDirectors';
import useChangePage from 'misc/hooks/useChangePage';
import useTheme from 'misc/hooks/useTheme';

import FilmForm from '../components/FilmForm';
import FilmView from '../components/FilmView';
import {
  toFormErrors,
  toFormValues,
  toSaveRequest,
  validateFilmForm,
} from '../utils/filmForm';

const getClasses = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(2)}px`,
  },
  toolbar: {
    display: 'flex',
  },
}));

function FilmDetails() {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });
  const changePage = useChangePage();
  const { filmId } = useParams();
  const isNewFilm = filmId === NEW_FILM_ID;
  const {
    directors,
    isFailed: isDirectorsLoadFailed,
  } = useDirectors();

  const [filmState, setFilmState] = useState({
    film: null,
    loadError: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    errors: {},
    values: toFormValues(null),
  });
  const [saveState, setSaveState] = useState({
    error: null,
    isSaving: false,
  });
  const [notification, setNotification] = useState({
    isOpened: false,
    message: '',
  });

  const { film } = filmState;

  const startEditing = useCallback((editedFilm) => {
    setForm({
      errors: {},
      values: toFormValues(editedFilm),
    });
    setSaveState({
      error: null,
      isSaving: false,
    });
    setIsEditing(true);
  }, []);

  useEffect(() => {
    if (isNewFilm) {
      startEditing(null);
      return undefined;
    }
    let isActual = true;
    setIsEditing(false);
    getFilm(filmId)
      .then((loadedFilm) => isActual && setFilmState({
        film: loadedFilm,
        loadError: null,
      }))
      .catch((error) => isActual && setFilmState({
        film: null,
        loadError: error,
      }));
    return () => {
      isActual = false;
    };
  }, [filmId, isNewFilm, startEditing]);

  const backToList = () => changePage({
    pathname: `${pagesURLs[pages.filmList]}`,
  });

  const onFieldChange = (fieldName, value) => setForm(prevForm => {
    // the error of the edited field is hidden until the next saving
    const { [fieldName]: fixedError, ...errors } = prevForm.errors;
    return {
      errors,
      values: {
        ...prevForm.values,
        [fieldName]: value,
      },
    };
  });

  const onCancel = () => {
    if (isNewFilm) {
      backToList();
    } else {
      // the form is filled from the film again on the next editing
      setIsEditing(false);
    }
  };

  const onSaved = (savedFilm) => {
    setFilmState({
      film: savedFilm,
      loadError: null,
    });
    setIsEditing(false);
    setSaveState({
      error: null,
      isSaving: false,
    });
    setNotification({
      isOpened: true,
      message: formatMessage(
        { id: isNewFilm ? 'notification.created' : 'notification.updated' },
        { title: savedFilm.title }
      ),
    });
    if (isNewFilm) {
      changePage({
        pathname: `${pagesURLs[pages.filmDetails]}/${savedFilm.id}`,
        replace: true,
      });
    }
  };

  const onSave = () => {
    const errors = validateFilmForm(form.values);
    if (Object.keys(errors).length) {
      setForm({
        ...form,
        errors,
      });
      return;
    }
    setSaveState({
      error: null,
      isSaving: true,
    });
    const request = toSaveRequest(form.values);
    (isNewFilm ? createFilm(request) : updateFilm(film.id, request))
      .then(onSaved)
      .catch((error) => {
        setSaveState({
          error,
          isSaving: false,
        });
        // the service checks the fields too, its errors are shown the same way
        setForm(prevForm => ({
          ...prevForm,
          errors: toFormErrors(error.fieldErrors),
        }));
      });
  };

  const renderSaveError = () => (
    <Alert
      title={formatMessage({
        id: isNewFilm ? 'save.failedCreate' : 'save.failedUpdate',
      })}
    >
      {saveState.error.message}
    </Alert>
  );

  const renderForm = () => (
    <Card>
      <CardTitle>
        <Typography variant="title">
          <strong>
            {formatMessage({
              id: isNewFilm ? 'form.titleCreate' : 'form.titleEdit',
            })}
          </strong>
        </Typography>
      </CardTitle>
      {saveState.error && (
        <CardContent>
          {renderSaveError()}
        </CardContent>
      )}
      <CardContent>
        <FilmForm
          directors={directors}
          errors={form.errors}
          isDirectorsLoadFailed={isDirectorsLoadFailed}
          isDisabled={saveState.isSaving}
          onChange={onFieldChange}
          values={form.values}
        />
      </CardContent>
      <CardActions>
        <Button
          colorVariant="secondary"
          disabled={saveState.isSaving}
          onClick={onCancel}
        >
          <Typography color="inherit">
            {formatMessage({ id: 'button.cancel' })}
          </Typography>
        </Button>
        <Button
          isLoading={saveState.isSaving}
          onClick={onSave}
          variant="primary"
        >
          <Typography color="inherit">
            <strong>
              {formatMessage({
                id: isNewFilm ? 'button.create' : 'button.save',
              })}
            </strong>
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );

  const renderView = () => (
    <Card>
      <CardTitle>
        <Typography variant="title">
          <strong>
            {film.title}
          </strong>
        </Typography>
        <IconButton onClick={() => startEditing(film)}>
          <IconEdit size={24} />
        </IconButton>
      </CardTitle>
      <CardContent>
        <FilmView film={film} />
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (isEditing) {
      return renderForm();
    }
    if (film) {
      return renderView();
    }
    if (filmState.loadError) {
      return (
        <Loading variant="error">
          <Typography color="error">
            {formatMessage({ id: 'load.failed' })}
          </Typography>
          <Typography color="secondary">
            {filmState.loadError.message}
          </Typography>
        </Loading>
      );
    }
    return <Loading />;
  };

  return (
    <div className={classes.container}>
      <div className={classes.toolbar}>
        <Button
          colorVariant="secondary"
          disabled={saveState.isSaving}
          onClick={backToList}
          startIcon={<IconArrowBack size={20} />}
          variant="text"
        >
          <Typography color="inherit">
            {formatMessage({ id: 'button.back' })}
          </Typography>
        </Button>
      </div>
      {renderContent()}
      <Snackbar
        message={notification.message}
        onClose={() => setNotification({
          ...notification,
          isOpened: false,
        })}
        open={notification.isOpened}
      />
    </div>
  );
}

export default FilmDetails;
