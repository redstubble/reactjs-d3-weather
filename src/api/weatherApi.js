import { locations, key } from './locations';

export default async () => {
  const dataArray = locations.map(async (loc) => {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?id=${
        loc._id
      }&units=metric&APPID=${key}`,
    );
    const data = await response.json();
    return data;
  });
  const locationResults = dataArray.map(async (data) => {
    const item = await data;
    const location = item.city.name + ', ' + item.city.country;
    const forecast = item.list.map((ts) => {
      return {
        dateTime: ts.dt,
        temp: ts.main.temp,
        humidity: ts.main.humidity,
      };
    });
    return {
      name: location,
      forecast,
    };
  });
  return {
    apiResults: {
      response: 'success',
      results: locationResults,
    },
  };
};
