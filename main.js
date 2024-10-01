const api = {
    key: "f816d047e8fd152c38d765ce3c767c8f",
    base: "https://api.openweathermap.org/data/2.5/"
  };    

const searchbox = document.querySelector('.search-box');
const suggestions = document.querySelector('.suggestions');

searchbox.addEventListener('input', fetchCities);
searchbox.addEventListener('keypress', setQuery);

// Set current date when the page loads
document.addEventListener("DOMContentLoaded", () => {
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);
});

function fetchCities() {
    const query = searchbox.value;
    if (query.length > 0) {
        fetch(`${api.base}find?q=${query}&appid=${api.key}&units=metric`)
            .then(response => response.json())
            .then(data => {
                showSuggestions(data.list);
            })
            .catch(error => {
                console.error("Error fetching city suggestions:", error);
                suggestions.innerHTML = ""; // Clear suggestions if there is an error
            });
    } else {
        suggestions.innerHTML = ""; // Clear suggestions if the input is empty
    }
}

function showSuggestions(cities) {
    suggestions.innerHTML = ""; // Clear previous suggestions
    if (cities) {
        cities.forEach(city => {
            const suggestion = document.createElement('div');
            suggestion.innerText = `${city.name}, ${city.sys.country}`; // Display city name and country
            suggestion.classList.add('suggestion-item');
            suggestion.addEventListener('click', () => {
                searchbox.value = suggestion.innerText; // Set input to selected city
                suggestions.innerHTML = ""; // Clear suggestions
                getResults(city.name); // Fetch weather for selected city
            });
            suggestions.appendChild(suggestion);
        });
    }
}

function setQuery(evt) {
  if (evt.key === "Enter") {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(displayResults)
    .catch(error => {
      alert(error.message); // Alert the user in case of an error
    });
}

function displayResults (weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
