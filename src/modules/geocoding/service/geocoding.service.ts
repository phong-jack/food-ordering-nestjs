import { BadRequestException, Injectable } from '@nestjs/common';
import opencage from 'opencage-api-client';
import { GeocodingReponse } from '../interfaces/geocoding.response';

@Injectable()
export class GeocodingService {
  async findByAddress(address: string): Promise<GeocodingReponse> {
    try {
      const response = await opencage.geocode({ q: address, language: 'vn' });
      const { results } = response;
      const place = results[0];

      const placeObj: GeocodingReponse = {
        name: `${place.formatted}`,
        geometry: place.geometry,
        road: place.components.road,
        suburb: place.components.suburb,
        city: place.components.city,
        country: place.components.country,
      };
      return placeObj;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}
