import {
  errorCodes,
  MAX_COUNTRY_LENGTH,
  MAX_GENRES_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_YEAR,
  MIN_YEAR,
  parseGenres,
  toFormErrors,
  toFormValues,
  toSaveRequest,
  validateFilmForm,
} from './filmForm';

const FILM = {
  country: 'USA',
  director: {
    id: 1,
    name: 'Christopher Nolan',
  },
  genres: 'Sci-Fi, Thriller, Action',
  id: 7,
  title: 'Inception',
  year: 2010,
};

const VALID_VALUES = {
  country: 'USA',
  directorId: '1',
  genres: 'Sci-Fi, Thriller, Action',
  title: 'Inception',
  year: '2010',
};

const validateField = (fieldName, value) => validateFilmForm({
  ...VALID_VALUES,
  [fieldName]: value,
})[fieldName];

describe('toFormValues', () => {
  it('converts a film to string values of the form fields', () => {
    // when
    const result = toFormValues(FILM);

    // then
    expect(result).toEqual(VALID_VALUES);
  });

  it('uses empty strings for the optional fields that the film has not', () => {
    // given
    const film = {
      ...FILM,
      country: null,
      genres: null,
    };

    // when
    const result = toFormValues(film);

    // then
    expect(result.country).toBe('');
    expect(result.genres).toBe('');
  });

  it('returns empty values for a new film', () => {
    // when
    const result = toFormValues(null);

    // then
    expect(result).toEqual({
      country: '',
      directorId: '',
      genres: '',
      title: '',
      year: '',
    });
  });
});

describe('parseGenres', () => {
  it('splits genres by comma, trims them and skips empty and repeated ones', () => {
    // when
    const result = parseGenres(' Drama,, Comedy ,  , Drama');

    // then
    expect(result).toEqual(['Drama', 'Comedy']);
  });
});

describe('toSaveRequest', () => {
  it('converts the form values to the request of film-service', () => {
    // given
    const values = {
      country: ' South Korea ',
      directorId: '3',
      genres: 'Thriller,Drama , Comedy',
      title: '  Parasite ',
      year: '2019',
    };

    // when
    const result = toSaveRequest(values);

    // then
    expect(result).toEqual({
      country: 'South Korea',
      directorId: 3,
      genres: 'Thriller, Drama, Comedy',
      title: 'Parasite',
      year: 2019,
    });
  });
});

describe('validateFilmForm', () => {
  it('returns no errors for valid values', () => {
    // when
    const result = validateFilmForm(VALID_VALUES);

    // then
    expect(result).toEqual({});
  });

  it('allows empty country and genres', () => {
    // given
    const values = {
      ...VALID_VALUES,
      country: '',
      genres: '',
    };

    // when
    const result = validateFilmForm(values);

    // then
    expect(result).toEqual({});
  });

  it('returns an error for every empty required field', () => {
    // given
    const values = toFormValues(null);

    // when
    const result = validateFilmForm(values);

    // then
    const required = { code: errorCodes.REQUIRED };
    expect(result).toEqual({
      directorId: required,
      title: required,
      year: required,
    });
  });

  it('treats a blank title as empty', () => {
    // when
    const result = validateField('title', '   ');

    // then
    expect(result).toEqual({ code: errorCodes.REQUIRED });
  });

  it.each([
    ['title', MAX_TITLE_LENGTH],
    ['country', MAX_COUNTRY_LENGTH],
    ['genres', MAX_GENRES_LENGTH],
  ])('limits the length of %s to %i characters', (fieldName, maxLength) => {
    // when
    const errorOfMaxLength = validateField(fieldName, 'a'.repeat(maxLength));
    const errorOfLongerText = validateField(
      fieldName,
      'a'.repeat(maxLength + 1)
    );

    // then
    expect(errorOfMaxLength).toBeUndefined();
    expect(errorOfLongerText).toEqual({
      code: errorCodes.TOO_LONG,
      max: maxLength,
    });
  });

  it.each([
    'abc',
    '-5',
    '2010.5',
    String(MIN_YEAR - 1),
    String(MAX_YEAR + 1),
  ])('rejects "%s" as a year', (year) => {
    // when
    const result = validateField('year', year);

    // then
    expect(result).toEqual({
      code: errorCodes.INVALID_YEAR,
      max: MAX_YEAR,
      min: MIN_YEAR,
    });
  });

  it.each([MIN_YEAR, MAX_YEAR])('accepts %i as a year', (year) => {
    // when
    const result = validateField('year', String(year));

    // then
    expect(result).toBeUndefined();
  });
});

describe('toFormErrors', () => {
  it('converts field errors of film-service to the form errors', () => {
    // given
    const serverFieldErrors = { title: 'must not be blank' };

    // when
    const result = toFormErrors(serverFieldErrors);

    // then
    expect(result).toEqual({
      title: {
        code: errorCodes.SERVER,
        message: 'must not be blank',
      },
    });
  });

  it('returns no errors when the service did not send field errors', () => {
    // when
    const result = toFormErrors(undefined);

    // then
    expect(result).toEqual({});
  });
});
