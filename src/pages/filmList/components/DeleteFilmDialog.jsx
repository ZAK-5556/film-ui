import { useIntl } from 'react-intl';
import Alert from 'components/Alert';
import Button from 'components/Button';
import Card from 'components/Card';
import CardActions from 'components/CardActions';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import Dialog from 'components/Dialog';
import IconButton from 'components/IconButton';
import IconClose from 'components/icons/Close';
import React, { useState } from 'react';
import Typography from 'components/Typography';
import { deleteFilm } from 'misc/requests/films';

/**
 * Asks to confirm the deletion and deletes the film. If the deletion fails,
 * the dialog stays opened and shows the error.
 */
function DeleteFilmDialog({
  film,
  onCancel,
  onDeleted,
}) {
  const { formatMessage } = useIntl();
  const [state, setState] = useState({
    error: null,
    isDeleting: false,
  });

  const onConfirm = () => {
    setState({
      error: null,
      isDeleting: true,
    });
    deleteFilm(film.id)
      .then(() => onDeleted(film))
      .catch((error) => setState({
        error,
        isDeleting: false,
      }));
  };

  const onClose = () => {
    if (!state.isDeleting) {
      onCancel();
    }
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
            {formatMessage({ id: 'delete.title' })}
          </Typography>
          <IconButton
            disabled={state.isDeleting}
            onClick={onClose}
          >
            <IconClose size={24} />
          </IconButton>
        </CardTitle>
        <CardContent>
          <Typography>
            {formatMessage(
              { id: 'delete.question' },
              { title: film.title }
            )}
          </Typography>
        </CardContent>
        {state.error && (
          <CardContent>
            <Alert title={formatMessage({ id: 'delete.failed' })}>
              {state.error.message}
            </Alert>
          </CardContent>
        )}
        <CardActions>
          <Button
            colorVariant="secondary"
            disabled={state.isDeleting}
            onClick={onClose}
          >
            <Typography color="inherit">
              {formatMessage({ id: 'delete.button.cancel' })}
            </Typography>
          </Button>
          <Button
            isLoading={state.isDeleting}
            onClick={onConfirm}
            variant="primary"
          >
            <Typography color="inherit">
              <strong>
                {formatMessage({ id: 'delete.button.confirm' })}
              </strong>
            </Typography>
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
}

export default DeleteFilmDialog;
