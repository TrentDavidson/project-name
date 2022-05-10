var apiUrlHourly = "https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m,winddirection_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FNew_York"
var cityName = "greenwich"
var apiGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" + cityName + "&count=1"

var cityGeoLocation = function () {
    fetch(apiGeo)
        .then(response => response.json())
        .then(data => {
            var location = {
                longitude: data.results[0].longitude,
                latitude: data.results[0].latitude,
                city: data.results[0].name
            };
            
            weatherDataDaily(location)
        })
};

var weatherDataDaily = function(location) {
    console.log(location)
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

var weatherDataHourly = function() {
    fetch(apiUrlHourly)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            for (var i = 0; i < 6; i++) {
                var unix = data.hourly.time[i]
                var time = moment(unix);
                console.log(time)
                console.log(unix)
            }
        })
}

// calls daily weatherData function (geocode will call later and enter the long and lat)
// weatherDataHourly();
cityGeoLocation();


