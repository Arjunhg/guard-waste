import { useState, useEffect } from 'react';

// custom hook
export function useMediaQuery(query: string): boolean {

  const [matches, setMatches] = useState(false);

  useEffect(() => {

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    // deprecated
    media.addListener(listener);
    return () => media.removeListener(listener);
    
  }, [matches, query]);

  return matches;
}