import FilmListPage from 'pages/filmList';
import React from 'react';

import PageContainer from './components/PageContainer';

const FilmList = (props) => {
  return (
    <PageContainer>
      <FilmListPage {...props} />
    </PageContainer>
  );
};

export default FilmList;
