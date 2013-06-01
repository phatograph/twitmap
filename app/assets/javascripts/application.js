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

  var LAT = 13.711901;
  var LON = 100.581809;
  var map = new GMaps({
    div: '#map',
    lat: LAT,
    lng: LON
  });

  function populateTweets(tweets){
    var navbarString = "";

    $.each(tweets, function (key, tweet) {
      if (tweet.geo) {
        navbarString += "<a class='box' id='tb-" + tweet.id + "' href='#'>\
          <table>\
            <tr>\
              <td>\
                <p>" + tweet.text + "</p>\
                <h5>" + tweet.created_at + "</h5>\
                <h4>" + tweet.user.name + "</h4>\
              </td>\
              <td class='icon'>\
                <i class='icon-double-angle-right'></i>\
              </td>\
            </tr>\
          </table>\
        </a>"

        map.addMarker({
          lat: tweet.geo.coordinates[0],
          lng: tweet.geo.coordinates[1],
          infoWindow: {
            content: '<div class="t-result">' + tweet.text + '</div>'
          },
          click: function () {
            $('.info a.box').removeClass('active');
            $('#tb-' + tweet.id).addClass('active').focus();
          }
        });
      }
    });

    $('.map .info').html(navbarString);
  }

  GMaps.geolocate({
    success: function (position) {
      LAT = position.coords.latitude;
      LON = position.coords.longitude;

      map.setCenter(position.coords.latitude, position.coords.longitude);
      map.setZoom(12);
    },
    error: function(error) {
      alert('Geolocation failed: ' + error.message);
    },
    not_supported: function() {
      alert("Your browser does not support geolocation");
    }
  });

  $(document)
    .on('click', '#searchBtn', function (e) {
      e.preventDefault();
      var q = $('#search').val();
      var btn = $(this);

      if (q) {
        btn.attr('disabled', true);
        $('.map .info')
          .html('<table class="loader" style="display: none;"><tr><td><p class="loader">Loading ..</p></td></tr></table>')
          .find('.loader').fadeIn();
        map.removeMarkers();

        $.ajax({
          type: "GET",
          url: "/tweets.json",
          data: "q=" + q + "&geocode=" + LAT + "," + LON + ",10km",
          success: function(tweets){
            console.log('done!');
            btn.removeAttr('disabled');
            populateTweets(tweets);
          }
        });
      }
    });

  $('#search').focus();
});
