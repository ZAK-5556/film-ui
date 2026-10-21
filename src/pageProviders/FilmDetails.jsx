import FilmDetailsPage from 'pages/filmDetails';
import React from 'react';

import PageContainer from './components/PageContainer';

const FilmDetails = (props) => {
  return (
    <PageContainer>
      <FilmDetailsPage {...props} />
    </PageContainer>
  );
};

export default FilmDetails;
