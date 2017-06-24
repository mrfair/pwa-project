var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 13.9756666, lng: 100.7929154 },
    zoom: 15
  });
  infoWindow = new google.maps.InfoWindow;

  map.addListener( 'click', function( e ) {
    var pos = {
      lat : e.latLng.lat(),
      lng : e.latLng.lng()
    };

    var contentString =
                '<table style="font-size:10px; line-height:22px; font-weight:bold; text-align:center;" class="ml10" cellpadding="0" cellspacing="0" border="0"><tr valign="bottom"><td><img src="/image/addgopoo.png" id="bt_addmodal_show"></td><td rowspan="2" width="20"></td><td><img src="/image/findgopoo.png" height="64" id="bt_place_search"></td></tr><tr><td><span style="margin-left:-10px;">Add GoPoo</span></td><td>Find GoPoo</td></tr></table>';
    infoWindow.setPosition(pos);
    infoWindow.setContent( contentString );
    infoWindow.open(map);
    map.setCenter(pos);

    $( "#bt_place_search" )
      .unbind( "click" )
      .bind( "click", function() {
        placeshow( pos );
        infoWindow.close();
      });

    $( "#bt_addmodal_show" )
      .unbind( "click" )
      .bind( "click", function() {
        $( '#addModal' ).modal('show');
        infoWindow.close();
      });
  });
}

function placeshow( pos ) {
  /**ค้นหาสถานที่ **/
  var keyword = ['gas', 'worship', 'market'];
  $.each( keyword, function( k, v ) {
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: pos,
      radius: 4000,
      keyword: [v]
    }, callback);
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
      placeshow( pos );

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
    if( results.length > 0 ) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    } else {
      alert( "ซวยล่ะ ไม่พบจุด GoPoo แถวๆนี้!" );
    }
  }

}
var place_cache = {};
function createMarker(place) {
  var p = place;
  var lo = gp.lo_db_convert( 'p' + p.geometry.location.lat() + p.geometry.location.lng() ) ;

  var placeLoc = p.geometry.location;
  var marker = new google.maps.Marker({
    id: lo,
    map: map,
    position: p.geometry.location,
    icon: "/image/mapicon22.png",
  });

  google.maps.event.addListener( marker, 'click', function() {
    gp.modal_detail( p, lo );
    /*
    infowindow.setContent(place.name);
    infowindow.open(map, this);
    */
  });

  place_cache[lo] = p;
}
