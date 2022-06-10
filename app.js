const key = '917bbf37e500cb05f86988429f942068';

const searchField = document.querySelector('#search');
const ul = document.querySelector('form ul');
const form = document.querySelector('form');
const weather = document.getElementById('weather');
const changeBtn = document.getElementById('change');

const city = document.getElementById('city');
const degrees = document.getElementById('degrees');
const feelsLikeValue = document.getElementById('feelsLikeValue');
const windValue = document.getElementById('windValue');
const humidityValue = document.getElementById('humidityValue');

async function search() {
  const phrase = searchField.value;
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`
  );
  const data = await response.json();
  ul.innerHTML = '';
  for (let i = 0; i < data.length; i++) {
    const { name, lat, lon, country } = data[i];
    ul.innerHTML += `<li class="city-list" data-lat="${lat}"  data-lon="${lon}" data-name="${name}">${name} <span>${country}</span></li>`;
  }
}

const debouncedSearch = _.debounce(() => {
  search();
}, 600);
async function showWeather(lat, lon, name) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric `
  );
  const data = await response.json();

  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = Math.round(data.main.humidity);
  const wind = Math.round(data.wind.speed);
  const icon = data.weather[0].icon;

  city.innerHTML = name;
  degrees.innerHTML = temp + '&#8451';
  feelsLikeValue.innerHTML = feelsLike + "<span>'&#8451'</span>";
  windValue.innerHTML = wind + "<span>'km/h'</span>";
  humidityValue.innerHTML = humidity + "<span>'%'</span>";
  document.getElementById(
    'icon'
  ).src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
  form.style.display = 'none';
  weather.style.display = 'block';
}

searchField.addEventListener('keyup', debouncedSearch);

document.body.addEventListener('click', function (e) {
  const li = e.target;
  //   const li = document.querySelector('.city-list');
  const { lat, lon, name } = li.dataset;
  localStorage.setItem('lat', lat);
  localStorage.setItem('lon', lon);
  localStorage.setItem('name', name);
  if (!lat) {
    return;
  }
  showWeather(lat, lon, name);
});

changeBtn.addEventListener('click', () => {
  form.style.display = 'block';
  weather.style.display = 'none';
  //   searchField.value = '';
  //   ul.innerHTML = '';
});

document.body.onload = () => {
  if (localStorage.getItem('lat')) {
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const name = localStorage.getItem('name');
    showWeather(lat, lon, name);
  }
};
