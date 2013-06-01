// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require GMaps-043
//= require_tree .

$(document).ready(function() {

  GMaps.geolocate({
    success: function(position) {
      map.setCenter(position.coords.latitude, position.coords.longitude);
      $.ajax({
        type: "GET",
        url: "/tweets.json",
        data: "geocode="+position.coords.latitude+","+position.coords.longitude+",3km",
        success: function(tweets){
          tweets.each
          $.each( tweets, function( key, tweet ) {
            console.log(tweet);
            if(tweet.geo){
              map.addMarker({
                lat: tweet.geo.coordinates[0],
                lng: tweet.geo.coordinates[1],
                title: 'tweet',
                click: function(e) {
                  alert('tweet');
                }
              });
            };
          });

        }
      });

    },
    error: function(error) {
      alert('Geolocation failed: '+error.message);
    },
    not_supported: function() {
      alert("Your browser does not support geolocation");
    }
    // ,
    // always: function() {
    //   alert("Done!");
    // }
  });

  var map = new GMaps({
    div: '#map',
    lat: -12.043333,
    lng: -77.028333,
    // lat: 13.737467,
    // lng: 100.560501,
    markers: gon.tweet_geos,
    click: function(e) {
      alert('click');
    }
  });

});
