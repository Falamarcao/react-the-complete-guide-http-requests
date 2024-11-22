import { Place } from '../models/Place.ts';

import { PlacesService } from '../services/PlacesService';

import useFetch from '../hooks/useFetch.ts';

import ErrorPage from './ErrorPage.tsx';
import Places from './Places';

interface AvailablePlacesProps {
  onSelectPlace: (place: Place) => void;
}

const placesService = PlacesService.getInstance();

export default function AvailablePlaces({
  onSelectPlace,
}: AvailablePlacesProps) {
  const {
    isLoading,
    errorState,
    fetchedData: availablePlaces,
  } = useFetch<Place[]>(placesService.orderedByGeoLocation, []);

  if (errorState)
    return <ErrorPage title="An error occured" message={errorState.message} />;

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
