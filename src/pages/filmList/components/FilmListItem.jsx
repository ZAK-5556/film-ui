import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import Hover from 'components/Hover';
import IconButton from 'components/IconButton';
import IconDelete from 'components/icons/Delete';
import React from 'react';
import Typography from 'components/Typography';
import useIsMobile from 'misc/hooks/useIsMobile';
import useTheme from 'misc/hooks/useTheme';

const getClasses = createUseStyles((theme) => ({
  container: {
    '&:hover $deleteAction, &:focus-within $deleteAction': {
      visibility: 'visible',
    },
    '&:not(:last-child)': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    },
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    gap: `${theme.spacing(2)}px`,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    width: '100%',
  },
  deleteAction: {
    visibility: 'hidden',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: `${theme.spacing(0.5)}px`,
    minWidth: 0,
  },
  // there is no hover on touch screens, so the button is always shown there
  visible: {
    visibility: 'visible',
  },
}));

function FilmListItem({
  film,
  onClick,
  onDelete,
}) {
  const { theme } = useTheme();
  const classes = getClasses({ theme });
  const isMobile = useIsMobile();

  return (
    <div className={classes.container}>
      <Hover onClick={onClick}>
        <div className={classes.content}>
          <div className={classes.info}>
            <Typography
              noWrap
              variant="subtitle"
            >
              <strong>
                {film.title}
              </strong>
            </Typography>
            <Typography
              color="secondary"
              noWrap
            >
              {film.directorName}
            </Typography>
          </div>
          <Typography color="secondary">
            {film.year}
          </Typography>
          <div
            className={classNames(
              classes.deleteAction,
              isMobile && classes.visible
            )}
          >
            <IconButton
              onClick={(event) => {
                // the click must not open the film
                event.stopPropagation();
                onDelete();
              }}
            >
              <IconDelete
                color="error"
                size={24}
              />
            </IconButton>
          </div>
        </div>
      </Hover>
    </div>
  );
}

export default FilmListItem;
