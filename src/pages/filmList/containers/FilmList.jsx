import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import * as pages from 'constants/pages';
import Button from 'components/Button';
import Card from 'components/Card';
import Chip from 'components/Chip';
import classNames from 'classnames';
import IconAdd from 'components/icons/Add';
import IconFilter from 'components/icons/Filter';
import Loading from 'components/Loading';
import { NEW_FILM_ID } from 'constants/films';
import pagesURLs from 'constants/pagesURLs';
import Pagination from 'components/Pagination';
import React, { useEffect, useMemo, useState } from 'react';
import Snackbar from 'components/Snackbar';
import Typography from 'components/Typography';
import { getFilmPage } from 'misc/requests/films';
import useDirectors from 'misc/hooks/useDirectors';
import useChangePage from 'misc/hooks/useChangePage';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import useTheme from 'misc/hooks/useTheme';

import FilmFilterDialog from '../components/FilmFilterDialog';
import FilmListItem from '../components/FilmListItem';
import DeleteFilmDialog from '../components/DeleteFilmDialog';
import {
  getActiveFilters,
  parseListParams,
  toFilmPageRequest,
  toFirstPage,
  toLocationSearch,
} from '../utils/listParams';

const getClasses = createUseStyles((theme) => ({
  activeFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${theme.spacing(1)}px`,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(2)}px`,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${theme.spacing(1)}px`,
    justifyContent: 'space-between',
  },
  headerActions: {
    display: 'flex',
    gap: `${theme.spacing(1)}px`,
  },
  list: {
    transition: 'opacity 0.2s ease-out',
  },
  listLoading: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

// Intl ids of the active filter chips
const filterChipIntlIds = {
  country: 'filter.chip.country',
  directorId: 'filter.chip.director',
  year: 'filter.chip.year',
};

function FilmList() {
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });
  const changePage = useChangePage();
  const locationSearch = useLocationSearch();
  const {
    directors,
    isFailed: isDirectorsLoadFailed,
  } = useDirectors();

  const listParams = useMemo(
    () => parseListParams(locationSearch),
    [locationSearch]
  );

  const [state, setState] = useState({
    films: [],
    isFailed: false,
    isLoading: true,
    totalPages: 0,
  });
  // Changing it loads the same page of films again
  const [reloadCount, setReloadCount] = useState(0);
  const [filmToDelete, setFilmToDelete] = useState(null);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [notification, setNotification] = useState({
    isOpened: false,
    message: '',
  });

  useEffect(() => {
    let isActual = true;
    setState(prevState => ({
      ...prevState,
      isFailed: false,
      isLoading: true,
    }));
    getFilmPage(toFilmPageRequest(listParams))
      .then(({ list, totalPages }) => isActual && setState({
        films: list,
        isFailed: false,
        isLoading: false,
        totalPages,
      }))
      .catch(() => isActual && setState({
        films: [],
        isFailed: true,
        isLoading: false,
        totalPages: 0,
      }));
    return () => {
      isActual = false;
    };
  }, [listParams, reloadCount]);

  const changeListParams = (newListParams, { replace } = {}) => changePage({
    locationSearch: toLocationSearch(locationSearch, newListParams),
    replace,
  });

  const openFilm = (filmId) => changePage({
    pathname: `${pagesURLs[pages.filmDetails]}/${filmId}`,
  });

  const getDirectorName = (directorId) => directors
    .find(director => String(director.id) === directorId)?.name || directorId;

  const onFilmDeleted = (film) => {
    setFilmToDelete(null);
    setNotification({
      isOpened: true,
      message: formatMessage({ id: 'delete.success' }, { title: film.title }),
    });
    // the films are loaded again right below
    setState(prevState => ({
      ...prevState,
      films: prevState.films.filter(({ id }) => id !== film.id),
      isLoading: true,
    }));
    const wasLastFilmOnPage = state.films.length === 1 && listParams.page > 1;
    if (wasLastFilmOnPage) {
      // the page does not exist anymore, so it is replaced in the history
      changeListParams({
        ...listParams,
        page: listParams.page - 1,
      }, { replace: true });
    } else {
      // the next films move up to the current page
      setReloadCount(count => count + 1);
    }
  };

  const activeFilters = getActiveFilters(listParams.filter);

  const getEmptyListIntlId = () => {
    if (state.totalPages) {
      // e.g. the page number in the URL is greater than the number of pages
      return 'list.emptyPage';
    }
    return activeFilters.length ? 'list.emptyFiltered' : 'list.empty';
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="title">
          <strong>
            {formatMessage({ id: 'title' })}
          </strong>
        </Typography>
        <div className={classes.headerActions}>
          <Button
            colorVariant="secondary"
            onClick={() => setIsFilterOpened(true)}
            startIcon={<IconFilter size={20} />}
          >
            <Typography color="inherit">
              {activeFilters.length
                ? formatMessage(
                  { id: 'button.filterWithCount' },
                  { count: activeFilters.length }
                )
                : formatMessage({ id: 'button.filter' })}
            </Typography>
          </Button>
          <Button
            onClick={() => openFilm(NEW_FILM_ID)}
            startIcon={(
              <IconAdd
                color={theme.button.color.primary.text}
                size={20}
              />
            )}
            variant="primary"
          >
            <Typography color="inherit">
              <strong>
                {formatMessage({ id: 'button.add' })}
              </strong>
            </Typography>
          </Button>
        </div>
      </div>
      {!!activeFilters.length && (
        <div className={classes.activeFilters}>
          {activeFilters.map(([fieldName, value]) => (
            <Chip
              key={fieldName}
              label={formatMessage(
                { id: filterChipIntlIds[fieldName] },
                {
                  value: fieldName === 'directorId'
                    ? getDirectorName(value)
                    : value,
                }
              )}
              onDelete={() => changeListParams(toFirstPage({
                ...listParams.filter,
                [fieldName]: '',
              }))}
            />
          ))}
        </div>
      )}
      {state.isFailed && (
        <Loading variant="error">
          <Typography color="error">
            {formatMessage({ id: 'list.loadFailed' })}
          </Typography>
          <Button
            colorVariant="secondary"
            onClick={() => setReloadCount(count => count + 1)}
          >
            <Typography color="inherit">
              {formatMessage({ id: 'list.retry' })}
            </Typography>
          </Button>
        </Loading>
      )}
      {state.isLoading && !state.films.length && (
        <Loading />
      )}
      {!state.isLoading && !state.isFailed && !state.films.length && (
        <Loading variant="noData">
          <Typography color="secondary">
            {formatMessage({ id: getEmptyListIntlId() })}
          </Typography>
        </Loading>
      )}
      {!!state.films.length && (
        <div
          className={classNames(
            classes.list,
            state.isLoading && classes.listLoading
          )}
        >
          <Card disablePaddings>
            {/* the wrapper removes the gaps that the card adds between children */}
            <div>
              {state.films.map(film => (
                <FilmListItem
                  film={film}
                  key={film.id}
                  onClick={() => openFilm(film.id)}
                  onDelete={() => setFilmToDelete(film)}
                />
              ))}
            </div>
          </Card>
        </div>
      )}
      {state.totalPages > 1 && (
        <div className={classes.pagination}>
          <Pagination
            count={state.totalPages}
            onChange={(page) => changeListParams({
              ...listParams,
              page,
            })}
            page={listParams.page}
          />
        </div>
      )}
      {isFilterOpened && (
        <FilmFilterDialog
          directors={directors}
          filter={listParams.filter}
          isDirectorsLoadFailed={isDirectorsLoadFailed}
          onApply={(filter) => {
            setIsFilterOpened(false);
            changeListParams(toFirstPage(filter));
          }}
          onClose={() => setIsFilterOpened(false)}
        />
      )}
      {filmToDelete && (
        <DeleteFilmDialog
          film={filmToDelete}
          onCancel={() => setFilmToDelete(null)}
          onDeleted={onFilmDeleted}
        />
      )}
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

export default FilmList;
