// recieves input from text box and sends to geoCoder
var getCityName = function (searchInfo) {
    // grabs cityname from text box and hourly or daily option
    var cityName = searchInfo.city
    var forecastTime = searchInfo.foreTime

    // converts city name into lat and long for weather api to read
    var apiGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" + cityName + "&count=1"
    fetch(apiGeo)
    .then(response => response.json())
    .then(data => {
        // creates array with long, lat, and city name
        window.locationData = {
            longitude: data.results[0].longitude,
            latitude: data.results[0].latitude,
            city: data.results[0].name
        };
        // send location array to one of the weather funciton based on drop down option
        if (forecastTime === "Daily") {
            weatherDataDaily(locationData);
        } else if (forecastTime === "Hourly") {
            weatherDataHourly(locationData);
        };
    })
}

// retreives daily information from api
var weatherDataDaily = function(locationData) {
    var longitude = locationData.longitude
    var latitude = locationData.latitude
    var apiUrlDaily = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York"

    // retrieves data from apiUrl
    fetch(apiUrlDaily)
        .then(response => response.json())
        .then(data => {            
            // empty container to avoid duplication
            $("#container").empty();
            // change "your 7 day forecast" to the cities name
            var weatherCityTitle = $("#weather-title")
            weatherCityTitle.text(window.locationData.city + "'s 6 Day Forecast")

            // display locations weather data
            for (var i = 0; i < 6; i++) {

                // sets variables for weather data
                var maxTemp = data.daily.temperature_2m_max[i];
                var minTemp = data.daily.temperature_2m_min[i];
                var averageTempMath = (maxTemp + minTemp) / 2;
                // gets average of max and min temperature and rounds to nearest hundredths place
                var averageTemp = averageTempMath.toFixed(2) + "\u00B0F";

                // windspeed in mph
                var windSpeed = data.daily.windspeed_10m_max[i] + "mp/h";

                // precipitation amount in inches
                var precipitation = data.daily.precipitation_sum[i]

                // sunrise and sunset times (12h time)
                var sunrise = moment(data.daily.sunrise[i]).format("h:mm A");
                var sunset = moment(data.daily.sunset[i]).format("h:mm A");

                // gets date and formats it to MM/DD/YYYY
                var dateUn = data.daily.time[i];
                var dateAr = dateUn.split("-");
                var date = dateAr[1] + "/" + dateAr[2] + "/" + dateAr[0];
                var day = moment(data.daily.time[i]).format('dddd');
                
                // weather image based on weathercode
                var weatherCode = data.daily.weathercode[i]
                var weatherIconId = "";
                if (weatherCode === 0) {
                    weatherIconId = "sunny";
                } else if (weatherCode > 0 && weatherCode < 4) {
                    weatherIconId = "partly-cloudy";
                } else if (weatherCode > 4 && weatherCode < 50) {
                    weatherIconId = "cloudy";
                } else if (weatherCode > 50) {
                    weatherIconId = "rain";
                }
                var weatherIcon = "./assets/imgs/" + weatherIconId + ".png";

                // create html elements 
                var container = $("#container");
                var article = $("<div>")
                    .addClass("bg-gray-300 flex flex-wrap justify-center rounded-md shadow-lg m-10 text-center w-1/6")
                var textContainer = $("<div>")    
                    .addClass("text-center")
                var cardContainer = $("<div>")
                    .addClass("content-center")
                var img = $("<img>")
                    .addClass("m-auto rounded overflow-hidden h-48 w-full")
                    .attr("src", weatherIcon)
                var infoContainer = $("<div>")
                var dayEl = $("<h4>")
                    .addClass("text-xl")
                    .text(day)
                var dateEl = $("<h4>")
                    .addClass("p-2 text-xl")
                    .text(date)
                var tempEl = $("<h4>")
                    .addClass("p-2 text-left")
                    .text("Temperature: " + averageTemp)
                var windEl = $("<h4>")
                    .addClass("p-2 text-left")
                    .text("Wind Speed: " + windSpeed)
                var precipitationEl = $("<h4>")
                    .addClass("p-2 text-left")
                    .text("Precipitation: " + precipitation + " in");
                var sunriseEl = $("<h4>")
                    .addClass("p-2 text-left")
                    .text("Sunrise: " + sunrise)
                var sunsetEl = $("<h4>")
                    .addClass("p-2 text-left")
                    .text("Sunset: " + sunset)

                // appends created html elements
                container.append(article);
                article.append(textContainer);
                textContainer.append(cardContainer);
                cardContainer.append(img, infoContainer);
                infoContainer.append(dayEl, dateEl, tempEl, windEl, precipitationEl, sunriseEl, sunsetEl);
            }
        }) 
}

