export interface IFetchShop {
  page: number;
  count: number;
  type: number;
  CityId: number;
}

export interface IShopResonse {
  Id: number;
  Name: string;
  Address: string;
  AvgRating: number;
  AvgRatingText: string;
  RestaurantStatus: number;
  Phone: string;
  PhotoUrl: string;
  TotalReviews: 72;
  TotalFavourites: 0;
  TotalViews: 0;
  TotalPictures: 972;
  TotalCheckIns: 0;
  Latitude: number;
  Longitude: number;
}
