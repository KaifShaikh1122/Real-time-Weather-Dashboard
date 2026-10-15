const API_KEY = 'fda61eeebf6203b0bb1cab5f22ec76e4'; 

// Load Ambajogai, Maharashtra automatically on startup
window.addEventListener('DOMContentLoaded', () => {
    getWeatherData('Ambajogai');
});

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeatherData(city);
    }
});

async function getWeatherData(city) {
    const displayDiv = document.getElementById('weather-display');
    const errorDiv = document.getElementById('error-message');
    const spinner = document.getElementById('loading-spinner');
    
    // Show spinner, hide content/errors
    spinner.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    displayDiv.classList.add('hidden');

    const url = `https://openweathermap.org{city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please try again.");
            } else {
                throw new Error("Failed to fetch weather data. Try later.");
            }
        }

        const data = await response.json();
        renderWeather(data);

    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    } finally {
        // Always hide the spinner once the request completes
        spinner.classList.add('hidden');
    }
}

function renderWeather(data) {
    const displayDiv = document.getElementById('weather-display');
    
    // Render textual metrics
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temp').textContent = Math.round(data.main.temp);
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind').textContent = data.wind.speed;

    // Fetch and render the dynamic weather icon code from OpenWeatherMap
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org{iconCode}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('weather-icon').alt = data.weather[0].description;

    displayDiv.classList.remove('hidden');
}
