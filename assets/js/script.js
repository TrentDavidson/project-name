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
            // logs available data
            console.log(data)  
            
            // empty container to avoid duplication
            $("#container").empty();

            // change "your 7 day forecast" to the cities name
            var weatherCityTitle = $("#weather-title")
            weatherCityTitle.text(window.locationData.city + "'s 7 Day Forecast")

            // display locations weather data
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
                console.log(moment(data.daily.time[i]))

                // create html elements 
                var container = $("#container");
                var article = $("<article>")
                    .addClass("bg-gray-300 flex flex-wrap justify-between rounded-md shadow-lg m-5 pb-1 w-1/2")
                var textContainer = $("<div>")    
                    .addClass("text-center")
                var cardContainer = $("<div>")
                // var img = 
                var infoContainer = $("<div>")
                var dateEl = $("<h4>")
                    .addClass("p-2 text-xl")
                    .text(date)
                var tempEl = $("<h4>")
                    .addClass("p-2")
                    .text(averageTemp)
                var windEl = $("<h4>")
                    .addClass("p-2")
                    .text(windSpeed)
                
                // appends created html elements

                container.append(article);
                article.append(textContainer);
                textContainer.append(cardContainer);
                cardContainer.append(infoContainer);
                infoContainer.append(dateEl, tempEl, windEl);
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
$("#search").on('click', function(event) {
    event.preventDefault();    
    // checks if city name was entered
    var text = $("#city-name").val();
    if (text === "") {
        $("#city-name").attr("placeholder", "Please Enter City!");
    } else {
        getCityName();
    }
    
    
})

