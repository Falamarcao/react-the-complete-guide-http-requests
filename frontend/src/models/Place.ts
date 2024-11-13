export interface Place {
  id: string;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  lat: number;
  lon: number;
}
