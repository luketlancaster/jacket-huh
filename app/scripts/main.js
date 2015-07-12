$(function(){

  var error,
      options,
      success,
      lat,
      lon,
      url,
      response,
      clickCount = 0;

  options = {
    timeout: 5000,
    maximumAge: 0
  };

  success = function(pos) {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    console.log("lat " + lat);
    console.log("lon " + lon);
    $.getJSON( url + "/q/" + lat + "," + lon + ".json", function( data ) {
      response = data;
    })
    .done(function() {
      display(response);
    })
  };

  error = function(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);

  url = "http://api.wunderground.com/api/db432a740561cd8d/forecast/geolookup"

  $(".button").click(function(){
    clickCount += 1;
    $.getJSON( url + "/q/" + lat + "," + lon + ".json", function( data ) {
      console.log(data)
      response = data;
    })
    .done(function() {
      console.log("Here's number two");
      display(response);
    })
  })

  function display(data) {
    var temp = data.forecast.simpleforecast.forecastday[1].high.fahrenheit;
    console.log(temp);
    if (temp > 80 && clickCount < 3) {
      $(".container").append("<h1>DON'T DO IT! IT'S TOO HOT!!!</h1>");
    }
    if (clickCount >= 3) {
      $(".container").append("<h1>IT'S STILL TOO HOT!!");
    }
  }
});
