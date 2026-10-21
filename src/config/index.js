const config = {
  // Services
  // film-service allows requests from this UI (CORS), see its README
  FILMS_SERVICE: 'http://localhost:8080',
  USERS_SERVICE: 'http://localhost:3000',
  UI_URL_PREFIX: process.env.REACT_APP_UI_URL_PREFIX || '',
};

export default config;
