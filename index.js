const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
//const searchInput = document.querySelector('[data-searchInput]');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector(".user-info-container");

//initial variables

let currentTab = userTab; //as initially it is showing our location weather
const API_KEY = "4438f69dfd5b22e609e66c840eae910b";
currentTab.classList.add('current-tab');
getfromSessionStorage();


//switching tab
function switchTab(clickedTab) {

    if(clickedTab != currentTab) {
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');
      
  

        if(!searchForm.classList.contains('active')) {
            userInfoContainer.classList.remove('active');       //if visible then already contains active
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');               //show only search tab content and hides rest
        }
        else {
            //pehle searchg wala tab pr tha, ab  your weather tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove('active');
            //ab weather tab mei hai toh weather content bhi visible karna hoga,so lets check local storage first 
            //for coordinates,if we have saved them their
            getfromSessionStorage();

        }
    }

}


userTab.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //means location not given ..ask for grant access again
        grantAccessContainer.classList.add('active');

    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {latitude, longitude} = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove('active');
    //make loader visible
    loadingScreen.classList.add('active');

    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove('active');
    }

}

function renderWeatherInfo(weatherInfo){
    //first,we have to fetch the element
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const weatherDescription = document.querySelector('[data-weatherDesc]');
    const temperature = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    //fetch values from weatherinfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${Math.round(weatherInfo?.main?.temp - 273)}°`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`




}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('Your browser does not support geolocation feature');
    }
}

function showPosition(position){
    const userCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }

    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener('click', getLocation);

let searchInput = document.querySelector('[data-searchInput]');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === '')
        return;
    else
        fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        searchForm.reset();
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove('active');

    }
}

    
