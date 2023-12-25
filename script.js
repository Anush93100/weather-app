const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const serchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially variable needed 

let currentTab = userTab;
const API_KEY = "72f7c38fca46c2addc77fd801a99d644";
currentTab.classList.add("current-tab");




// switching between the function 

function switchTab(clickedTab) {

    console.log("tab switched");

    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!serchForm.classList.contains("active")) {
            // kya serch form wala conatiner is visible ,if yes then make it visible 
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            serchForm.classList.add("active");
            console.log("hii");
        }
        else {
            // main pehle search wale tab par tha ,par ab weather tab visible karna hai 
            serchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab mai you weather tab mein aa gaya hu to weather bhi display karna hoga
            // so let's check local storage first for coordinates ,if we saved them here 
            getfromSessionStorage();
            console.log("hello");
        }
    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as input 
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    // pass clicked tab as input 
    switchTab(searchTab);
});


// check if coordinates are already present in session storage 
function getfromSessionStorage() {
    const localCordinates = sessionStorage.getItem("user-coordinates");
    if (!localCordinates) {
        // if local coordinates is not present 
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader invisible 
    loadingScreen.classList.add("active");


    // API Call 
    try {
        console.log("st");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        // response.then((p)=>{()=> return p.JSON()}).then((p)=>{console.log(p)})
        const data = await response.json();
        console.log("data fetching");
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        loadingScreen.classList.remove("active");
        // HW
        console.log(err);

    }

    console.log("data fetched successfully");
}

function renderWeatherInfo(weatherInfo) {
    // firstly we have to fetch the elemnt 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clodiness]");

    // fetch values from weatherInfo object and put in UI elements 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

// console.log( weatherInfo?.name);


    console.log("data rendered");
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {
        //  show an alert for no geolocation available 
        alert("no geoLocation avalilable");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation());


const searchInput = document.querySelector("[data-searchInput]");
serchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "") {
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");

        if( data?.name==undefined){
            err();
            return;
        }
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (e) {
        //  HW
        console.log("erro in search")
    }
}

function err(){
    
}