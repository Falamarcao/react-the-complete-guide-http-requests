import { Place } from '../../models/Place';
import { sortPlacesByDistance } from './loc';

export class PlacesService {
  private baseUrl = 'http://localhost:3000/';

  fetch = async (): Promise<Place[]> => {
    const url = new URL('places', this.baseUrl);
    const response = await fetch(url);

    if (response.status === 200) {
      const data = await response.json();
      return data.places;
    } else if (!response.ok) {
      throw new Error('Failed to fetch places');
    }

    return [];
  };

  orderedByGeoLocation = async (): Promise<Place[]> => {
    const places: Place[] = await this.fetch();

    return new Promise<Place[]>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(sortedPlaces);
        },
        (error) => reject(new Error(error.message))
      );
    });
  };
}
