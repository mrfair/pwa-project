var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 13.9756666, lng: 100.7929154 },
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow;
}

function locationNow() {
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      /**สถานที่ปัจุุบันและปักหมุด**/
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);

      /**ค้นหาสถานที่ **/
      var pyrmont = pos;

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: pyrmont,
        radius: 5000,
        keyword: ['store','gas','restaurant']
      }, callback);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }


}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function callback(results, status) {

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }

}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener( marker, 'click', function() {
      console.log( db );
      $( "#mycomment" ).val( "" );
      $('#myModal').modal('show');
      var p = place;
      map.setCenter( p.geometry.location );

      /* Check db */
      var lo = gp.lo_db_convert( 'p' + p.geometry.location.lat() + p.geometry.location.lng() ) ;

      if( !db.lo ) {
        var data = {
          id : lo,
          lat : p.geometry.location.lat(),
          lng : p.geometry.location.lng(),
          name : p.name
        };
        gp.db_insert_place( data );
      }


      $(".modal-title").html(function() {
        var r = '<div class="media-left">' +
                  '<a href="#">' +
                    '<img class="media-object" src="' + p.icon + '">' +
                  '</a>' +
                '</div>' +
                '<div class="media-body">' +
                  '<h4 class="media-heading mt10">' + p.name + '</h4>' +
                  '<p>' + p.vicinity + '</p>' +
                  ( p.photos ? gp.gguserphoto( p.photos ) : "" ) +
                '</div>';
        return r;
      });

    /*
    infowindow.setContent(place.name);
    infowindow.open(map, this);
    */
  });
}