// retrieves hourly information from api
var weatherDataHourly = function(locationData) {
    var longitude = locationData.longitude
    var latitude = locationData.latitude
    var apiUrlHourly = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m,winddirection_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York"
    fetch(apiUrlHourly)
        .then(response => response.json())
        .then(data => {
            // changes title above weather card
            var weatherCityTitle = $("#weather-title")
            weatherCityTitle.text(window.locationData.city + "'s 8 Hour Forecast")

            // gets current time from array to start from there when listing data
            for (var i = 0; i < 24; i++) {
                var timeAr = data.hourly.time[i]
                var currentTime = moment().format('YYYY-MM-DDTHH:00');
                if (timeAr === currentTime) {
                    var startIndex = i;
                    break;
                }
            }
            // declares where loop should start inside array (based on current time)
            x = startIndex;

            // empties container to prevent duplicating cards
            $("#container").empty();

            for (var i = 0; i < 8; i++) {
                // creates time, temp, humidity, and windspeed variables for hourly weather info
                var time = moment(data.hourly.time[x]).format("h:mm A")
                var temp = data.hourly.temperature_2m[x]
                var humidity = data.hourly.relativehumidity_2m[x]
                var windSpeed = data.hourly.windspeed_10m[x]

                // convert degrees to cardinal direction
                var windDirDeg = data.hourly.winddirection_10m[x]
                if (windDirDeg > 337.5 && windDirDeg < 361 || windDirDeg >= 0 && windDirDeg < 23) {
                    windDirection = "N"
                } else if (windDirDeg > 22 && windDirDeg < 68) {
                    windDirection = "NE"
                } else if (windDirDeg > 67 && windDirDeg < 113) {
                    windDirection = "E"
                } else if (windDirDeg > 112 && windDirDeg < 158) {
                    windDirection = "SE"
                } else if (windDirDeg > 157 && windDirDeg < 203) {
                    windDirection = "S"
                } else if (windDirDeg > 202 && windDirDeg < 248) {
                    windDirection = "SW"
                } else if (windDirDeg > 247 && windDirDeg < 293) {
                    windDirection = "W"
                }else if (windDirDeg > 292 && windDirDeg < 338) {
                    windDirection = "NW"
                }

                // weather image based on weathercode
                var weatherCode = data.hourly.weathercode[x]
                var weatherIconId = "";
                if (weatherCode === 0) {
                    weatherIconId = "sunny";
                } else if (weatherCode > 0 && weatherCode < 4) {
                    weatherIconId = "partly-cloudy";
                } else if (weatherCode > 4 && weatherCode < 50) {
                    weatherIconId = "cloudy";
                } else if (weatherCode > 50) {
                    weatherIconId = "rain";
                }
                var weatherIcon = "./assets/imgs/" + weatherIconId + ".png";

                // create html elements for data
                var container = $("#container");
                var article = $("<div>")
                    .addClass("bg-gray-300 flex flex-wrap justify-center rounded-md shadow-lg m-10 text-center w-1/6")
                var textContainer = $("<div>")    
                    .addClass("text-center")
                var cardContainer = $("<div>")
                    .addClass("content-center")
                var img = $("<img>")
                    .addClass("m-auto rounded overflow-hidden h-48 w-full")
                    .attr("src", weatherIcon)
                var infoContainer = $("<div>")
                var timeEl = $("<h4>")
                    .addClass("p-2 text-xl")
                    .text(time)
                var tempEl = $("<h4>")
                .addClass("p-2 text-left")
                .text("Temperature: " + temp)
                var humidityEl = $("<h4>")
                    .addClass("p-2 text-left")
                    .text("Humidity: " + humidity + "%")
                var windEl = $("<h4>")
                    .addClass("p-2 text-left")
                    .text("Wind Speed: " + windSpeed + "mp/h")
                var windDirectionEl = $("<h4>")
                    .addClass("p-2 text-left")
                    .text("Wind Direction: " + windDirection)

                // appends created html elements
                container.append(article);
                article.append(textContainer);
                textContainer.append(cardContainer);
                cardContainer.append(img, infoContainer);
                infoContainer.append(timeEl, tempEl, humidityEl, windEl, windDirectionEl)

                // moves to next object in array for loop
                x = x + 1
            }
        })
}

// saves last search and loads it when page loads
var saveCurrentSearch = function (searchInfo) {
    // clears previous save
    localStorage.clear();

    localStorage.setItem("city", searchInfo.city)
    localStorage.setItem("timeVar", searchInfo.foreTime)
}

// if there is any data in localstorage then pass that info to getcityname() function
var loadLastSearch = function() {
    if (localStorage.length > 0) {
        var searchInfo = {
            city: localStorage.getItem("city"),
            foreTime: localStorage.getItem("timeVar")
        }
        getCityName(searchInfo)
    }
};

// gets city name from search box 
$("#search").on('click', function(event) {
    event.preventDefault();    
    // checks if city name was entered
    var text = $("#city-name").val();
    if (text === "") {
        $("#city-name").attr("placeholder", "Please Enter City!");
    } else {
        // grabs cityname from text box and hourly or daily option
        var cityName = $("#city-name").val()
        var forecastTime = $("#weather-time").val()
        var searchInfo = {
            city: cityName,
            foreTime: forecastTime
        }
        getCityName(searchInfo);
        saveCurrentSearch(searchInfo);
    }
})

// calls load search function everytime page is loaded
loadLastSearch();