//On page load trying to get the local storage value first and if it doesn't exist create it as an object
var searchHistoryJSON = localStorage.getItem("City-searched");
var searchHistory = searchHistoryJSON ? JSON.parse(searchHistoryJSON) : { cities: [] };
var cities = searchHistory.cities;
//set a variable for the last searched city
var lastCity = searchHistory.cities.slice(-1);


//Declare some gobal variables 
var currentWeather = document.querySelector(".currentForecast");
var dailyContainer1 = document.querySelector("#day1");
var dailyContainer2 = document.querySelector("#day2");
var dailyContainer3 = document.querySelector("#day3");
var dailyContainer4 = document.querySelector("#day4");
var dailyContainer5 = document.querySelector("#day5");
var h5Element = document.querySelector("#days");


var searchbtn = document.querySelector("button");
var searchVal = "";

//add Event Listner to grab the search result on click
searchbtn.addEventListener("click", function (event) {
    event.preventDefault();

    var parentEl = this.parentElement;
    searchVal = parentEl.querySelector("#city").value;


    //This if condition will display an error  message if the search field is empty and save the city to the local storage
    if (searchVal === "" || !lastCity || !cities) {
        $('#errorMsg').attr("style", "color:red")
        $('#errorMsg').text("Please enter a valid City name");
        return
    } else {
        $('#errorMsg').empty();
        var tableRow = $("<tr>");
        tableRow.addClass("cityRow");
        var tableTd = $("<td>");
        tableTd.addClass("savedCity")
        var tableContent = tableTd.text(searchVal);
        tableTd.append(tableContent);
        tableRow.append(tableTd);
        $(".table").append(tableRow);

        //add each city searched into the array of cities
        searchHistory.cities.push(searchVal);
        //Stringify and  set  the object of "City-searched" to show each city in the array of cities
        localStorage.setItem('City-searched', JSON.stringify(searchHistory));

    }
    //clearing containers after every append. 
    currentWeather.innerHTML = "";
    dailyContainer1.innerHTML = "";
    dailyContainer2.innerHTML = "";
    dailyContainer3.innerHTML = "";
    dailyContainer4.innerHTML = "";
    dailyContainer5.innerHTML = "";
    //This function also performs the function that dispalay all the weather conditions
    retrieveCurrentWeatherAPI(searchVal)

    //Displaying all Five days forecast in this functions
    FiveDaysForecastAPI(searchVal)


});

//Function to append all the cities search for on under the search input  
function displayHistory(cities) {

    if (cities === null) {
        return;

    } else {
        cities.forEach(function (city) {
            var tableRow = $("<tr>");
            tableRow.addClass("cityRow");
            var tableTd = $("<td>");
            tableTd.addClass("savedCity")
            var tableContent = tableTd.text(city);
            tableTd.append(tableContent);
            tableRow.append(tableTd);
            $(".table").append(tableRow);

        })
        //calling current weather function
        retrieveCurrentWeatherAPI(lastCity)

        //Displaying all Five days forecast in this functions
        FiveDaysForecastAPI(lastCity)
    }
}
//Calling the History funtion here- it will display the last search city content on refresh
displayHistory(cities)


//Jquery to call the displaySearch function when each one of the city name is clicked.
$(document).on("click", ".savedCity", function (event) {
    event.preventDefault();
    //clearing containers after every append. 
    currentWeather.innerHTML = "";
    dailyContainer1.innerHTML = "";
    dailyContainer2.innerHTML = "";
    dailyContainer3.innerHTML = "";
    dailyContainer4.innerHTML = "";
    dailyContainer5.innerHTML = "";
    //get the text of the city clicked
    cityHistory = this.textContent;
    retrieveCurrentWeatherAPI(cityHistory);
    FiveDaysForecastAPI(cityHistory);

});


