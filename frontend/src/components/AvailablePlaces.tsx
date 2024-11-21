import { useEffect, useState } from 'react';

import { Place } from '../models/Place.ts';

import { PlacesService } from '../services/PlacesService';

import ErrorPage from './ErrorPage.tsx';
import Places from './Places';

interface AvailablePlacesProps {
  onSelectPlace: (place: Place) => void;
}

const placesService = new PlacesService();

export default function AvailablePlaces({
  onSelectPlace,
}: AvailablePlacesProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    placesService
      .orderedByGeoLocation()
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
