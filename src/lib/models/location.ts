export interface City {
  name: string;
  isCapital?: boolean;
}

export interface Province {
  name: string;
  cities: City[];
}
