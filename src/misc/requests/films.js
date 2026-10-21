import axios from 'misc/requests';
import config from 'config';

const FILMS_URL = `${config.FILMS_SERVICE}/api/film`;

export const getFilmPage = ({
  country,
  directorId,
  page,
  size,
  year,
}) => axios.post(`${FILMS_URL}/_list`, {
  country,
  directorId,
  page,
  size,
  year,
});

export const getFilm = (id) => axios.get(`${FILMS_URL}/${id}`);

export const createFilm = (film) => axios.post(FILMS_URL, film);

export const updateFilm = (id, film) => axios.put(`${FILMS_URL}/${id}`, film);

export const deleteFilm = (id) => axios.delete(`${FILMS_URL}/${id}`);
