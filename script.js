const API_KEY = "872b0afdc4c4b5eb6d0c14eb33026028"; // 🔴 ADD YOUR KEY HERE
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const cityInput = document.getElementById("cityInput");
const unitSelect = document.getElementById("unitSelect");
const searchBtn = document.getElementById("searchBtn");
const toggleViewBtn = document.getElementById("toggleViewBtn");

const cityNameEl = document.getElementById("cityName");
const descriptionEl = document.getElementById("description");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const updatedTimeEl = document.getElementById("updatedTime");

const chartContainer = document.getElementById("chartContainer");
const weatherCard = document.getElementById("weatherCard");

let chart;
let showChart = true;

/* Load saved preferences */
window.onload = () => {
  const savedCity = localStorage.getItem("city");
  const savedUnit = localStorage.getItem("unit");

  if (savedUnit) unitSelect.value = savedUnit;
  if (savedCity) {
    cityInput.value = savedCity;
    fetchWeather(savedCity);
  }
};

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    localStorage.setItem("city", city);
    localStorage.setItem("unit", unitSelect.value);
    fetchWeather(city);
  }
});

toggleViewBtn.addEventListener("click", () => {
  showChart = !showChart;
  chartContainer.style.display = showChart ? "block" : "none";
});

/* Fetch Weather */
async function fetchWeather(city) {
  const unit = unitSelect.value;

  try {
    const currentRes = await fetch(
      `${BASE_URL}/weather?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    const currentData = await currentRes.json();

    if (currentData.cod !== 200) {
      alert("City not found");
      return;
    }

    updateWeatherCard(currentData);

    const forecastRes = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
    );
    const forecastData = await forecastRes.json();

    updateChart(forecastData);

  } catch (error) {
    console.error(error);
    alert("Error fetching weather data");
  }
}

/* Update UI */
function updateWeatherCard(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  descriptionEl.textContent = data.weather[0].description;
  temperatureEl.textContent = `${data.main.temp}°`;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed} m/s`;
  updatedTimeEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

/* Chart */
function updateChart(data) {
  const labels = [];
  const temps = [];

  data.list.slice(0, 8).forEach(item => {
    labels.push(item.dt_txt.split(" ")[1]);
    temps.push(item.main.temp);
  });

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("tempChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Temperature",
          data: temps,
          tension: 0.4,
          fill: false
        }
      ]
    },
    options: {
      responsive: true
    }
  });
}
