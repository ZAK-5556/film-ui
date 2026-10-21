import React from 'react';
import PaginationMUI from '@mui/material/Pagination';

function Pagination({
  count,
  onChange,
  page,
}) {
  return (
    <PaginationMUI
      count={count}
      onChange={(event, value) => onChange(value)}
      page={page}
      shape="rounded"
    />
  );
}

export default Pagination;
