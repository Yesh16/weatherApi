const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const apiKey = '982b980fd8msh2fbff5eaa4d720dp1ded5bjsn98abf1061023';
let favoriteCities = [];

app.use(bodyParser.json());

// GET weather information
app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).send({ error: 'Please provide a city' });
    }

    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        if (data.error) {
            return res.status(400).send({ error: data.error.info });
        }
        res.send({
            location: data.location.name,
            temperature: data.current.temperature,
            description: data.current.weather_descriptions[0],
        });
    } catch (error) {
        res.status(500).send({ error: 'Unable to fetch weather data' });
    }
});

// POST to add a city to favorites
app.post('/favorites', (req, res) => {
    const city = req.body.city;
    if (!city) {
        return res.status(400).send({ error: 'Please provide a city' });
    }
    favoriteCities.push(city);
    res.send({ message: 'City added to favorites', favoriteCities });
});

// PUT to update a favorite city
app.put('/favorites/:oldCity', (req, res) => {
    const oldCity = req.params.oldCity;
    const newCity = req.body.city;
    const index = favoriteCities.indexOf(oldCity);
    if (index === -1) {
        return res.status(404).send({ error: 'City not found in favorites' });
    }
    favoriteCities[index] = newCity;
    res.send({ message: 'City updated in favorites', favoriteCities });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
