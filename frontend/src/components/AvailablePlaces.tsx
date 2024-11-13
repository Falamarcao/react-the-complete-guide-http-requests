import { useEffect, useState } from 'react';
import { Place } from '../models/Place.ts';

import Places from './Places';

interface AvailablePlacesProps {
  onSelectPlace: (place: Place) => void;
}

const fetchPlaces = async (): Promise<Place[]> => {
  const response = await fetch('http://localhost:3000/places');

  if (response.status === 200) {
    return (await response.json()).places as Place[];
  }

  return [];
};

export default function AvailablePlaces({
  onSelectPlace,
}: AvailablePlacesProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetchPlaces().then((places: Place[]) => {
      setAvailablePlaces(places);
      setIsLoading(false);
    });
  }, []);

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
