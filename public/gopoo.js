var gp = {
  gguserphoto : function( p ) {
    if( p[0].html_attributions[0] ) {
      var link = $( p[0].html_attributions[0] ).attr( "href" );
      return '<a target="_blank" href="' + link + '"><u> ภาพบรรยากาศ <span class="glyphicon glyphicon-new-window ml5 f12"></span></u></a>';
    }
  },
  lv : function( lv ) {
    var r = '';
    switch( lv ) {
      case "1" : case "2" :
        r = 'lv1.png';
      break;
      case "3" : case "4" :
        r = 'lv2.png';
      break;
      case "5" : case "6" :
        r = 'lv3.png';
      break;
      case "7" : case "8" :
        r = 'lv4.png';
      break;
      case "9" : case "10" :
        r = 'lv5.png';
      break;
    }
    return '<img src="/image/' + r + '">';
  },
  modal_detail : function( p, lo ) {
    if( p.geometry ) {
      pos_ = {
        lat : p.geometry.location.lat(),
        lng : p.geometry.location.lng()
      };
    } else {
      pos_ = {
        lat : parseFloat( p.lat ),
        lng : parseFloat( p.lng )
      };
    }

    map.setCenter( pos_ );

    $( "#mycomment" ).val( "" );
    $( "#myModal" ).modal('show');

    /* Check db */


    if( !db[lo] ) {
      var data = {
        id : lo,
        lat : pos_.lat,
        lng : pos_.lng,
        name : p.name,
        caption : p.vicinity,
        type : 0 //0 =gmap 1 = human
      };
      gp.db_insert_place( data, $( function() {}) );
    }

    $("#modal-detail-title").html(function() {
      var r = '<div class="media-left">' +
                '<a href="#">' +
                  '<img class="media-object" width="70" src="' + ( p.icon ? p.icon : "/image/launcher-icon-2x.png" ) + '">' +
                '</a>' +
              '</div>' +
              '<div class="media-body">' +
                '<h4 class="media-heading mt10">' + p.name + '</h4>' +
                '<p>' + ( p.vicinity ? p.vicinity : p.caption ) + '</p>' +
                '<span id="count_poohere" class="f16">' +
                  db[lo].poohere +
                '</span>' +
                ' <a href="#" id="bt_poohere"><span class="vb mr5">GoPoo(คลิก) </span><img src="/image/launcher-icon-2x.png" height="20" class="vb"></a> ' +
                ( p.photos ? '<br>' + gp.gguserphoto( p.photos ) : "" ) +
              '</div>';
      return r;
    });

    /**List comment**/
    if( db[lo] && db[lo].review ) {
      gp.comment_load( db[lo].review );
    } else {
      $( "#modal-detail-body" ).html( "ยังไม่มีความคิดเห็น" );
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
        if( confirm( "ยืนยันว่าได้ทำภารกิจในสถานที่แห่งนี้แล้วใช่หรือไม่? (คุณยังสามารถแสดงความคิดเห็นต่อบรรยากาศได้ในบริเวณพื้นที่แสดงความคิดเห็นด้านล่าง)") ) {
          gp.db_update_poohere( db[lo] );
        }
      });

  },
  lo_db_convert : function( a ) {
    return a.split(".").join("_");
  },
  db_insert_place : function( d, callback ) {
    var callback_  = callback;
    firebase.database().ref( d.id ).set({
      id : d.id,
      lat: d.lat,
      lng: d.lng,
      name : d.name,
      poohere : "0",
      caption : d.caption,
      type : d.type
    }, function( e ) {
      callback_;
    });
  },
  db_insert_comment : function( d ) {
    firebase.database().ref( d.id + '/review/' + moment().format('YYYY-MM-DD h:mm:ss') ).set({
      comment : d.comment,
      rating : d.rating,
      datetime : moment().format('MMMM Do YYYY, h:mm:ss a')
    }, function( e ) {
      alert( "เพิ่มความคิดเห็นของคุณแล้วนะ!" );
      gp.comment_load( db[d.id].review );
    });
  },
  db_update_poohere : function( d ) {

      firebase.database().ref( d.id ).update({
        poohere : ( parseInt( db[d.id].poohere ) + 1  )
      }, function( e ) {
        $( "#count_poohere" ).text( parseInt( db[d.id].poohere ) );
      });

  },
  comment_load : function( db ) {
    $( "#modal-detail-body" ).html( function(){
      var r = '<div class="media" id="container_list_comment"  v-for="item in items">' +
                '<div class="media-left">' +
                  '<a v-html="lv(item.rating)"></a>' +
                '</div>' +
                '<div class="media-body">' +
                  '<h4 class="media-heading mt10">{{ item.comment }}</h4>' +
                  '<p>{{ item.datetime }}</p>' +
                '</div>' +
              '</div>';
      return r;
    });

    var container_list_comment = new Vue({
      el: '#modal-detail-body',
      data: {
        lv : function( rating ) {
          return gp.lv( rating );
        },
        items: db
      }
    });
  }
};

