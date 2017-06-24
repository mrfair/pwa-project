var gp = {
  gguserphoto : function( p ) {
    if( p[0].html_attributions[0] ) {
      var link = $( p[0].html_attributions[0] ).attr( "href" );
      return '<a target="_blank" href="' + link + '" target="gguserframe"><span class="glyphicon glyphicon-new-window ml10 f12"></span> ภาพบรรยากาศ</a>';
    }
  },
  modal_detail : function( p, lo ) {
    var plat= p.geometry.location.lat();
    var plng = p.geometry.location.lng();

    map.setCenter({ lat: plat, lng: plng });

    $( "#mycomment" ).val( "" );
    $( "#myModal" ).modal('show');

    console.log( p );
    map.setCenter( p.geometry.location );

    /* Check db */


    if( !db[lo] ) {
      var data = {
        id : lo,
        lat : plat,
        lng : plng,
        name : p.name
      };
      gp.db_insert_place( data );
    }

    $("#modal-detail-title").html(function() {
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
        gp.db_update_poohere( db[lo] );
      });

  },
  lo_db_convert : function( a ) {
    return a.split(".").join("_");
  },
  db_insert_place : function( d ) {
    firebase.database().ref( d.id ).set({
      id : d.id,
      lat: d.lat,
      lng: d.lng,
      name : d.name,
      poohere : "0",
      review : []
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
                  '<a href="#">{{ item.rating }}</a>' +
                '</div>' +
                '<div class="media-body">' +
                  '<h4 class="media-heading mt10">{{ item.comment }}</h4>' +
                  '<p>{{ item.datetime }}</p>' +
                '</div>' +
              '</div>';
      return r;
    });

    var container_list_comment = new Vue({
      el: '.modal-body',
      data: {
        items: db
      }
    });
  }
};

$( function(){
  console.log( "สวัสดีครับ ยินดีต้องรับสู่ GoPoo" );

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

  locationNow();
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
}
