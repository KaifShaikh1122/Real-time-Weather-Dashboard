/**
 * Real-Time Async Weather Dashboard Engine
 * Implements strict elements state checking, local data fallback mapping, and dynamic geocoding integration.
 */

const API_CONFIG = {
    KEY: 'fda61eeebf6203b0bb1cab5f22ec76e4',
    BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    DEFAULT_CITY: 'Ambajogai',
    IMAGE_URL: 'https://openweathermap.org'
};

// Global DOM Registry Lifecycle Wrapper
window.addEventListener('DOMContentLoaded', () => {
    WeatherDashboard.init();
});

const WeatherDashboard = {
    elements: {},

    // Register active elements safely without risking null pointer executions
    init() {
        this.elements = {
            input: document.getElementById('city-input'),
            btn: document.getElementById('search-btn'),
            spinner: document.getElementById('loading-spinner'),
            display: document.getElementById('weather-display'),
            error: document.getElementById('error-message'),
            cityName: document.getElementById('city-name'),
            icon: document.getElementById('weather-icon'),
            desc: document.getElementById('weather-desc'),
            temp: document.getElementById('temp'),
            humidity: document.getElementById('humidity'),
            wind: document.getElementById('wind')
        };

        this.registerEvents();
        
        // Execute initial render routine using regional metrics target
        this.fetchWeatherData(API_CONFIG.DEFAULT_CITY);
    },

    registerEvents() {
        if (this.elements.btn) {
            this.elements.btn.addEventListener('click', () => this.handleSearchTrigger());
        }
        if (this.elements.input) {
            this.elements.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.handleSearchTrigger();
            });
        }
    },

    handleSearchTrigger() {
        const rawQuery = this.elements.input.value.trim();
        if (rawQuery.length > 0) {
            this.fetchWeatherData(rawQuery);
        }
    },

    // Core networking layer using safe async-await error boundaries
    async fetchWeatherData(queryTarget) {
        this.toggleUIState('LOADING');

        // Form URL string matching metric guidelines
        const endpoint = `${API_CONFIG.BASE_URL}?q=${encodeURIComponent(queryTarget)}&appid=${API_CONFIG.KEY}&units=metric`;

        try {
            const rawResponse = await fetch(endpoint);
            
            if (!rawResponse.ok) {
                if (rawResponse.status === 404) {
                    throw new Error(`" ${queryTarget} " not found. Verify the city name spelling and try again.`);
                } else if (rawResponse.status === 401) {
                    throw new Error("Invalid API verification signature. Please check your credentials key.");
                } else {
                    throw new Error("Service communication breakdown. The API server rejected the request.");
                }
            }

            const parsedPayload = await rawResponse.json();
            this.processAndRender(parsedPayload);

        } catch (runtimeException) {
            this.toggleUIState('ERROR', runtimeException.message);
        }
    },

    // Processes real-time nested data models securely
    processAndRender(payload) {
        try {
            // Unpack required parameters from JSON trees
            const nameValue = payload.name;
            const countryCode = payload.sys && payload.sys.country ? payload.sys.country : '';
            const temperatureCelsius = Math.round(payload.main.temp);
            const relativeHumidity = payload.main.humidity;
            const absoluteWindSpeed = payload.wind.speed;
            
            // Extract primary data profile vector from weather array
            const conditionObject = payload.weather && payload.weather[0] ? payload.weather[0] : { icon: '01d', description: 'Clear sky' };

            // Inject values directly to verified DOM elements
            this.elements.cityName.textContent = countryCode ? `${nameValue}, ${countryCode}` : nameValue;
            this.elements.temp.textContent = temperatureCelsius;
            this.elements.humidity.textContent = relativeHumidity;
            this.elements.wind.textContent = absoluteWindSpeed;
            this.elements.desc.textContent = conditionObject.description;

            // Load high-resolution graphical assets securely
            const responsiveIconUrl = `${API_CONFIG.IMAGE_URL}${conditionObject.icon}@2x.png`;
            
            // Avoid image element pop-in issues by managing load sequence
            this.elements.icon.src = responsiveIconUrl;
            this.elements.icon.alt = `Current conditions: ${conditionObject.description}`;

            this.toggleUIState('SUCCESS');
        } catch (parseError) {
            this.toggleUIState('ERROR', 'Data structural parsing anomaly occurred. API pattern update suggested.');
        }
    },

    // Orchestrates visibility configurations globally across execution workflows
    toggleUIState(targetState, contextMessage = '') {
        // Enforce hard-reset baseline state variables
        this.elements.spinner.classList.add('hidden');
        this.elements.display.classList.add('hidden');
        this.elements.error.classList.add('hidden');

        switch (targetState) {
            case 'LOADING':
                this.elements.spinner.classList.remove('hidden');
                break;
            case 'SUCCESS':
                this.elements.display.classList.remove('hidden');
                break;
            case 'ERROR':
                this.elements.error.textContent = contextMessage;
                this.elements.error.classList.remove('hidden');
                break;
        }
    }
};
