import axios from 'axios';
import storage, { keys } from '../storage';

axios.interceptors.request.use((params) => {
  const token = storage.getItem(keys.TOKEN);
  if (token) {
    params.headers.setAuthorization(`Bearer ${token}`);
  }
  return params;
});

const addAxiosInterceptors = ({
  onSignOut,
}) => {
  axios.interceptors.response.use(
    (response) => response.data,
    (error) => {
      // Not every service answers with an array of errors (e.g. book-service
      // returns RFC 9457 problem details), and a network error has no response
      const errors = error.response?.data;
      if (Array.isArray(errors)
        && errors.some(beError => beError?.code === 'INVALID_TOKEN')
      ) {
        onSignOut();
      }
      throw errors || error;
    }
  );
};

export {
  addAxiosInterceptors,
};

export default axios;
