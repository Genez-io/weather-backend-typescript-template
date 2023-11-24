import { GenezioDeploy } from "@genezio/types";
import { WeatherInfo } from "./models/weatherInfo";
import axios from "axios";

@GenezioDeploy()
export class BackendService {
  favorites: Array<string>;

  constructor() {
    this.favorites = [];
  }

  async setFavorites(newFavorites: Array<string>): Promise<void> {
    this.favorites = [...newFavorites];
  }

  async getFavorites(): Promise<Array<string>> {
    return this.favorites;
  }
  async getWheather(location: string): Promise<WeatherInfo> {
    const resLocation = await axios.get(
      `https://wttr.in/:geo-location?location=${location}`
    );

    const res = await axios.get(`https://wttr.in/${location}?M&format=j1`);
    const condition = res.data.current_condition[0];
    let weatherConditionMapped: string = "CLEAR_DAY";
    const weatherConditionUnmapped = condition.weatherDesc[0].value;
    if (weatherConditionUnmapped == "Sunny") {
      let date = new Date(condition.localObsDateTime);
      if (date.getHours() >= 7 && date.getHours() <= 19) {
        weatherConditionMapped = "CLEAR_DAY";
      } else {
        weatherConditionMapped = "CLEAR_NIGHT";
      }
    }
    if (weatherConditionUnmapped == "PartlyCloudy") {
      let date = new Date(condition.localObsDateTime);
      if (date.getHours() >= 7 && date.getHours() <= 19) {
        weatherConditionMapped = "PARTLY_CLOUDY_DAY";
      } else {
        weatherConditionMapped = "PARTLY_CLOUDY_NIGHT";
      }
    }
    if (
      weatherConditionUnmapped == "Cloudy" ||
      weatherConditionUnmapped == "VeryCloudy"
    ) {
      weatherConditionMapped = "CLOUDY";
    }
    if (
      weatherConditionUnmapped == "HeavyRain" ||
      weatherConditionUnmapped == "HeavyShowers" ||
      weatherConditionUnmapped == "LightRain" ||
      weatherConditionUnmapped == "LightShowers" ||
      weatherConditionUnmapped == "ThunderyHeavyRain" ||
      weatherConditionUnmapped == "ThunderyShowers"
    ) {
      weatherConditionMapped = "RAIN";
    }
    if (
      weatherConditionUnmapped == "LightSleet" ||
      weatherConditionUnmapped == "LightSleetShowers"
    ) {
      weatherConditionMapped = "SLEET";
    }
    if (
      weatherConditionUnmapped == "HeavySnow" ||
      weatherConditionUnmapped == "HeavySnowShowers" ||
      weatherConditionUnmapped == "LightSnow" ||
      weatherConditionUnmapped == "LightSnowShowers" ||
      weatherConditionUnmapped == "ThunderySnowShowers"
    ) {
      weatherConditionMapped = "SNOW";
    }
    if (weatherConditionUnmapped == "Fog") {
      weatherConditionMapped = "FOG";
    }
    const actualTemperature = condition.temp_C;
    const address = resLocation.data.address;
    const humidity = condition.humidity;
    const wind = condition.windspeedKmph;
    const precipitation = condition.precipMM;
    const pressure = condition.pressure;
    return {
      actualTemperature: actualTemperature,
      weatherCondition: weatherConditionMapped,
      location: address,
      humidity: humidity,
      wind: wind,
      precipitation: precipitation,
      pressure: pressure,
    };
  }
}
