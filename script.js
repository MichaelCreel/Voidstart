document.getElementById("date").textContent = new Date().toDateString();

document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// Search
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;
    const engine = document.getElementById("search-engine").value;
    const urls = {
        google: `https://www.google.com/search?q=${query}`,
        bing: `https://www.bing.com/search?q=${query}`,
        duckduckgo: `https://duckduckgo.com/?q=${query}`,
        yahoo: `https://search.yahoo.com/search?p=${query}`
    };
    window.open(urls[engine], '_blank');
});

// Weather functionality
navigator.geolocation.getCurrentPosition(
    (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weather = data.current_weather;
                const fahrenheit = (weather.temperature * 9/5) + 32;
                const mph = (weather.windspeed * 1.609344).toFixed(1);
                document.getElementById("weather-info").textContent = 
                    `Temp: ${weather.temperature}°C (${fahrenheit.toFixed(1)}°F)\nWind: ${weather.windspeed} km/h (${mph} mph)`;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                document.getElementById("weather-info").textContent = "Weather data unavailable";
            });
    },
    (error) => {
        console.error("Error getting location:", error.message);
        document.getElementById("weather-info").textContent = "Location access denied";
    }
);
