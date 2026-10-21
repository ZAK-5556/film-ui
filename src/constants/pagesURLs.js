import * as pages from './pages';
import config from 'config';

const result = {
  [pages.defaultPage]: `${config.UI_URL_PREFIX}/${pages.defaultPage}`,
  [pages.filmDetails]: `${config.UI_URL_PREFIX}/${pages.filmDetails}`,
  [pages.filmList]: `${config.UI_URL_PREFIX}/${pages.filmList}`,
  [pages.login]: `${config.UI_URL_PREFIX}/${pages.login}`,
  [pages.secretPage]: `${config.UI_URL_PREFIX}/${pages.secretPage}`,
};

export default result;
