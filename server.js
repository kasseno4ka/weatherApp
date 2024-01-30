const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    try {
        const weatherData = await getWeatherData(lat, lon);
        console.log(weatherData);
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

async function getWeatherData(lat, lng) {
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    const weatherApiToken = process.env.WEATHER_API_TOKEN;

    const [openWeatherResponse, weatherApiResponse] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherApiKey}`),
        axios.get(`https://api.weatherapi.com/v1/current.json?key=${weatherApiToken}&q=${lat},${lng}`)
    ]);

    const openWeatherData = openWeatherResponse.data;
    const weatherApiData = weatherApiResponse.data;

    return {
        address: await getCityName(lat, lng),
        temperature: openWeatherData.main.temp,
        description: openWeatherData.weather[0].description,
        icon: openWeatherData.weather[0].icon,
        coordinates: openWeatherData.coord,
        feelsLike: openWeatherData.main.feels_like,
        humidity: weatherApiData.current.humidity,
        pressure: weatherApiData.current.pressure_mb,
        windSpeed: weatherApiData.current.wind_kph,
        countryCode: openWeatherData.sys.country,
        rainVolumeLast3Hours: openWeatherData.rain ? openWeatherData.rain['3h'] : 0,
    };
}

async function getCityName(lat, lng) {
    const opencageApiKey = process.env.OPENCAGE_API_KEY;
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${opencageApiKey}`);
    const data = response.data;

    if (data.results.length > 0) {
        return data.results[0].formatted;
    } else {
        console.error(`City not found for coordinates (${lat}, ${lng})`);
        return 'Unknown City';
    }
}
