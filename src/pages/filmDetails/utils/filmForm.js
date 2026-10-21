// Values of the form fields are strings, as the inputs work with strings.
// The limits are the same as in film-service.

export const MAX_COUNTRY_LENGTH = 100;
export const MAX_GENRES_LENGTH = 300;
export const MAX_TITLE_LENGTH = 200;
export const MAX_YEAR = 2100;
export const MIN_YEAR = 1888;

export const errorCodes = {
  INVALID_YEAR: 'INVALID_YEAR',
  REQUIRED: 'REQUIRED',
  SERVER: 'SERVER',
  TOO_LONG: 'TOO_LONG',
};

const GENRES_SEPARATOR = ',';
const INTEGER = /^\d+$/;

/**
 * Splits genres stored as one string, e.g. "Sci-Fi, Drama".
 */
export const parseGenres = (genresText) => [...new Set(genresText
  .split(GENRES_SEPARATOR)
  .map(genre => genre.trim())
  .filter(Boolean))];

const normalizeGenres = (genresText) => parseGenres(genresText)
  .join(`${GENRES_SEPARATOR} `);

/**
 * @param film film from film-service or null for a new film
 */
export const toFormValues = (film) => ({
  country: film?.country || '',
  directorId: film ? String(film.director.id) : '',
  genres: film?.genres || '',
  title: film?.title || '',
  year: film ? String(film.year) : '',
});

export const toSaveRequest = (values) => ({
  country: values.country.trim(),
  directorId: Number(values.directorId),
  genres: normalizeGenres(values.genres),
  title: values.title.trim(),
  year: Number(values.year),
});

const validateRequired = (value) => (value
  ? null
  : { code: errorCodes.REQUIRED });

const validateLength = (value, maxLength) => (value.length > maxLength
  ? {
    code: errorCodes.TOO_LONG,
    max: maxLength,
  }
  : null);

const validateTitle = (text) => {
  const title = text.trim();
  return validateRequired(title) || validateLength(title, MAX_TITLE_LENGTH);
};

const isYearInRange = (year) => INTEGER.test(year)
  && Number(year) >= MIN_YEAR
  && Number(year) <= MAX_YEAR;

const validateYear = (text) => {
  const year = text.trim();
  if (year && !isYearInRange(year)) {
    return {
      code: errorCodes.INVALID_YEAR,
      max: MAX_YEAR,
      min: MIN_YEAR,
    };
  }
  return validateRequired(year);
};

/**
 * Returns errors of the invalid fields as { [fieldName]: { code, ...values
 * for the message } }, or an empty object if all fields are valid.
 */
export const validateFilmForm = (values) => Object.fromEntries(Object
  .entries({
    country: validateLength(values.country.trim(), MAX_COUNTRY_LENGTH),
    directorId: validateRequired(values.directorId),
    genres: validateLength(normalizeGenres(values.genres), MAX_GENRES_LENGTH),
    title: validateTitle(values.title),
    year: validateYear(values.year),
  })
  .filter(([, error]) => error));

/**
 * Converts field errors of film-service ({ [fieldName]: message }) to the
 * form errors, so the fields are highlighted the same way.
 */
export const toFormErrors = (serverFieldErrors = {}) => Object.fromEntries(
  Object.entries(serverFieldErrors).map(([fieldName, message]) => [
    fieldName,
    {
      code: errorCodes.SERVER,
      message,
    },
  ])
);
