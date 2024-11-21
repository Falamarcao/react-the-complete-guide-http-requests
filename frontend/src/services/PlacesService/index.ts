import { Place } from '../../models/Place';
import { sortPlacesByDistance } from './loc';

export class PlacesService {
  private static instance: PlacesService;
  private baseUrl = 'http://localhost:3000/';

  private constructor() {}

  static getInstance(): PlacesService {
    if (this.instance == null) {
      this.instance = new PlacesService();
    }
    return this.instance;
  }

  getPlaces = async (): Promise<Place[]> => {
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
    const places: Place[] = await this.getPlaces();

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

  getUserPlaces = async (): Promise<Place[]> => {
    const url = new URL('user-places', this.baseUrl);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch user places');
    }

    const data = await response.json();

    return data.places;
  };

  updateUserPlaces = async (places: Place[]) => {
    const url = new URL('user-places', this.baseUrl);

    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ places: places }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to update user data.');
    }

    const data = await response.json();

    return data.message;
  };
}
