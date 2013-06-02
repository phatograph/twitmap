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
    lng: LON,
    zoom: 12
  });

  function getTweetBoxString (tweet) {
    return "<a class='box' id='tb-" + tweet.id + "' href='#'>\
      <table>\
        <tr>\
          <td>\
            <p>" + tweet.text + "</p>\
            <div class='poster'>\
              <img src='" + tweet.user.profile_image_url + "' alt='" + tweet.user.name + "' height='42' width='42'>\
              <h5>" + tweet.created_at + "</h5>\
              <h4>" + tweet.user.name + "</h4>\
            </div>\
          </td>\
          <td class='icon'>\
            <i class='icon-double-angle-right'></i>\
          </td>\
        </tr>\
      </table>\
    </a>";
  }

  function populateTweets(tweets) {
    var navItem;
    var target = $('.map .info');

    tweets.reverse();

    $.each(tweets, function (key, tweet) {
      if (tweet.geo && !$('#tb-' + tweet.id).length) {
        var marker = addMarker(tweet);
        navItem = $(getTweetBoxString(tweet));
        navItem.on('click', function (e) {
          e.preventDefault();
          google.maps.event.trigger(marker, 'click');
        });
        target.prepend(navItem);
      }
    });
  }

  function addMarker (tweet) {
    // Return the added marker for reference back
    return map.addMarker({
      lat: tweet.geo.coordinates[0],
      lng: tweet.geo.coordinates[1],
      infoWindow: {
        content: "<div class='t-result'>\
          <img src='" + tweet.user.profile_image_url + "' alt='" + tweet.user.name + "' height='42' width='42'>\
          <p>" + tweet.text + "</p>\
        </div>"
      },
      click: function () {
        $('.info a.box').removeClass('active');
        $('#tb-' + tweet.id).addClass('active').focus();
      }
    });
  }

  function generateTriggerCallback (object, eventType) {
    return function() {
      google.maps.event.trigger(object, eventType);
      return false;
    };
  }

  GMaps.geolocate({
    success: function (position) {
      LAT = position.coords.latitude;
      LON = position.coords.longitude;

      map.setCenter(position.coords.latitude, position.coords.longitude);
      map.setZoom(12);
      map.addMarker({
        lat: LAT,
        lng: LON,
        icon: 'http://asset.phatograph.com/images/oozou-angelhack.png'
      });
      // map.drawCircle({
      //   lat: LAT,
      //   lng: LON,
      //   radius: 5000,
      //   fillOpacity: 0.2,
      //   strokeOpacity: 0.2
      // });
    },
    error: function(error) {
      alert('Geolocation failed: ' + error.message);
    },
    not_supported: function() {
      alert("Your browser does not support geolocation");
    }
  });

  var recurseFunc;
  function getTweets () {
    console.log('Getting tweet ..');
    var q = $('#search').val();

    $.ajax({
      type: "GET",
      url: "/tweets.json",
      data: "q=" + q + "&geocode=" + LAT + "," + LON + ",5km",
      success: function(tweets){
        console.log('Done!');

        $('#searchBtn').removeAttr('disabled');
        $('table.loader').hide();

        populateTweets(tweets);
        // Recursive call, resulting in fake live reload
        if (recurseFunc) clearTimeout(recurseFunc);
        recurseFunc = setTimeout(getTweets, 1000 * 60 * 0.5); // Minutes
      }
    });
  }

  $(document)
    .on('click', '#searchBtn', function (e) {
      e.preventDefault();
      var q = $('#search').val();

      if (q) {
        $('#searchBtn').attr('disabled', true);
        $('.map .info')
          .html('<table class="loader" style="display: none;"><tr><td><p class="loader">Loading ..</p></td></tr></table>')
          .find('.loader').fadeIn();

        map.removeMarkers();
        map.addMarker({
          lat: LAT,
          lng: LON,
          icon: 'http://asset.phatograph.com/images/oozou-angelhack.png'
        });

        getTweets();
      }
    });

  $('#search').focus();
});
