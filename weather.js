// var searchHistoryJSON = localStorage.getItem("City-searched");
// var searchHistory = searchHistoryJSON ? JSON.parse(searchHistoryJSON) : { cities: [] };

// var last = searchHistory.cities.slice(-1);
// displayHistory(searchHistory.cities)
// console.log(searchHistory.cities)
// displaySearch(last);



var currentWeather = document.querySelector(".col-sm-8");
console.log("Content:", currentWeather)


var searchbtn = document.querySelector("button")
var searchVal = "";

searchbtn.addEventListener("click", function (event) {
    event.preventDefault();

    var parentEl = this.parentElement;
    searchVal = parentEl.querySelector("#city").value;
    

    //This if condition will display an error  message if the search field is empty and save the city to the local storage
    if (searchVal === "") {
        $('#errorMsg').attr("style", "color:red")
        $('#errorMsg').text("Please enter a valid City name");
    } else {
        $('#errorMsg').empty();
        //currentWeather.innerHTML=" ";
        //currentWeather.innerHTML = "";

    //This function also performs the function that dispalay all the weather conditions
       // retrieveAPI(searchVal)
     

        // searchHistory.cities.push(searchVal);
        // localStorage.setItem('City-searched', JSON.stringify(searchHistory));
        // $(".daily").attr("style", "display:hide")

    }
    //currentWeather.innerHTML = "";

    //This function also performs the function that dispalay all the weather conditions
    retrieveAPI(searchVal)
     


});
//currentWeather.innerHTML=" ";

//Create a new Div and set its attribute to append all the weather items   
var weather = $("<div>");
//    weather.addClass(".displayCity");
//    weather.css("border", "0.5px solid gray ");
//    weather.css("margin", "5px");
//    weather.css("padding", "5px");
//    weather.css("border-radius", "5px");


//function retrieve data from the weather API and populate the Temp and wheather conditions on the page.  
function retrieveAPI(searchVal) {
    //Set the date 
    var date = new Date();
    date = moment().format('L');
    var currentTime = moment().format("H");

    // This is my API key
    var APIKey = "eeab2a767f4b39347cacd521da7d158c";

    // Here I'm building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal + "&appid=" + APIKey;


    // Here I'm running   AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // Im storing all of the retrieved data inside of an object called "response"
        .then(function (response) {

            console.log("response: ", response)
            //set weather condition variable
            var weatherCondition = response.weather[0].main;
            //create an image element to append the icons
            var image = $("<img>");

            var imageUrl = "http://openweathermap.org/img/wn/13d@2x.png";

            //Set conditional statement to display the weather icon during snow time 
            if (weatherCondition !== "Snow") {

                //Set conditional statement to display the weather icon during day time 
                if (currentTime <= 17) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02d@2x.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10d@2x.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01d@2x.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50d@2x.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11d@2x.png";
                            break;

                    }
                } else if (currentTime >= 18) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02n@2x.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10n@2x.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01n@2x.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50n@2x.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11n@2x.png";
                            break;

                    }

                }
                image.attr("src", imageUrl);
            }

            //Convert the temparature into F
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            //truncate it to 2 digits
            var temparature = tempF.toFixed(2);
            //Set humidity variable and content
            var humidity = response.main.humidity
            //Set wind variable and content
            var wind = response.wind.speed
            //Set Longitute of a searched city
            var Long = response.coord.lon
            console.log("long: ", Long);
            //Set Latitude of a searched city
            var Lat = response.coord.lat;
            console.log("lat: ", Lat);

            // var IndexValue;
            // console.log(IndexValue)
            // //Create a new Div and set its attribute to append all the weather items   
            //var weather = $("<div>");
            weather.addClass(".displayCity");
            weather.css("border", "0.5px solid gray ");
            weather.css("margin", "5px");
            weather.css("padding", "5px");
            weather.css("border-radius", "5px");

            //display the City and date in h4 tag appended to the div container
            var cityEl = $("<h4>");
            cityEl.addClass("city");
            cityEl.attr("margin:10px")
            cityEl.text(searchVal + "(" + date + ")");
            cityEl.append(image)
            weather.append(cityEl);

            //display the Temparature in a li  tag appended to the div container
            var temp = $("<p>");
            temp.addClass("tempature");
            temp.text("Temparature: " + temparature + " °F");
            weather.append(temp);

            //display the Humidity in an li tag appended to the div container
            var Humidity = $("<p>");
            Humidity.addClass("humidity");
            Humidity.text("Humidity: " + humidity + " %")
            weather.append(Humidity);

            //display the Wind in an li tag appended to the div container
            var Wind = $("<p>");
            Wind.addClass("humidity");
            Wind.text("Wind-Speed:  " + wind + " mph")
            weather.append(Wind);
            retrieveUVInexAPI(Lat, Long)
            //prepend all the city weather information to the div main container
            $(".currentForecast").append(weather);
            
            //retrieveUVInexAPI(Lat, Long)


        })




}


//function retrieve data from the weather API and populate the Temp and wheather conditions on the page.  
function retrieveUVInexAPI(Lat, Long) {

    // This is my API key
    var APIKey = "eeab2a767f4b39347cacd521da7d158c";

    // Here I'm building the URL we need to query the database
    var queryURL1 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + Lat + "&lon=" + Long + "&appid=" + APIKey;

    // Here I'm running   AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL1,
        method: "GET"
    })
        // Im storing all of the retrieved data inside of an object called "response"
        .then(function (response) {
            var result = response;

            var IndexValue = result.value;

            //var IndexValue = result.value;

            //display the UV-Index in an p tag appended to the div container
            var Index = $("<p>");
            Index.addClass("uv-index");
            Index.text(IndexValue);
            weather.append("UV Index:  ", Index);
            //prepend all the city weather information to the div main container
            $(".currentForecast").append(weather);



        })
        
}