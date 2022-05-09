// var apiUrlGeo = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York"
var apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York"


var weatherData = function() {
    // retrieves data from apiUrl
    fetch(apiUrl)
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

// calls weatherData function (geocode will call later and enter the long and lat)
weatherData();


