import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import * as pages from 'constants/pages';
import Button from 'components/Button';
import Link from 'components/Link';
import pagesURLs from 'constants/pagesURLs';
import React from 'react';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';

const getClasses = createUseStyles((theme) => ({
  container: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(2)}px`,
  },
}));

function Default() {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  return (
    <div className={classes.container}>
      <Typography>
        {formatMessage({ id: 'title' })}
      </Typography>
      <Link
        to={{
          pathname: `${pagesURLs[pages.filmList]}`,
        }}
      >
        <Button variant="primary">
          <Typography color="inherit">
            <strong>
              {formatMessage({ id: 'goToFilms' })}
            </strong>
          </Typography>
        </Button>
      </Link>
    </div>
  );
}

export default Default;