//function retrieve data from the weather API and populate the Temp and wheather conditions on the page.  
function retrieveCurrentWeatherAPI(searchVal) {

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
    .then(function (response) {

     if(!response) {
        console.log('error')
          
     }    
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
             
            //Set Latitude of a searched city
            var Lat = response.coord.lat;
            
            // Set  css attribute for the div that will hold all the appended  weather items   
            $(".currentForecast").css("border", "0.5px solid gray ");
            $(".currentForecast").css("margin", "5px");
            $(".currentForecast").css("padding", "5px");
            $(".currentForecast").css("border-radius", "5px");

            //display the City and date in h4 tag appended to the div container
            var cityEl = $("<h4>");
            cityEl.addClass("city");
            cityEl.attr("margin:10px")
            cityEl.text(searchVal + " (" + date + ")");
            cityEl.append(image)
            //append all the city weather information to the div main container
            $(".currentForecast").append(cityEl)

            //display the Temparature in a li  tag appended to the div container
            var temp = $("<p>");
            temp.addClass("tempature");
            temp.text("Temparature: " + temparature + " °F");
            //append all the city weather information to the div main container
            $(".currentForecast").append(temp)

            //display the Humidity in an li tag appended to the div container
            var Humidity = $("<p>");
            Humidity.addClass("humidity");
            Humidity.text("Humidity: " + humidity + " %")
            //append all the city weather information to the div main container
            $(".currentForecast").append(Humidity)

            //display the Wind in an li tag appended to the div container
            var Wind = $("<p>");
            Wind.addClass("humidity");
            Wind.text("Wind-Speed:  " + wind + " mph")
            //append all the city weather information to the div main container
            $(".currentForecast").append(Wind)

            retrieveUVInexAPI(Lat, Long);


        })

}


//function retrieve UV-Index data from the weather API and populate on the page.  
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
        // store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            var result = response;

            var IndexValue = result.value;
            //display the UV-Index in an p tag appended to the div container
            var Index = $("<p>");
            Index.addClass("uv-index");
            Index.text(IndexValue);

            //prepend all the city weather information to the div main container
            $(".currentForecast").append("UV Index:  ", Index);
        
        })
}






