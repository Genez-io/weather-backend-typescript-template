import { GenezioDeploy } from "@genezio/types";
import { WeatherInfo } from "./models/weatherInfo";
import axios from "axios";

@GenezioDeploy()
export class BackendService {
  favorites: Array<string>;

  constructor() {
    this.favorites = [];
  }

  #mapWeatherCondition(rawCondition: string): string {
    let weatherConditionMapped = "CLEAR_DAY";
    switch (true) {
      case rawCondition === "Sunny":
        weatherConditionMapped = "CLEAR_DAY";
        break;
      case rawCondition === "PartlyCloudy":
        weatherConditionMapped = "PARTLY_CLOUDY_DAY";
        break;
      case rawCondition.indexOf("Cloudy") != -1:
        weatherConditionMapped = "CLOUDY";
        break;
      case rawCondition.indexOf("Sleet") != -1:
        weatherConditionMapped = "SLEET";
        break;
      case rawCondition.indexOf("Snow") != -1:
        weatherConditionMapped = "SNOW";
        break;
      case rawCondition.indexOf("Rain") != -1 ||
        rawCondition.indexOf("Showers") != -1:
        weatherConditionMapped = "RAIN";
        break;
      case rawCondition === "Fog":
        weatherConditionMapped = "FOG";
        break;
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
    const rawWeather = condition.weatherDesc[0].value;
    return {
      actualTemperature: condition.temp_C,
      weatherCondition: this.#mapWeatherCondition(rawWeather),
      location: resLocation.data.address,
      humidity: condition.humidity,
      wind: condition.windspeedKmph,
      precipitation: condition.precipMM,
      pressure: condition.pressure,
    };
  }
}
