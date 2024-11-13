import { useEffect, useState } from 'react';
import { Place } from '../models/Place.ts';

import Places from './Places';
import ErrorPage from './ErrorPage.tsx';

interface AvailablePlacesProps {
  onSelectPlace: (place: Place) => void;
}

const fetchPlaces = async (): Promise<Place[]> => {
  const response = await fetch('http://localhost:3000/places$'); // wrong url to trigger error

  if (response.status === 200) {
    return (await response.json()).places as Place[];
  } else if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  return [];
};

export default function AvailablePlaces({
  onSelectPlace,
}: AvailablePlacesProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchPlaces()
      .then((places: Place[]) => {
        setAvailablePlaces(places);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (errorMessage)
    return <ErrorPage title="An error occured" message={errorMessage} />;

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
