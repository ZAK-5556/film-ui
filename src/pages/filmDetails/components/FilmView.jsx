import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import Chip from 'components/Chip';
import React from 'react';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';

import { parseGenres } from '../utils/filmForm';

const getClasses = createUseStyles((theme) => ({
  fields: {
    alignItems: 'center',
    display: 'grid',
    gap: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    gridTemplateColumns: 'max-content 1fr',
  },
  genres: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${theme.spacing(1)}px`,
  },
}));

const NO_VALUE = '—';

function FilmView({
  film,
}) {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const renderLabel = (fieldName) => (
    <Typography color="secondary">
      {formatMessage({ id: `field.${fieldName}` })}
    </Typography>
  );

  const genres = parseGenres(film.genres || '');

  return (
    <div className={classes.fields}>
      {renderLabel('directorId')}
      <Typography variant="subtitle">
        {film.director.name}
      </Typography>
      {renderLabel('year')}
      <Typography variant="subtitle">
        {film.year}
      </Typography>
      {renderLabel('country')}
      <Typography variant="subtitle">
        {film.country || NO_VALUE}
      </Typography>
      {renderLabel('genres')}
      {genres.length
        ? (
          <div className={classes.genres}>
            {genres.map(genre => (
              <Chip
                key={genre}
                label={genre}
              />
            ))}
          </div>
        )
        : (
          <Typography variant="subtitle">
            {NO_VALUE}
          </Typography>
        )}
    </div>
  );
}

export default FilmView;
