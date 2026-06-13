// ============================================
// 🌤️ WEATHER DASHBOARD - Weather API Integration
// ============================================

class WeatherDashboard {
    constructor() {
        this.apiKey = 'a6a6a0ceef6f4c45a0be5d1f82d90f74'; // API key gratuita (OpenWeatherMap)
        this.weatherData = null;
        this.forecastData = null;
        this.currentCity = 'São Paulo';
        this.favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
        
        this.initEventListeners();
        this.loadInitialWeather();
        this.renderFavorites();
    }

    initEventListeners() {
        document.getElementById('searchBtn').addEventListener('click', () => this.searchCity());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearchInput(e));
        document.getElementById('locationBtn').addEventListener('click', () => this.getCurrentLocation());
        document.getElementById('retryBtn').addEventListener('click', () => this.loadInitialWeather());
    }

    async loadInitialWeather() {
        await this.fetchWeather(this.currentCity);
    }

    async searchCity() {
        const city = document.getElementById('searchInput').value.trim();
        if (city) {
            await this.fetchWeather(city);
            document.getElementById('searchInput').value = '';
            document.getElementById('suggestions').classList.remove('show');
        }
    }

    async handleSearchInput(e) {
        const input = e.target.value.trim();
        if (input.length < 2) {
            document.getElementById('suggestions').classList.remove('show');
            return;
        }

        try {
            // Buscar sugestões de cidades
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${this.apiKey}`
            );
            const cities = await response.json();

            const suggestionsDiv = document.getElementById('suggestions');
            suggestionsDiv.innerHTML = '';

            if (cities.length > 0) {
                cities.forEach(city => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    item.textContent = `${city.name}, ${city.country}`;
                    item.onclick = () => this.fetchWeather(city.name);
                    suggestionsDiv.appendChild(item);
                });
                suggestionsDiv.classList.add('show');
            }
        } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
        }
    }

    async getCurrentLocation() {
        const btn = document.getElementById('locationBtn');
        btn.disabled = true;
        btn.textContent = '⏳ Localizando...';

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await this.fetchWeatherByCoordinates(latitude, longitude);
                    btn.disabled = false;
                    btn.textContent = '📍 Localização';
                },
                (error) => {
                    this.showError('Não foi possível acessar sua localização');
                    btn.disabled = false;
                    btn.textContent = '📍 Localização';
                }
            );
        } else {
            this.showError('Geolocalização não suportada neste navegador');
            btn.disabled = false;
            btn.textContent = '📍 Localização';
        }
    }

    async fetchWeather(city) {
        this.showLoading(true);
        this.hideError();

        try {
            // Obter coordenadas da cidade
            const geoResponse = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
            );
            const geoData = await geoResponse.json();

            if (!geoData.length) {
                throw new Error('Cidade não encontrada');
            }

            const { lat, lon, name, country } = geoData[0];
            this.currentCity = name;

            // Obter dados de clima
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${this.apiKey}`
            );
            this.weatherData = await weatherResponse.json();

            // Obter previsão de 5 dias
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${this.apiKey}`
            );
            this.forecastData = await forecastResponse.json();

            this.renderCurrentWeather();
            this.renderForecast();
            this.renderHourlyForecast();
            this.showLoading(false);
        } catch (error) {
            this.showError(`Erro ao buscar dados: ${error.message}`);
            this.showLoading(false);
        }
    }

    async fetchWeatherByCoordinates(lat, lon) {
        this.showLoading(true);
        this.hideError();

        try {
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${this.apiKey}`
            );
            this.weatherData = await weatherResponse.json();

            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${this.apiKey}`
            );
            this.forecastData = await forecastResponse.json();

            this.renderCurrentWeather();
            this.renderForecast();
            this.renderHourlyForecast();
            this.showLoading(false);
        } catch (error) {
            this.showError(`Erro ao buscar dados: ${error.message}`);
            this.showLoading(false);
        }
    }

    getWeatherIcon(weatherMain) {
        const iconMap = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Smoke': '💨',
            'Haze': '🌫️',
            'Dust': '🌪️',
            'Fog': '🌫️',
            'Sand': '🌪️',
            'Ash': '💨',
            'Squall': '💨',
            'Tornado': '🌪️'
        };
        return iconMap[weatherMain] || '🌤️';
    }

    renderCurrentWeather() {
        if (!this.weatherData) return;

        const data = this.weatherData;
        const main = data.main;
        const weather = data.weather[0];
        const wind = data.wind;
        const sys = data.sys;
        const clouds = data.clouds;

        // Mostrar seção de clima atual
        document.getElementById('currentWeather').style.display = 'block';

        // Preencher dados
        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('locationDetails').textContent = `${weather.main} - ${weather.description}`;
        document.getElementById('temperature').textContent = `${Math.round(main.temp)}°C`;
        document.getElementById('weatherDescription').textContent = weather.description;
        document.getElementById('weatherIcon').textContent = this.getWeatherIcon(weather.main);
        document.getElementById('windSpeed').textContent = `${Math.round(wind.speed * 3.6)} km/h`;
        document.getElementById('humidity').textContent = `${main.humidity}%`;
        document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°C`;
        document.getElementById('pressure').textContent = `${main.pressure} mb`;
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        document.getElementById('cloudiness').textContent = `${clouds.all}%`;
        document.getElementById('sunrise').textContent = this.formatTime(sys.sunrise);
        document.getElementById('sunset').textContent = this.formatTime(sys.sunset);
        document.getElementById('updateTime').textContent = `Atualizado em ${new Date().toLocaleTimeString('pt-BR')}`;

        // Adicionar aos favoritos automaticamente
        this.addToFavorites(data.name, data.sys.country, Math.round(main.temp));
    }

    renderForecast() {
        if (!this.forecastData) return;

        document.getElementById('forecastSection').style.display = 'block';
        const forecastGrid = document.getElementById('forecastGrid');
        forecastGrid.innerHTML = '';

        const dailyForecasts = {};

        // Agrupar por dia
        this.forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('pt-BR');

            if (!dailyForecasts[day]) {
                dailyForecasts[day] = [];
            }
            dailyForecasts[day].push(item);
        });

        // Pegar um por dia (midday)
        Object.entries(dailyForecasts).slice(0, 5).forEach(([day, forecasts]) => {
            const forecast = forecasts[Math.floor(forecasts.length / 2)];
            const card = document.createElement('div');
            card.className = 'forecast-card';

            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
            const dayDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

            card.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-date" style="font-size: 0.9em; color: #95A5A6; margin-bottom: 10px;">${dayDate}</div>
                <div class="forecast-icon">${this.getWeatherIcon(forecast.weather[0].main)}</div>
                <div class="forecast-info">
                    <p>${forecast.weather[0].description}</p>
                    <div class="forecast-temp">Max: ${Math.round(forecast.main.temp_max)}° Min: ${Math.round(forecast.main.temp_min)}°</div>
                    <p>Umidade: ${forecast.main.humidity}%</p>
                    <p>Vento: ${Math.round(forecast.wind.speed * 3.6)} km/h</p>
                </div>
            `;

            forecastGrid.appendChild(card);
        });
    }

    renderHourlyForecast() {
        if (!this.forecastData) return;

        document.getElementById('hourlySection').style.display = 'block';
        const hourlyGrid = document.getElementById('hourlyGrid');
        hourlyGrid.innerHTML = '';

        // Mostrar próximas 12 horas
        this.forecastData.list.slice(0, 12).forEach(item => {
            const card = document.createElement('div');
            card.className = 'hourly-card';

            const date = new Date(item.dt * 1000);
            const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            card.innerHTML = `
                <div class="hourly-time">${time}</div>
                <div class="hourly-icon">${this.getWeatherIcon(item.weather[0].main)}</div>
                <div class="hourly-temp">${Math.round(item.main.temp)}°C</div>
                <div style="font-size: 0.8em; color: #95A5A6; margin-top: 5px;">${item.weather[0].main}</div>
            `;

            hourlyGrid.appendChild(card);
        });
    }

    addToFavorites(city, country, temperature) {
        const exists = this.favorites.find(f => f.city.toLowerCase() === city.toLowerCase());
        if (!exists) {
            this.favorites.push({ city, country, temperature });
            this.saveFavorites();
            this.renderFavorites();
        } else {
            // Atualizar temperatura
            const favorite = this.favorites.find(f => f.city.toLowerCase() === city.toLowerCase());
            favorite.temperature = temperature;
            this.saveFavorites();
            this.renderFavorites();
        }
    }

    removeFavorite(city) {
        this.favorites = this.favorites.filter(f => f.city.toLowerCase() !== city.toLowerCase());
        this.saveFavorites();
        this.renderFavorites();
    }

    saveFavorites() {
        localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
    }

    renderFavorites() {
        const grid = document.getElementById('favoritesGrid');
        const empty = document.getElementById('favoritesEmpty');

        grid.innerHTML = '';

        if (this.favorites.length === 0) {
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';

        this.favorites.forEach(fav => {
            const card = document.createElement('div');
            card.className = 'favorite-card';

            card.innerHTML = `
                <button class="favorite-remove" onclick="weather.removeFavorite('${fav.city}'); event.stopPropagation();">×</button>
                <div class="favorite-name">${fav.city}</div>
                <div style="font-size: 0.9em; color: #95A5A6; margin-bottom: 10px;">${fav.country}</div>
                <div class="favorite-temp">${fav.temperature}°C</div>
            `;

            card.onclick = () => this.fetchWeather(fav.city);
            grid.appendChild(card);
        });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    showLoading(show) {
        document.getElementById('loadingSpinner').style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorSection').style.display = 'block';
        document.getElementById('currentWeather').style.display = 'none';
        document.getElementById('forecastSection').style.display = 'none';
        document.getElementById('hourlySection').style.display = 'none';
    }

    hideError() {
        document.getElementById('errorSection').style.display = 'none';
    }
}

// ============================================
// INICIALIZAR
// ============================================
let weather;
document.addEventListener('DOMContentLoaded', () => {
    weather = new WeatherDashboard();
});
