const navLinks = document.querySelectorAll('.header nav ul a');
const searchInput = document.querySelector('.search');
const findBtn = document.querySelector('#findBtn');
const forecastContainer = document.querySelector('.forecast-container');
const error = document.querySelector('.error');

for(var i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener('click', e => {
    navLinks.forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
  });
}

async function getWeatherInfo(location = 'cairo') {
  try {
    var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=3f978c93e0794b4485123829250307&q=${location}&days=3`)
    var data = await response.json();
    displayData(data);
    error.classList.add('d-none');
  } catch(e) {
    error.classList.remove('d-none');
    error.innerHTML = data.error.message;
    return;
  }
}
getWeatherInfo();


function displayData(data) {
  const name = data.location.name;
  const days = data.forecast.forecastday;
  var allData = ``;

  days.forEach((dayData, index) => {
    const date = new Date(dayData.date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    var tempC, weatherIcon, weatherText, windSpeed, windDirection, humidity;
    if(index === 0) {
      tempC = data.current.temp_c;
      weatherIcon = data.current.condition.icon;
      weatherText = data.current.condition.text;
      windSpeed = data.current.wind_kph;
      windDirection = data.current.wind_dir;
      humidity = data.current.humidity;
      const Data = `
        <div class="today forecast-item">
          <div class="content">
            <div class="forecast-header">
              <div class="day">${dayOfWeek}</div>
              <div class="date">${dayOfMonth}${month}</div>
            </div>
            <div class="forecast-body">
              <div class="location">${name}</div>
              <div class="degree">
                <div class="number">${tempC}<sup>o</sup>C</div>
                <div class="forecast-icon">
                  <img src="${weatherIcon}" class="img-fluid" width="90" alt="">
                </div>
              </div>
              <div class="type">${weatherText}</div>
              <div class="info">
                <div>
                  <img src="Images/icon-umberella@2x.png" alt="">
                  <span id="">${humidity}%</span>
                </div>
                <div>
                  <img src="Images/icon-wind@2x.png" alt="">
                  <span id="">${windSpeed}km/h</span>
                </div>
                <div>
                  <img src="Images/icon-compass@2x.png" alt="">
                  <span id="">${windDirection}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      allData += Data;
    } else {
      maxTempC = dayData.day.maxtemp_c;
      minTempC = dayData.day.mintemp_c;
      weatherIcon = dayData.day.condition.icon;
      weatherText = dayData.day.condition.text;
      const Data = `
        <div class="forecast-item">
          <div class="content">
            <div class="forecast-header justify-content-center">
              <div class="day">${dayOfWeek}</div>
            </div>
            <div class="forecast-body text-center">
              <div class="degree">
              <div class="forecast-icon">
                <img src="${weatherIcon}" class="img-fluid" width="70" alt="">
              </div>
                <div class="number">${maxTempC}<sup>o</sup>C</div>
                <small style="color: var(--second-color);">${minTempC}<sup>o</sup>C</small>
              </div>
              <div class="type">${weatherText}</div>
            </div>
          </div>
        </div>
      `;
      allData += Data;
    }
  })
  forecastContainer.innerHTML = allData;
}

findBtn.addEventListener('click', e => {
  e.preventDefault();
  if(searchInput.value.length > 0) {
    getWeatherInfo(searchInput.value);
  }
})
