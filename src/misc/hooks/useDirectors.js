import { useEffect, useState } from 'react';
import { getDirectors } from 'misc/requests/directors';

/**
 * Loads all directors once, e.g. for a select field.
 * The list stays empty until the directors are loaded or if loading failed.
 */
function useDirectors() {
  const [state, setState] = useState({
    directors: [],
    isFailed: false,
  });

  useEffect(() => {
    let isActual = true;
    getDirectors()
      .then((directors) => isActual && setState({
        directors,
        isFailed: false,
      }))
      .catch(() => isActual && setState({
        directors: [],
        isFailed: true,
      }));
    return () => {
      isActual = false;
    };
  }, []);

  return state;
}

export default useDirectors;
