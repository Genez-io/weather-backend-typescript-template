export type WeatherError = {
  status: "error";
  type: WeatherErrorType;
};

export type WeatherInfo = {
  status: "ok";
  actualTemperature: string;
  weatherCondition: string;
  location: string;
  humidity: string;
  wind: string;
  precipitation: string;
  pressure: string;
  originalLocation: string;
  localObsTime: string;
};

export enum WeatherErrorType {
  NotFound = "NotFound",
  ServiceDown = "ServiceDown",
  Unknown = "Unknown",
}
