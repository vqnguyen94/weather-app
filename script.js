//add error catchin for when city isnt found, maybe dialogue box under search box and also adopt the same workflow as you have before, everyone else doin it
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weatherConditions = {
    Clear: "☀️",
    Snow: "❄️",
    Clouds: "☁️",
    Rain: "🌧️",
    Thunderstorm: "⛈️",
    Drizzle: "🌧️"
};
const units = {
    fahrenheit: "imperial",
    celcius: "metric"
}
const apiKey = '83349c2b915d83146ab6bafc2115a2fb';

const current = document.getElementById("today");
const week = document.getElementById("week");
const input = document.getElementById('cityInput');

const c = document.getElementById('celcius');
const f = document.getElementById('fahrenheit');

const form = document.querySelector('form');
form.addEventListener('submit', go);

const today = setDayOfTheWeek();

let temperatureUnit, lat, lon;

temperatureUnit = 'fahrenheit';



// //Initial call for current weather
// fetch('https://api.openweathermap.org/data/2.5/weather?q=Chicago&units=imperial&APPID=' + apiKey,
// { mode: 'cors'})
//     .then(function(response) {
//         // console.log(response);
//         return response.json();
//     })
//     .then(function(response) {
//         let weatherData = getCurrentWeather(response);
//         displayCurrentWeather(weatherData, current);
//         //console.log(response);
//         lat = response.coord.lat;
//         lon = response.coord.lon;
//         // // console.log(lat, lon);
//         fetchWeeklyWeather(lat, lon);
//     })
//     .catch(function(error) {
//         console.log(error);
//     });

fetchCityWeather('Chicago');

function setDayOfTheWeek(){
    const d = new Date();
    return weekdays[d.getDay()];
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

async function fetchCityWeather(city){
    
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + 
                                '&units=' + units[temperatureUnit] + '&APPID=' + apiKey, { mode: 'cors'});
    const data = await response.json();
    let weatherData = getCurrentWeather(data);
    removeAllChildNodes(current);
    displayCurrentWeather(weatherData, current);
    //console.log(response);
    lat = data.coord.lat;
    lon = data.coord.lon;
    // // console.log(lat, lon);
    fetchWeeklyWeather(lat, lon);
}

async function fetchWeeklyWeather(lat, lon){
    
    const response = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + 
                                '&lon=' + lon + '&exclude=current,minutely,hourly,alerts&units=' + units[temperatureUnit] + '&appid=' + apiKey, { mode: 'cors'});
    //console.log("now this is the weekly call");
    //console.log(response);
    const data = await response.json();
    //console.log(data);
    const weeklyData = getWeeklyWeather(data);
    //const weatherData = getCurrentWeather(data);
    removeAllChildNodes(week);
    displayWeeklyWeather(weeklyData, week);
    
}

//dt is the current day
//city name
//weather conditions
//current temp
//day of week, today
//high low
//hourly temp for today
//7 day forcast with condition, high and low

function getWeeklyWeather(data){
    const weather = [];
    for(let i = 0; i < data.daily.length; i++){
        const day = {
            date: getDayOfWeek(i),
            condition: data.daily[i].weather[0].main,
            high: Math.round(data.daily[i].temp.max),
            low: Math.round(data.daily[i].temp.min)
            
        }
        weather.push(day);
        // console.log(data.daily[i].weather[0].main);
    }
    return weather;
}

function getDayOfWeek(index){
    let currentIndex = weekdays.indexOf(today);
    currentIndex = currentIndex + index;
    if(currentIndex > weekdays.length || currentIndex == weekdays.length){
        currentIndex = currentIndex - weekdays.length;
    }
    return weekdays[currentIndex];
}

function getCurrentWeather(data){
    const weather = {
        city: data.name,
        condition: data.weather[0].main,
        current_temp: Math.round(data.main.temp),
    };

    return weather;
}

function displayCurrentWeather(data, parent){
    const city = document.createElement('p');
    city.textContent = data.city;
    city.classList.add('city');

    const condition = document.createElement('p');
    condition.textContent = data.condition;
    condition.classList.add('condition');
    
    const temp = document.createElement('p');
    temp.textContent = data.current_temp + "°";
    temp.classList.add('temperature');
    temp.setAttribute('id', 'currentTemp');

    parent.appendChild(city);
    parent.appendChild(condition);
    parent.appendChild(temp);

}

function displayWeeklyWeather(data, parent){
    for(let i = 0; i < data.length; i++){
        const weatherData = data[i];
        addDate(weatherData.date, parent);
        if(i == 0){
            addDate("TODAY", parent);
        }
        addCondition(weatherData.condition, parent);
        addHighLow(weatherData.high, weatherData.low, parent);
    }
}
function print(item, parent){
    const stat = document.createElement('p');
    stat.textContent = item;
    parent.appendChild(stat);
}

function convertFToC (f){
    return Math.round((f - 32) * (.5556));
}

function convertCToF (c){
    return Math.round((c * 1.8) + 32);
}


function addDate(data, parent){
    const date = document.createElement('p');
    date.textContent = data;
    date.classList.add('date');
    parent.appendChild(date);
}

function addCondition(data, parent){
    const condition = document.createElement('p');
    condition.textContent = determineWeatherIcon(data);
    condition.classList.add('condition');
    parent.appendChild(condition);
}

function addHighLow(hi, lo, parent){
    const high = document.createElement('p');
    high.textContent = hi;
    high.classList.add('temperature');

    const low = document.createElement('p');
    low.textContent = lo;
    low.classList.add('temperature');
    low.classList.add('low');
    parent.appendChild(high);
    parent.appendChild(low);
}

function determineWeatherIcon(condition){
    return weatherConditions[condition];
}

function convertTemperatures(){
    const temperatures = document.querySelectorAll('.temperature');
    for (let i = 0; i < temperatures.length; i++) {
        let number = parseInt(temperatures[i].textContent); 
        temperatureUnit == 'fahrenheit' ? number = convertFToC(number) : number = convertCToF(number);
        temperatures[i].textContent = number;
    }
    temperatureUnit == 'fahrenheit' ? temperatureUnit = 'celcius' : temperatureUnit = 'fahrenheit';
    document.getElementById('currentTemp').textContent = document.getElementById('currentTemp').textContent + "°";
}


function toggleUnits(){
    c.classList.toggle("units");
    f.classList.toggle("units");
    c.classList.toggle("unclickable");
    f.classList.toggle("unclickable");
    convertTemperatures();
}


function go(event){
    const city = input.value;
    fetchCityWeather(city);
    event.preventDefault();
    form.reset();
}