$( function(){
  console.log( "สวัสดีครับ ยินดีต้องรับสู่ GoPoo" );
  locationNow();

  $("#rateYo").rateYo({
    onChange: function (rating, rateYoInstance) {
      $( "#container_rateYo" ).attr( "data-rating", rating );
    },
    rating    : 5,
    fullStar: true,
    maxValue: 10,
    spacing   : "3px",
    starWidth: "14px",
    multiColor: {
       "startColor": "#FF0000", //RED
       "endColor"  : "#00FF00"  //GREEN
    }
  });

  /** Setting item **/
  var setting_item =  [
                        { label: 'ร้านอาหาร', value: 'restaurant' },
                        { label: 'โรงเรียน', value: 'school' },
                        { label: 'ห้างสรรพสินค้า', value: 'supermarket' },
                        { label: 'ร้านค้า', value: 'shop' },
                        { label: 'โรงพยาบาล', value: 'hospital' },
                        { label: 'ปั้มน้ำมัน', value: 'pestrol station' },
                        { label: 'โรงแรม', value: 'hotel' },
                        { label: 'โรงภาพยนตร์', value: 'cinema' },
                        { label: 'วัด', value: 'worship' },
                      ];
  $.each( setting_item, function( k, v ) {
    $( "#list_setting" ).prepend(
      $( "<li>" )
        .html( '<a href="#"><label><input type="checkbox" name="check_setting" value="' + v.value + '"> ' + v.label + '</label></a>' )
    );
  });

  if( $.cookie("listsetting") ) {
    $.each( $.cookie("listsetting").split(";") , function( k, v ) {
      var input_name = 'input[name=check_setting][value="' + v + '"]';
      $( input_name ).prop( "checked", true );
    });
  } else {
    $.cookie( "listsetting", "pestrol station;worship" );
  }

  $( "input[name=check_setting]" ).each( function() {
    $( this ).change( function() {
      var chksetting = [];
      $( "input[name=check_setting]:checked" ).each( function() {
        chksetting.push( $(this).val() );
      });
      $.cookie("listsetting", chksetting.join(";") );
      return false;
    });
  });

  $('#list_setting').click(function(e) {
      e.stopPropagation();
  });



  /** Add Place **/
  $( "#bt_goopoo_add" ).click( function() {
    var  pos_ = {
      lat : $( this ).attr( "data-lat" ),
      lng : $( this ).attr( "data-lng" )
    };
    var data = {
      id : gp.lo_db_convert( 'p' + pos_.lat + pos_.lng ) ,
      lat : pos_.lat,
      lng : pos_.lng,
      name : $("#namegopoo").val(),
      caption : $("#detailgopoo").val(),
      type : 1 //0 =gmap 1 = human
    };

    gp.db_insert_place( data, $( function() {
      alert( "เพิ่มจุด GoPoo นี้แล้ว! สถานที่นี้จะช่วยให้เพื่อนมนุษย์หลุดพ้นจากความทุกข์ทรมานได้!!" );

      var place = {
        lat : pos_.lat,
        lng : pos_.lng,
        type : 1,
      };

      createMarker( place );
      $( "#addModal" ).modal('toggle');
    }) );
  });

});

var sortObjectByKey = function(obj) {
  var keys = [];
  var sorted_obj = {};

  for(var key in obj){
      if(obj.hasOwnProperty(key)){
          keys.push(key);
      }
  }

  // sort keys
  keys.sort();

  // create new array based on Sorted Keys
  jQuery.each(keys, function(i, key){
      sorted_obj[key] = obj[key];
  });

  return sorted_obj;
};



alert(calcCrow(59.3293371,13.4877472,59.3225525,13.4619422).toFixed(1));



//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value)
{
    return Value * Math.PI / 180;
}
