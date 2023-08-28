const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    currentLocation = document.getElementById("location"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibilty = document.querySelector(".visibilty"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibilty-status"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    weatherCards = document.querySelector("#weather-cards");

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";


function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
        headers: {},
    })
        .then((response) => response.json())
        .then((data) => {
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        })
        .catch((err) => {
            console.error(err);
        });
}

getPublicIp();

// function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`,

        {
            method: "GET",
            headers: {},
        }
    )
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celciusToFahrenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "Perc - " + today.precip + "%";
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            measureUvIndex(today.uvindex);
            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);
            humidity.innerText = today.humidity + "%";
            updateHumidityStatus(today.humidity);
            visibilty.innerText = today.visibility;
            updateVisibiltyStatus(today.visibility);
            airQuality.innerText = today.winddir;
            updateAirQualityStatus(today.winddir);
            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day");
            } else {
                updateForecast(data.days, unit, "week");
            }
            sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = covertTimeTo12HourFormat(today.sunset);
        })
        .catch((err) => {
            alert("City not found in our database");
        });
}

//function to update Forecast
function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if (unit === "f") {
            tempUnit = "°F";
        }
        card.innerHTML = `
                <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" class="day-icon" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
  `;
        weatherCards.appendChild(card);
        day++;
    }
}

// function to change weather icons
function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
        return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
        return "https://i.ibb.co/rb4rrJL/26.png";
    }
}

// function to change background depending on weather conditions
function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp";

    } else if (condition === "partly-cloudy-night") {
        bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
    } else if (condition === "rain") {
        bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
    } else if (condition === "clear-day") {
        bg = "https://i.ibb.co/WGry01m/cd.jpg";
    } else if (condition === "clear-night") {
        bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
    } else {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    }
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
}

//get hours from hh:mm:ss
function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}

// convert time to 12 hour format
function covertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

// function to get day name from date
function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

// function to get uv index status
function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "Low";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}

// function to get humidity status
function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}

// function to get visibility status
function updateVisibiltyStatus(visibility) {
    if (visibility <= 0.03) {
        visibilityStatus.innerText = "Dense Fog";
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

function updateAirQualityStatus(airquality) {
    if (airquality <= 50) {
        airQualityStatus.innerText = "Good👌";
    } else if (airquality <= 100) {
        airQualityStatus.innerText = "Moderate😐";
    } else if (airquality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
    } else if (airquality <= 200) {
        airQualityStatus.innerText = "Unhealthy😷";
    } else if (airquality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy😨";
    } else {
        airQualityStatus.innerText = "Hazardous😱";
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(location, currentUnit, hourlyorWeek);
    }
});

function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}


