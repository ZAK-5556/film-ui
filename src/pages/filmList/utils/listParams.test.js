import {
  EMPTY_FILTER,
  getActiveFilters,
  isValidYearFilter,
  PAGE_SIZE,
  parseListParams,
  toFilmPageRequest,
  toFirstPage,
  toLocationSearch,
} from './listParams';

describe('parseListParams', () => {
  it('returns the first page and an empty filter when the query has no list params', () => {
    // given
    const locationSearch = { lang: 'ua' };

    // when
    const result = parseListParams(locationSearch);

    // then
    expect(result).toEqual({
      filter: EMPTY_FILTER,
      page: 1,
    });
  });

  it('reads the filter and the page from the query', () => {
    // given
    const locationSearch = {
      country: 'South Korea',
      directorId: '3',
      lang: 'ua',
      page: '2',
      year: '2019',
    };

    // when
    const result = parseListParams(locationSearch);

    // then
    expect(result).toEqual({
      filter: {
        country: 'South Korea',
        directorId: '3',
        year: '2019',
      },
      page: 2,
    });
  });

  it.each(['0', '-1', 'abc', '1.5', '2147483648'])(
    'falls back to the first page when the page is "%s"',
    (page) => {
      // when
      const result = parseListParams({ page });

      // then
      expect(result.page).toBe(1);
    }
  );

  it.each(['abc', '0', '-2'])(
    'ignores directorId and year "%s"',
    (value) => {
      // when
      const result = parseListParams({
        directorId: value,
        year: value,
      });

      // then
      expect(result.filter).toEqual(EMPTY_FILTER);
    }
  );
});

describe('toLocationSearch', () => {
  it('keeps other params and removes empty filter values', () => {
    // given
    const locationSearch = {
      directorId: '2',
      lang: 'en',
      page: '4',
    };
    const listParams = {
      filter: {
        ...EMPTY_FILTER,
        country: 'Japan',
      },
      page: 1,
    };

    // when
    const result = toLocationSearch(locationSearch, listParams);

    // then
    expect(result).toEqual({
      country: 'Japan',
      lang: 'en',
      page: '1',
    });
  });

  it('is the inverse of parseListParams', () => {
    // given
    const listParams = {
      filter: {
        country: 'USA',
        directorId: '1',
        year: '2014',
      },
      page: 3,
    };

    // when
    const result = parseListParams(toLocationSearch({ lang: 'ua' }, listParams));

    // then
    expect(result).toEqual(listParams);
  });
});

describe('toFirstPage', () => {
  it('returns the given filter with the first page', () => {
    // given
    const filter = {
      ...EMPTY_FILTER,
      year: '2003',
    };

    // when
    const result = toFirstPage(filter);

    // then
    expect(result).toEqual({
      filter,
      page: 1,
    });
  });
});

describe('getActiveFilters', () => {
  it('returns only the filter fields that have a value', () => {
    // given
    const filter = {
      country: 'USA',
      directorId: '',
      year: '2010',
    };

    // when
    const result = getActiveFilters(filter);

    // then
    expect(result).toEqual([
      ['country', 'USA'],
      ['year', '2010'],
    ]);
  });
});

describe('isValidYearFilter', () => {
  it.each(['', '1994', '2026'])('accepts "%s"', (year) => {
    // when
    const result = isValidYearFilter(year);

    // then
    expect(result).toBe(true);
  });

  it.each(['abc', '0', '-1', '19.94', '99999999999'])(
    'rejects "%s"',
    (year) => {
      // when
      const result = isValidYearFilter(year);

      // then
      expect(result).toBe(false);
    }
  );
});

describe('toFilmPageRequest', () => {
  it('converts list params to the request of film-service', () => {
    // given
    const listParams = {
      filter: {
        country: 'Japan',
        directorId: '4',
        year: '2001',
      },
      page: 2,
    };

    // when
    const result = toFilmPageRequest(listParams);

    // then
    expect(result).toEqual({
      country: 'Japan',
      directorId: 4,
      page: 1,
      size: PAGE_SIZE,
      year: 2001,
    });
  });

  it('sends null for empty filter values, so they are not applied', () => {
    // given
    const listParams = {
      filter: EMPTY_FILTER,
      page: 1,
    };

    // when
    const result = toFilmPageRequest(listParams);

    // then
    expect(result).toEqual({
      country: null,
      directorId: null,
      page: 0,
      size: PAGE_SIZE,
      year: null,
    });
  });
});
