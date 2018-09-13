import { locations, key } from './locations'

export default async () =>  {
        const dataArray = locations.map(async loc => {
            const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${loc._id}&APPID=${key}`)
            const data = await response.json();
            return data;
        })
        const locationResults = dataArray.map(arg => {
            const location = arg[0].city.name + ', ' + arg[0].city.country;
            const forecast = arg[0].list.map(ts => {
                return {
                dateTime: new Date(ts.dt),
                temp: ts.main.temp,
                humidity: ts.main.humidity
              };
            })
            return {
                name : location,
                forecast
            }
        });
        return {
            apiResults : {
                response: 'success',
                results : locationResults
            }
        };
    }
    

