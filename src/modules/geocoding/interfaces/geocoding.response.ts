interface Geometry {
  lat: number;
  lng: number;
}

export interface GeocodingReponse {
  name: string;
  geometry: Geometry;
  road: string | null;
  suburb: string | null;
  city: string | null;
  country: string;
}