var currentFocus;
search.addEventListener("input", function (e) {
    removeSuggestions();
    var a,
        b,
        i,
        val = this.value;
    if (!val) {
        return false;
    }
    currentFocus = -1;

    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");

    this.parentNode.appendChild(a);

    for (i = 0; i < cities.length; i++) {
        if (
            cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()
        ) {
            b = document.createElement("li");
            b.innerHTML =
                "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
            b.innerHTML += cities[i].name.substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";
            b.addEventListener("click", function (e) {
                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggestions();
            });

            a.appendChild(b);
        }
    }
});
/*execute a function presses a key on the keyboard:*/
search.addEventListener("keydown", function (e) {
    var x = document.getElementById("suggestions");
    if (x) x = x.getElementsByTagName("li");
    if (e.keyCode == 40) {
        /*If the arrow DOWN key
          is pressed,
          increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
    } else if (e.keyCode == 38) {
        /*If the arrow UP key
          is pressed,
          decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
    }
    if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
        }
    }
});
function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("active");
}
function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}

function removeSuggestions() {
    var x = document.getElementById("suggestions");
    if (x) x.parentNode.removeChild(x);
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});

// function to change unit
function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        tempUnit.forEach((elem) => {
            elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
            celciusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        } else {
            celciusBtn.classList.remove("active");
            fahrenheitBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
});

// function to change hourly to weekly or vice versa
function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}





const cities = [
    {
        country: "Netherlands",
        name: "Amsterdam",
        lat: "52.367",
        lng: "4.904",
    },
    {
        country: "Turkey",
        name: "Ankara",
        lat: "39.933",
        lng: "32.859",
    },
    {
        country: "Sweden",
        name: "Åstorp",
        lat: "56.134",
        lng: "12.945",
    },
    {
        country: "Greece",
        name: "Athens",
        lat: "37.983",
        lng: "23.727",
    },
    {
        country: "Northern Ireland",
        name: "Belfast",
        lat: "54.597",
        lng: "-5.930",
    },
    {
        country: "Spain",
        name: "Barcelona",
        lat: "41.387",
        lng: "2.168",
    },
    {
        country: "Germany",
        name: "Berlin",
        lat: "52.520",
        lng: "13.405",
    },
    {
        country: "Switzerland",
        name: "Bern",
        lat: "46.948",
        lng: "7.447",
    },
    {
        country: "Spain",
        name: "Bilbao",
        lat: "43.263",
        lng: "-2.935",
    },
    {
        country: "Belgium",
        name: "Brussels",
        lat: "50.847",
        lng: "4.357",
    },
    {
        country: "Romania",
        name: "Bucharest",
        lat: "47.497",
        lng: "19.040",
    },
    {
        country: "Hungary",
        name: "Budapest",
        lat: "59.329",
        lng: "18.068",
    },
    {
        country: "Wales",
        name: "Cardiff",
        lat: "51.483",
        lng: "-3.168",
    },
    {
        country: "Germany",
        name: "Cologne",
        lat: "50.937",
        lng: "6.960",
    },
    {
        country: "Denmark",
        name: "Copenhagen",
        lat: "55.676",
        lng: "12.568",
    },
    {
        country: "Ireland",
        name: "Cork",
        lat: "51.898",
        lng: "-8.475",
    },
    {
        country: "Ireland",
        name: "Dublin",
        lat: "53.349",
        lng: "-6.260",
    },
    {
        country: "Scotland",
        name: "Edinburgh",
        lat: "55.953",
        lng: "-3.188",
    },
    {
        country: "Italy",
        name: "Florence",
        lat: "43.7696",
        lng: "11.255",
    },
    {
        country: "Germany",
        name: "Frankfurt",
        lat: "50.110",
        lng: "8.682",
    },
    {
        country: "France",
        name: "French Riviera",
        lat: "43.254",
        lng: "6.637",
    },
    {
        country: "Portugal",
        name: "Funchal",
        lat: "32.650",
        lng: "-16.908",
    },
    {
        country: "Portugal",
        name: "Gibraltar",
        lat: "36.140",
        lng: "-5.353",
    },
    {
        country: "Sweden",
        name: "Gothenburg",
        lat: "57.708",
        lng: "11.974",
    },
    {
        country: "Germany",
        name: "Hamburg",
        lat: "53.548",
        lng: "9.987",
    },
    {
        country: "Finland",
        name: "Helsinki",
        lat: "60.169",
        lng: "24.938",
    },
    {
        country: "Spain",
        name: "Ibiza",
        lat: "39.020",
        lng: "1.482",
    },
    {
        country: "Ukraine",
        name: "Kyiv",
        lat: "50.450",
        lng: "30.523",
    },
    {
        country: "Norway",
        name: "Lillehammer",
        lat: "61.115",
        lng: "10.466",
    },
    {
        country: "Portugal",
        name: "Lisbon",
        lat: "38.722",
        lng: "-9.139",
    },
    {
        country: "England",
        name: "London",
        lat: "51.507",
        lng: "-0.127",
    },
    {
        country: "Spain",
        name: "Madrid",
        lat: "40.416",
        lng: "-3.703",
    },
    {
        country: "Spain",
        name: "Mallorca",
        lat: "39.695",
        lng: "3.017",
    },
    {
        country: "England",
        name: "Manchester",
        lat: "53.480",
        lng: "-2.242",
    },
    {
        country: "France",
        name: "Marseille",
        lat: "43.296",
        lng: "5.369",
    },
    {
        country: "Spain",
        name: "Maspalomas",
        lat: "27.760",
        lng: "-15.586",
    },
    {
        country: "Italy",
        name: "Milan",
        lat: "45.464",
        lng: "9.190",
    },
    {
        country: "Germany",
        name: "Munich",
        lat: "48.135",
        lng: "11.582",
    },
    {
        country: "Italy",
        name: "Naples",
        lat: "40.851",
        lng: "14.268",
    },
    {
        country: "Spain",
        name: "Oñati",
        lat: "43.034",
        lng: "-2.417",
    },
    {
        country: "Norway",
        name: "Oslo",
        lat: "59.913",
        lng: "10.752",
    },
    {
        country: "France",
        name: "Paris",
        lat: "48.856",
        lng: "2.352",
    },
    {
        country: "Czech Republic",
        name: "Prague",
        lat: "50.075",
        lng: "14.437",
    },
    {
        country: "Iceland",
        name: "Reykjavík",
        lat: "64.146",
        lng: "-21.942",
    },
    {
        country: "Latvia",
        name: "Riga",
        lat: "56.879",
        lng: "24.603",
    },
    {
        country: "Italy",
        name: "Rome",
        lat: "41.902",
        lng: "12.496",
    },
    {
        country: "Portugal",
        name: "Santa Cruz das Flores",
        lat: "39.453",
        lng: "-31.127",
    },
    {
        country: "Spain",
        name: "Santa Cruz de Tenerife",
        lat: "28.463",
        lng: "-16.251",
    },
    {
        country: "Scotland",
        name: "Skye",
        lat: "57.273",
        lng: "-6.215",
    },
    {
        country: "Bulgaria",
        name: "Sofia",
        lat: "42.697",
        lng: "23.321",
    },
    {
        country: "Sweden",
        name: "Stockholm",
        lat: "59.329",
        lng: "18.068",
    },
    {
        country: "Estonia",
        name: "Tallinn",
        lat: "59.437",
        lng: "24.753",
    },
    {
        country: "Austria",
        name: "Vienna",
        lat: "18.208",
        lng: "16.373",
    },
    {
        country: "Poland",
        name: "Warsaw",
        lat: "52.229",
        lng: "21.012",
    },
    {
        country: "England",
        name: "York",
        lat: "53.961",
        lng: "-1.07",
    },
    {
        country: "Switzerland",
        name: "Zurich",
        lat: "47.376",
        lng: "8.541",
    },
];


