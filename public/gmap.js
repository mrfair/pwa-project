var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 13.9756666, lng: 100.7929154 },
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow;

  map.addListener( 'click', function( e ) {
    alert( 1 );
    var pos = {
      lat : e.latLng.lat(),
      lng : e.latLng.lng()
    };
    infoWindow.setPosition(pos);
    infoWindow.setContent( 'Hellow world' );
    infoWindow.open(map);
  });
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

      mymarker( pos );
      map.setCenter(pos);

      /**ค้นหาสถานที่ **/
      var keyword = ['gas', 'worship', 'mall'];
      $.each( keyword, function( k, v ) {
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pos,
          radius: 3000,
          keyword: [v]
        }, callback);
      });

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

function mymarker( position ) {
  var mymarker = new google.maps.Marker({
    map: map,
    position: position,
    icon: "/image/myicon.png"
  });
}

function callback(results, status) {

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log( results );
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }

}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: "/image/mapicon22.png",
  });

  google.maps.event.addListener( marker, 'click', function() {
      console.log( db );
      $( "#mycomment" ).val( "" );
      $( "#myModal" ).modal('show');
      var p = place;
      console.log( p );
      map.setCenter( p.geometry.location );

      /* Check db */
      var lo = gp.lo_db_convert( 'p' + p.geometry.location.lat() + p.geometry.location.lng() ) ;

      if( !db[lo] ) {
        console.log( "insert db" );
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
                  '<span id="count_poohere">' +
                    db[lo].poohere +
                  '</span>' +
                  ' <a href="#" id="bt_poohere"><img src="/image/launcher-icon-2x.png" height="20" class="vb"><span class="vb ml5">GoPoo</span></a> ' +
                  ( p.photos ? gp.gguserphoto( p.photos ) : "" ) +
                '</div>';
        return r;
      });

      /**List comment**/
      if( db[lo] && db[lo].review ) {
        gp.comment_load( db[lo].review );
      } else {
        $( ".modal-body" ).html( "ยังไม่มีความคิดเห็น" );
      }

      $( "#bt_comment_add" )
        .unbind( "click" )
        .bind( "click", function() {
          var data =  {
            id : lo,
            comment : $( "#mycomment" ).val(),
            rating : $("#container_rateYo" ).attr( "data-rating" )
          };
          gp.db_insert_comment( data );
        });

      $( "#bt_poohere" )
        .unbind( "click" )
        .bind( "click", function() {
          gp.db_update_poohere( db[lo] );
        });

    /*
    infowindow.setContent(place.name);
    infowindow.open(map, this);
    */
  });
}
