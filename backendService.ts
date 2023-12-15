import { GenezioDeploy } from "@genezio/types";
import {
  WeatherInfo,
  WeatherError,
  WeatherErrorType,
} from "./models/weatherResponse";
import axios, { AxiosError } from "axios";
import { weatherMapping } from "./models/weatherMapping";

@GenezioDeploy()
export class WeatherService {
  favorites: Array<string>;

  constructor() {
    this.favorites = ["London", "Los Angeles", "New York"];
  }

  #mapWeatherCondition(rawCondition: string): string {
    let weatherConditionMapped = "CLEAR_DAY";
    for (const [raw, mapping] of weatherMapping.entries()) {
      if (raw.includes(rawCondition)) {
        weatherConditionMapped = mapping;
        break;
      }
    }
    return weatherConditionMapped;
  }

  async setFavorites(newFavorites: Array<string>): Promise<void> {
    console.log("Setting new favorites: ", newFavorites);

    this.favorites = [...newFavorites];
  }

  async getFavorites(): Promise<Array<string>> {
    console.log("Getting favorites from memory: ", this.favorites);

    return this.favorites;
  }

  async getWeather(location: string): Promise<WeatherInfo | WeatherError> {
    console.log(`Getting weather for ${location}`);

    let resLocation, res;
    try {
      resLocation = await axios.get(
        `https://wttr.in/:geo-location?location=${location}`
      );
      res = await axios.get(`https://wttr.in/${location}?M&format=j1`);
    } catch (e) {
      const err = e as AxiosError;
      console.log("External Weather API `wttr.in` returned an error: ", err);

      if (err.response?.status === 404) {
        return { status: "error", type: WeatherErrorType.NotFound };
      }

      if (err.response?.status && err.response?.status / 100 === 5) {
        return { status: "error", type: WeatherErrorType.ServiceDown };
      }

      return { status: "error", type: WeatherErrorType.Unknown };
    }

    const condition = res.data.current_condition[0];

    return {
      status: "ok",
      actualTemperature: condition.temp_C,
      weatherCondition: this.#mapWeatherCondition(
        condition.weatherDesc[0].value
      ),
      location: resLocation.data.address,
      humidity: condition.humidity,
      wind: condition.windspeedKmph,
      precipitation: condition.precipMM,
      pressure: condition.pressure,
      localObsTime: condition.localObsDateTime,
      originalLocation: location,
    };
  }
}