//function retrieve UV-Index data from the weather API and populate on the page.  
function FiveDaysForecastAPI(searchVal) {

    var date = new Date();
    date = moment().format('L');
    var currentTime = moment().format("H");
    // This is my API key
    var APIKey = "eeab2a767f4b39347cacd521da7d158c";

    // Here I'm building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchVal + ",us" + "&appid=" + APIKey;


    // Here I'm running   AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // Im storing all of the retrieved data inside of an object called "response"
        .then(function (response) {

            //set weather condition variable
            var weatherCondition = response.list[3].weather[0].main;

            //create an image element to append the icons
            var image = $("<img>");


            var imageUrl = "http://openweathermap.org/img/wn/13d.png";

            //Set conditional statement to display the weather icon during snow time 
            if (weatherCondition !== "Snow") {

                //Set conditional statement to display the weather icon during day time 
                if (currentTime <= 17) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02d.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10d.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01d.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50d.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11d.png";
                            break;

                    }
                } else if (currentTime >= 18) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02n.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10n.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01n.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50n.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11n.png";
                            break;
                    }

                }
                image.attr("src", imageUrl);
            }

            // //Convert the temparature into F
            var tempF = (response.list[3].main.temp - 273.15) * 1.80 + 32;
            //truncate it to 2 digits
            var temparature = tempF.toFixed(2);
            //Set humidity variable and content
            var humidity = response.list[3].main.humidity;

            //Set date variable and content 
            var Date1 = response.list[3].dt_txt;
            date1 = moment(Date1).format('L');


            //create another div to hold all the 5 days forcast
            $("#day1").attr("style", "color: red")
            $("#day1").attr("style", "background: royalblue")
            $("#day1").css("border", "0.5px solid gray ");
            $("#day1").css("margin", "5px");
            $("#day1").css("padding", "5px");
            $("#day1").css("border-radius", "5px");


            //display the City and date in h5 tag appended to the div container
            $("#days").text("5 Days Forecast: ");


            // //display the day 1 in a h6  tag appended to the div col-2
            var d1El = $("<h6>");
            d1El.text(date1);
            $("#day1").append(d1El);

            // //display the icon in an p tag appended to the div container
            var icon = $("<p>");
            icon.append(image);
            $("#day1").append(icon);

            //display the Temparature in a p  tag appended to the div col-2
            var temp = $("<p>");
            temp.text("Temp: " + temparature + " °F");
            $("#day1").append(temp);

            //display the Humidity in an p tag appended to the div container
            var Humidity = $("<p>");
            Humidity.text("Humidity: " + humidity + " %")
            $("#day1").append(Humidity);



            // ################################Second Day Forecast######################

            //set weather condition variable
            var weatherCondition = response.list[10].weather[0].main;

            //create an image element to append the icons
            var image = $("<img>");


            var imageUrl = "http://openweathermap.org/img/wn/13d.png";

            //Set conditional statement to display the weather icon during snow time 
            if (weatherCondition !== "Snow") {

                //Set conditional statement to display the weather icon during day time 
                if (currentTime <= 17) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02d.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10d.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01d.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50d.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11d.png";
                            break;

                    }
                } else if (currentTime >= 18) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02n.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10n.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01n.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50n.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11n.png";
                            break;
                    }

                }
                image.attr("src", imageUrl);
            }

            // //Convert the temparature into F
            var tempF = (response.list[10].main.temp - 273.15) * 1.80 + 32;
            //truncate it to 2 digits
            var temparature = tempF.toFixed(2);
            //Set humidity variable and content
            var humidity = response.list[10].main.humidity;

            //Set date variable and content 
            var Date1 = response.list[10].dt_txt;
            date1 = moment(Date1).format('L');


            //create another div to hold all the 5 days forcast
            $("#day2").attr("style", "color: red")
            $("#day2").attr("style", "background: royalblue")
            $("#day2").css("border", "0.5px solid gray ");
            $("#day2").css("margin", "5px");
            $("#day2").css("padding", "5px");
            $("#day2").css("border-radius", "5px");

            // //display the day 1 in a h6  tag appended to the div col-2
            var d1El = $("<h6>");
            d1El.text(date1);
            $("#day2").append(d1El);


            // //display the icon in an p tag appended to the div container
            var icon = $("<p>");
            icon.append(image);
            $("#day2").append(icon);

            //display the Temparature in a p  tag appended to the div col-2
            var temp = $("<p>");
            temp.text("Temp: " + temparature + " °F");
            $("#day2").append(temp);

            //display the Humidity in an p tag appended to the div container
            var Humidity = $("<p>");
            Humidity.text("Humidity: " + humidity + " %")
            $("#day2").append(Humidity);



            // ##################### Third Day Forecast######################

            //set weather condition variable
            var weatherCondition = response.list[17].weather[0].main;

            //create an image element to append the icons
            var image = $("<img>");


            var imageUrl = "http://openweathermap.org/img/wn/13d.png";

            //Set conditional statement to display the weather icon during snow time 
            if (weatherCondition !== "Snow") {

                //Set conditional statement to display the weather icon during day time 
                if (currentTime <= 17) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02d.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10d.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01d.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50d.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11d.png";
                            break;

                    }
                } else if (currentTime >= 18) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02n.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10n.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01n.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50n.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11n.png";
                            break;
                    }

                }
                image.attr("src", imageUrl);
            }

            // //Convert the temparature into F
            var tempF = (response.list[17].main.temp - 273.15) * 1.80 + 32;
            //truncate it to 2 digits
            var temparature = tempF.toFixed(2);
            //Set humidity variable and content
            var humidity = response.list[17].main.humidity;

            //Set date variable and content 
            var Date1 = response.list[17].dt_txt;
            date1 = moment(Date1).format('L');

            //create another div to hold all the 5 days forcast
            $("#day3").attr("style", "color: red")
            $("#day3").attr("style", "background: royalblue")
            $("#day3").css("border", "0.5px solid gray ");
            $("#day3").css("margin", "5px");
            $("#day3").css("padding", "5px");
            $("#day3").css("border-radius", "5px")

            // //display the day 1 in a h6  tag appended to the div col-2
            var d1El = $("<h6>");
            d1El.text(date1);
            $("#day3").append(d1El);


            // //display the icon in an p tag appended to the div container
            var icon = $("<p>");
            icon.append(image);
            $("#day3").append(icon);

            //display the Temparature in a p  tag appended to the div col-2
            var temp = $("<p>");
            temp.text("Temp: " + temparature + " °F");
            $("#day3").append(temp);

            //display the Humidity in an p tag appended to the div container
            var Humidity = $("<p>");
            Humidity.text("Humidity: " + humidity + " %");
            $("#day3").append(Humidity);


            // ##################### Fourth Day Forecast######################

            //set weather condition variable
            var weatherCondition = response.list[25].weather[0].main;

            //create an image element to append the icons
            var image = $("<img>");


            var imageUrl = "http://openweathermap.org/img/wn/13d.png";

            //Set conditional statement to display the weather icon during snow time 
            if (weatherCondition !== "Snow") {

                //Set conditional statement to display the weather icon during day time 
                if (currentTime <= 17) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02d.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10d.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01d.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50d.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11d.png";
                            break;

                    }
                } else if (currentTime >= 18) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02n.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10n.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01n.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50n.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11n.png";
                            break;
                    }

                }
                image.attr("src", imageUrl);
            }

            // //Convert the temparature into F
            var tempF = (response.list[25].main.temp - 273.15) * 1.80 + 32;
            //truncate it to 2 digits
            var temparature = tempF.toFixed(2);
            //Set humidity variable and content
            var humidity = response.list[25].main.humidity;

            //Set date variable and content 
            var Date1 = response.list[25].dt_txt
            date1 = moment(Date1).format('L');

            //create another div to hold all the 5 days forcast
            $("#day4").attr("style", "color: red")
            $("#day4").attr("style", "background: royalblue")
            $("#day4").css("border", "0.5px solid gray ");
            $("#day4").css("margin", "5px");
            $("#day4").css("padding", "5px");
            $("#day4").css("border-radius", "5px");

            // //display the day 1 in a h6  tag appended to the div col-2
            var d1El = $("<h6>");
            d1El.text(date1);
            $("#day4").append(d1El);


            // //display the icon in an p tag appended to the div container
            var icon = $("<p>");
            icon.append(image);
            $("#day4").append(icon);

            //display the Temparature in a p  tag appended to the div col-2
            var temp = $("<p>");
            temp.text("Temp: " + temparature + " °F");
            $("#day4").append(temp);

            //display the Humidity in an p tag appended to the div container
            var Humidity = $("<p>");
            Humidity.text("Humidity: " + humidity + " %")
            $("#day4").append(Humidity);


            // ##################### Fith Day Forecast######################

            //set weather condition variable
            var weatherCondition = response.list[33].weather[0].main;

            //create an image element to append the icons
            var image = $("<img>");


            var imageUrl = "http://openweathermap.org/img/wn/13d.png";

            //Set conditional statement to display the weather icon during snow time 
            if (weatherCondition !== "Snow") {

                //Set conditional statement to display the weather icon during day time 
                if (currentTime <= 17) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02d.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10d.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01d.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50d.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11d.png";
                            break;

                    }
                } else if (currentTime >= 18) {
                    switch (weatherCondition) {
                        case "Clouds":
                            imageUrl = "http://openweathermap.org/img/wn/02n.png";
                            break;
                        case "Rain":
                            imageUrl = "http://openweathermap.org/img/wn/10n.png";
                            break;
                        case "Clear":
                            imageUrl = "http://openweathermap.org/img/wn/01n.png";
                            break;
                        case "Mist":
                            imageUrl = "http://openweathermap.org/img/wn/50n.png";
                            break;
                        case "Thunderstorm":
                            imageUrl = "http://openweathermap.org/img/wn/11n.png";
                            break;
                    }

                }
                image.attr("src", imageUrl);
            }

            // //Convert the temparature into F
            var tempF = (response.list[33].main.temp - 273.15) * 1.80 + 32;
            //truncate it to 2 digits
            var temparature = tempF.toFixed(2);
            //Set humidity variable and content
            var humidity = response.list[33].main.humidity;

            //Set date variable and content 
            var Date1 = response.list[33].dt_txt
            date1 = moment(Date1).format('L');

            //create another div to hold all the 5 days forcast
            $("#day5").attr("style", "color: red")
            $("#day5").attr("style", "background: royalblue")
            $("#day5").css("border", "0.5px solid gray ");
            $("#day5").css("margin", "5px");
            $("#day5").css("padding", "5px");
            $("#day5").css("border-radius", "5px");

            // //display the day 1 in a h6  tag appended to the div col-2
            var d1El = $("<h6>");
            d1El.text(date1);
            $("#day5").append(d1El);


            // //display the icon in an p tag appended to the div container
            var icon = $("<p>");
            icon.append(image);
            $("#day5").append(icon);

            //display the Temparature in a p  tag appended to the div col-2
            var temp = $("<p>");
            temp.text("Temp: " + temparature + " °F");
            $("#day5").append(temp);

            //display the Humidity in an p tag appended to the div container
            var Humidity = $("<p>");
            Humidity.text("Humidity: " + humidity + " %")
            $("#day5").append(Humidity);


        })
}