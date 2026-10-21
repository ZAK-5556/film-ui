import axios from 'misc/requests';
import config from 'config';

export const getDirectors = () => axios
  .get(`${config.FILMS_SERVICE}/api/director`);
