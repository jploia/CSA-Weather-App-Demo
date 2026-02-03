// Javascript allows you to add functionality to a previously static (not changing) website
// We will call from two endpoints from https://open-meteo.com/ which is free and does not require an API key
// endpoint /v1/search -> longitude and latitude by city name
// endpoint /v1/forecast -> getting weather info
// Get the coordinate provided by the user -> Add onClick handler
const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

// Which element will we need to access to check if it has been clicked or not? 
// What action are we looking for (hint: it was mentioned above)
document.getElementById("").addEventListener("", () => {
    // .trim() is like .strip() in Python; it removes all the whitespace EXCEPT only to the left side and the right side of a string
    const city = document.getElementById("cityField").value.trim();

    if (city) {
        // This is a function we will write later on...
        getCoordinates(city);
    } else {
        showError("Please enter a city name.");
    }
});

// Get the coordinates from the API
async function getCoordinates(city) {
  showError("");
  try {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error("Location not found");
    }

    const { latitude, longitude, name, country } = data.results[0];
    getWeather(latitude, longitude, name, country);
  } catch (error) {
    showError(error.message);
  }
}

// Get the weather of the location from the API response
async function getWeather(latitude, longitude, city, country) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        if (!response.ok) {
            throw new Error("Weather data isn't available.");
        }

        const data = await response.json();
        displayWeather(data.current_weather, city, country);

    } catch(error) {
        showError(error.message);
    }
}

// Display weather data onto the screen
function displayWeather(weather, city, country) {
    // Which of our elements would we want to get the id of to display on our frontend?
    const weatherContainer = document.getElementById("");
    const cityHeader = document.getElementById("");
    const temp = document.getElementById("");
    const condition = document.getElementById("");
    const windSpeed = document.getElementById("");

    const weatherCondition =
    weatherDescriptions[weather.weathercode] || "Unknown Condition";

    weatherContainer.style.display = "block";
    cityHeader.textContent = `${city}, ${country}`;
    temp.textContent = `Temperature: ${weather.temperature}°C`;
    condition.textContent = `Condition: ${weatherCondition}`;
    windSpeed.textContent = `Wind Speed: ${weather.windspeed} km/h`;
}

// Error handling logic
function showError(msg) {
    const weatherContainer = document.getElementById("weatherContainer");
    weatherContainer.style.display = "none";
    console.log(weatherContainer.style.display)
    const errorPara = document.getElementById("errorMessage");
    errorPara.textContent = msg;
}