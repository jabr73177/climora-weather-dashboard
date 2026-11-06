// import { weatherSchema } from "./schemas/weatherSchema";
// const API_KEY = import.meta.env.VITE_API_KEY;
// export async function getWeather({ lat, lon }: { lat: number; lon: number }) {
//   const response = await fetch(
//     `https://api.openweathermap.org/data/4.0/onecall/timeline/1min?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
//   );
//   const data = await response.json();
//   return weatherSchema.parse(data);
// }

import { weatherSchema } from "./schemas/weatherSchema";
import { citySchema } from "./schemas/citySchema";
import { AirPollutionSchema } from "./schemas/airPollutionSchema";

const API_KEY = import.meta.env.VITE_API_KEY;

export async function getWeather({ lat, lon }: { lat: number; lon: number }) {
  const response = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,alerts&appid=${API_KEY}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to fetch weather");
  }

  return weatherSchema.parse(data);
}
export async function getWeatherByCity(city: string) {
  const params = new URLSearchParams({
    q: city,
    limit: "1",
    appid: API_KEY,
  });

  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?${params}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch city coordinates");
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`City not found: ${city}`);
  }

  const cityData = citySchema.parse(data[0]);

  return { lat: cityData.lat, lon: cityData.lon };
}
export const getAirPollution = async ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch air pollution data");
  }

  const data = await response.json();
  return AirPollutionSchema.parse(data);
};
