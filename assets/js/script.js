// recieves input from text box and sends to geoCoder
var getCityName = function () {
    // grabs cityname from text box and hourly or daily option
    var cityName = $("#city-name").val()
    var forecastTime = $("#weather-time").val()

    // converts city name into lat and long for weather api to read
    var apiGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" + cityName + "&count=1"
    fetch(apiGeo)
    .then(response => response.json())
    .then(data => {
        // creates array with long, lat, and city name
        var location = {
            longitude: data.results[0].longitude,
            latitude: data.results[0].latitude,
            city: data.results[0].name
        };

        // send location array to one of the weather funciton based on drop down option
        if (forecastTime === "Daily") {
            weatherDataDaily(location);
        } else if (forecastTime === "Hourly") {
            weatherDataHourly(location);
        };
    })
    
}



// retreives daily information from api
var weatherDataDaily = function(location) {
    var longitude = location.longitude
    var latitude = location.latitude
    var apiUrlDaily = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York"

    // retrieves data from apiUrl
    fetch(apiUrlDaily)
        .then(response => response.json())
        .then(data => {
            // logs available data
            console.log(data)  

            for (var i = 0; i < 7; i++) {

                // sets variables for weather data
                var maxTemp = data.daily.temperature_2m_max[i];
                var minTemp = data.daily.temperature_2m_min[i];
                var averageTempMath = (maxTemp + minTemp) / 2;
                // gets average of max and min temperature and rounds to nearest hundredths place
                var averageTemp = averageTempMath.toFixed(2) + "\u00B0F";

                // windspeed in mph
                var windSpeed = data.daily.windspeed_10m_max[i] + "mp/h";

                // sunrise and sunset times (24h time)
                var sunriseSplit = data.daily.sunrise[i].split("T");
                var sunrise = sunriseSplit[1];
                var sunsetSplit = data.daily.sunset[i].split("T");
                var sunset = sunsetSplit[1];

                // gets date and formats it to MM/DD/YYYY
                var dateUn = data.daily.time[i];
                var dateAr = dateUn.split("-");
                var date = dateAr[1] + "/" + dateAr[2] + "/" + dateAr[0];

                // date , average temp, wind speed , sunrise to sunset 
                console.log(date + " ", averageTemp + ", " + windSpeed + ", ", sunrise + " -> " + sunset);
            }
        }) 
}

// retrieves hourly information from api
var weatherDataHourly = function(location) {
    var longitude = location.longitude
    var latitude = location.latitude
    var apiUrlHourly = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m,winddirection_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York"
    fetch(apiUrlHourly)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            
            for (var i = 0; i < 24; i++) {
                var timeAr = data.hourly.time[i]
                var currentTime = moment().format('YYYY-MM-DDTHH:00');
                console.log(currentTime)
                console.log(timeAr)
                if (timeAr === currentTime) {
                    console.log("EQUAL")
                    var startIndex = i;
                    break;
                }
            }
            console.log(startIndex)
        })
}

// gets city name from search box 
$("#submit").on('click', function(event) {
    event.preventDefault();
    getCityName();
})

