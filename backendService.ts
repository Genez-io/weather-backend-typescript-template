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
  async getWheather(location: string) {
    const res = await axios.get(`https://wttr.in/${location}?M&format=j1`);
    let weatherConditionMapped: string = "CLEAR_DAY";
    const weatherConditionUnmapped =
      res.data.current_condition[0].weatherDesc[0].value;
    if (weatherConditionUnmapped == "Sunny") {
      let date = new Date(res.data.current_condition[0].localObsDateTime);
      if (date.getHours() >= 7 && date.getHours() <= 19) {
        weatherConditionMapped = "CLEAR_DAY";
      } else {
        weatherConditionMapped = "CLEAR_NIGHT";
      }
    }
    if (weatherConditionUnmapped == "PartlyCloudy") {
      let date = new Date(res.data.current_condition[0].localObsDateTime);
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
    // console.log(res.data);
  }

  hello(name: string): string {
    console.log(`Server request receive with parameter ${name}`);
    return `Hello, ${name}!`;
  }
}
