export interface IFetchShop {
  page: number;
  count: number;
  type: number;
  CityId: number;
}

export interface IShopResponse {
  Id: number;
  Name: string;
  Address: string;
  AvgRating: number;
  AvgRatingText: string;
  RestaurantStatus: number;
  Phone: string;
  PhotoUrl: string;
  TotalReviews: number;
  TotalFavourites: number;
  TotalViews: number;
  TotalPictures: number;
  TotalCheckIns: number;
  Latitude: number;
  Longitude: number;
}
