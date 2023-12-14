import { GenezioDeploy } from "@genezio/types";
import { WeatherInfo } from "./models/weatherInfo";
import axios from "axios";
import { weatherMapping } from "./models/weatherMapping";

@GenezioDeploy()
export class WeatherService {
  favorites: Array<string>;

  constructor() {
    this.favorites = [];
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
    this.favorites = [...newFavorites];
  }

  async getFavorites(): Promise<Array<string>> {
    return this.favorites;
  }

  async getWeather(location: string): Promise<WeatherInfo> {
    const resLocation = await axios.get(
      `https://wttr.in/:geo-location?location=${location}`
    );
    const res = await axios.get(`https://wttr.in/${location}?M&format=j1`);

    const condition = res.data.current_condition[0];

    return {
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
