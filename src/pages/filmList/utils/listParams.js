// The filter and the page of the list are kept in the URL query, so they
// survive a page reload and a visit to a film page and back

export const PAGE_SIZE = 5;

const FIRST_PAGE = 1;
// film-service keeps page numbers and years in a Java int
const MAX_INT = 2 ** 31 - 1;
const POSITIVE_INTEGER = /^[1-9]\d*$/;

export const EMPTY_FILTER = {
  country: '',
  directorId: '',
  year: '',
};

const isPositiveInt = (value) => POSITIVE_INTEGER.test(value)
  && Number(value) <= MAX_INT;

export const isValidYearFilter = (value) => !value || isPositiveInt(value);

// Values that a user could break by editing the URL are replaced by defaults
const positiveIntOrEmpty = (value) => (isPositiveInt(value) ? value : '');

export const parseListParams = (locationSearch) => ({
  filter: {
    country: locationSearch.country || EMPTY_FILTER.country,
    directorId: positiveIntOrEmpty(locationSearch.directorId),
    year: positiveIntOrEmpty(locationSearch.year),
  },
  page: isPositiveInt(locationSearch.page)
    ? Number(locationSearch.page)
    : FIRST_PAGE,
});

/**
 * Puts the list params into the URL query. Other params (e.g. "lang") are
 * kept, empty filter values are removed.
 */
export const toLocationSearch = (locationSearch, { filter, page }) => Object
  .fromEntries(Object
    .entries({
      ...locationSearch,
      ...filter,
      page: String(page),
    })
    .filter(([, value]) => value));

export const toFirstPage = (filter) => ({
  filter,
  page: FIRST_PAGE,
});

/**
 * Returns [fieldName, value] pairs of the filter fields that have a value.
 */
export const getActiveFilters = (filter) => Object.entries(filter)
  .filter(([, value]) => value);

export const toFilmPageRequest = ({ filter, page }) => ({
  country: filter.country || null,
  directorId: filter.directorId ? Number(filter.directorId) : null,
  page: page - FIRST_PAGE, // the service counts pages from 0
  size: PAGE_SIZE,
  year: filter.year ? Number(filter.year) : null,
});
